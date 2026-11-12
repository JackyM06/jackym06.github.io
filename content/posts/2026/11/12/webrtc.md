---
title: "WebRTC 连接原理：NAT 穿透与 ICE 建连"
pubDatetime: 2023-04-13T16:54:00+08:00
description: "结合分享中的手绘过程图，理解 NAT 地址映射与过滤、UDP 打洞、TURN 中继，以及 ICE 和 Offer Answer 如何组织 WebRTC 的连接建立。"
categories: ["音视频与图像"]
tags: ["WebRTC", "NAT", "ICE", "网络协议"]
featured: false
draft: false
---

点击视频通话按钮后，浏览器很快就能把声音和画面传到另一端。但两个用户可能分别处在家庭宽带和移动网络里，彼此不知道对方的可达地址，如何建立连接就成了第一个问题。

WebRTC（Web Real-Time Communication）为浏览器和其他支持相关协议的终端提供实时音视频与普通数据通信能力。连接时，它会尝试发现地址、检验可达性，再选出能够互通的路径。

这篇先沿着手绘过程图，把两台内网设备的建连过程走一遍。图示来自我之前的 WebRTC 连接原理分享；连接之后的媒体传输、DataChannel 和安全机制，接着放在[传输篇](/2026/11/12/webrtc-transport/)里讲。

## 1. NAT 怎样改变设备的地址

### 出站访问背后的映射

家里的电脑可以访问外部网站，外部设备却通常无法直接通过一个内网地址访问这台电脑。先看下面这张网络结构图：

<figure>
  <img src="/images/webrtc/01-nat-network.webp" alt="两台内网电脑通过 NAT 共用外部地址访问互联网服务器" width="890" height="343" loading="lazy" decoding="async">
  <figcaption>内网设备先经过 NAT，再使用外部地址访问互联网。</figcaption>
</figure>

以常见的网络地址端口转换（NAPT）为例，内网设备发出的包经过路由器时，来源 IP 和端口会被改写成外部地址。路由器同时记录映射关系，让返回的数据能够找到原来的设备。

<figure>
  <img src="/images/webrtc/02-nat-mapping.webp" alt="NAT 将内网来源地址转换为外部地址，并在 NAT MAP 中保存对应关系" width="864" height="466" loading="lazy" decoding="async">
  <figcaption>图中的 NAT MAP 记录内外地址的对应关系，返回的数据依据这条映射进入内网。</figcaption>
</figure>

例如，本地 socket 是 `192.168.1.10:5000`，对外可能表现为 `203.0.113.10:62000`。两台电脑如果处在不同内网中，单独交换各自的私有地址，通常无法完成通信。

### 外部映射也可能随着目标变化

事情还会更复杂一些。同一个本地 socket 访问外部设备 A、B 时，有的 NAT 会复用原来的外部映射，有的会根据目标重新分配外部端口。

<figure>
  <div class="grid gap-4 sm:grid-cols-2">
    <img src="/images/webrtc/03-reused-mapping.webp" alt="访问外部 A 和 B 时复用同一个外部地址与端口" width="915" height="693" loading="lazy" decoding="async">
    <img src="/images/webrtc/04-destination-mapping.webp" alt="访问外部 A 和 B 时分别使用不同的外部端口" width="910" height="663" loading="lazy" decoding="async">
  </div>
  <figcaption>第一张图复用外部映射，第二张图随目标改变映射。向某个服务器发现的外部地址，未必能直接复用于另一个目标。</figcaption>
</figure>

除了映射，还要看**入站过滤**：对方的包满足什么条件，才能通过 NAT 进入内网。有的允许任意外部来源，有的要求本端先访问过相同的目标 IP，或者相同的 IP 和端口。

因此，理解 NAT 穿透时，需要分别观察映射方式和过滤方式。早期常见的锥形、对称型等分类可以辅助理解，但现实连接还受到多层 NAT 和防火墙策略的影响。[NAT 行为规范](https://www.rfc-editor.org/rfc/rfc4787.html)

## 2. 先交换地址，再互相打洞

知道本地地址后，设备还需要知道自己在外部表现成什么地址。**STUN 服务**承担的一个职责，就是把请求中观察到的来源 IP 和端口返回给端点。这个结果可以作为连接候选，随后还要检验它能否被另一端访问。[STUN 规范](https://www.rfc-editor.org/rfc/rfc8489.html)

双方也需要一条交换信息的链路。应用通常用 WebSocket、HTTP 等方式实现信令服务，传递候选地址和会话描述。WebRTC 没有规定具体的信令协议，用户身份、房间管理和呼叫关系也由应用决定。

接下来用原分享中的场景看一次打洞。两端的外部映射可以复用，入站过滤要求本端先向目标 IP 和端口发送过数据。图中的 Server S 协助双方交换地址信息；在实际系统中，信令服务与 STUN 服务分别负责信息交换和地址发现。

### 第一步排除不可达的内网地址

A 和 B 拿到的候选里，可能同时包含内网地址和外部地址。如果恰好处在能互相访问的同一网络里，本地候选就可能有用；图中的两端分属不同内网，因此这条路走不通。

<figure style="max-width: 32rem; margin-inline: auto;">
  <img src="/images/webrtc/05-private-address-fails.webp" alt="A 和 B 各自拿到了对方的内网与外部地址，但两端不在同一个内网，私有地址无法直接互通" width="1062" height="1074" loading="lazy" decoding="async">
  <figcaption>双方拿到地址列表后，还需要逐一检查可达性。这里两个内网地址无法互通。</figcaption>
</figure>

### 第二步由 A 向 B 发出探测

A 改用 B 的外部地址发送数据。此时 B 还没有向 A 发过包，B 的 NAT 可能丢弃这次访问。但 A 的发送已经起了作用：A 一侧建立了允许 B 回包的状态。

<figure style="max-width: 32rem; margin-inline: auto;">
  <img src="/images/webrtc/06-first-probe.webp" alt="A 向 B 的外部地址发送探测包，包在 B 的 NAT 处被拒绝，A 一侧已经允许 B 的外部地址回包" width="1242" height="1109" loading="lazy" decoding="async">
  <figcaption>探测包虽然没有到达 B，A 一侧已经为反向通信准备了条件。</figcaption>
</figure>

### 第三步由 B 向 A 发出探测

B 也向 A 的外部地址发送数据。这次包有机会通过 A 的过滤，抵达 A。同时，B 一侧也建立了允许 A 回包的状态。A 后续继续探测，双向路径就有机会打通。

<figure style="max-width: 32rem; margin-inline: auto;">
  <img src="/images/webrtc/07-return-probe.webp" alt="B 向 A 发送探测包并抵达 A，B 的 NAT 同时允许来自 A 的外部地址与端口的数据进入" width="1227" height="1081" loading="lazy" decoding="async">
  <figcaption>双方主动发送，分别建立对方回包所需的状态。</figcaption>
</figure>

这就是 UDP 打洞的基本思路。它依赖具体的映射与过滤行为，最初几个包被丢弃也不一定意味着失败。如果外部映射随目标变化，或者中间设备禁止这些流量，仍然可能无法直连。

## 3. TURN 和 ICE 怎样完成建连

### TURN 提供一条中继路径

直连路径不可用时，可以让两端分别主动访问一台中继服务器，再由它转发数据。TURN 就提供这样的服务。

<figure style="max-width: 32rem; margin-inline: auto;">
  <img src="/images/webrtc/08-turn-relay.webp" alt="A 和 B 分别与 Server T 建立转发路径，通过 TURN 中继交换数据" width="1183" height="1074" loading="lazy" decoding="async">
  <figcaption>Server T 承担实际数据转发。信令交换与业务数据转发是不同的职责。</figcaption>
</figure>

TURN 可以为端点分配中继地址，并转发媒体或 DataChannel 流量。它承担实际业务流量，因此容量规划需要考虑中继带宽。应用也可以出于隐私或网络策略的要求，主动选择只使用中继路径。[TURN 规范](https://www.rfc-editor.org/rfc/rfc8656.html)

### ICE 收集候选并检验路径

本地地址、STUN 发现的地址、TURN 分配的地址都可以进入候选集合。ICE（Interactive Connectivity Establishment，交互式连接建立）把候选收集、连通性检查和路径选定组织起来。

| 候选类型 | 来源                                               |
| -------- | -------------------------------------------------- |
| host     | 本机网络接口，浏览器可能使用 mDNS 名称隐藏本地地址 |
| srflx    | 向 STUN 服务请求后发现的服务器反射候选             |
| relay    | 向 TURN 服务申请得到的中继候选                     |
| prflx    | 连通性检查过程中发现的对端反射候选                 |

端点把本地候选与对方的远端候选组成候选对，再用 STUN Binding 请求验证可达性，最后根据优先级和检查结果选定路径。TURN 候选可以提前收集和检查，准备中继与尝试直连可以交错进行；设置 `iceTransportPolicy: "relay"` 时，则只使用中继路径。[ICE 规范](https://www.rfc-editor.org/rfc/rfc8445.html)

### Offer 和 Answer 协商会话

双方还需要确定传输什么、使用哪些编解码能力，以及怎样建立安全会话。WebRTC 使用 SDP（Session Description Protocol，会话描述协议）描述这些参数，其中包括媒体能力、ICE 凭据和 DTLS 证书指纹。

Offer 提出会话参数，Answer 给出应答。下面这张图把候选收集、会话描述交换和连通性检查按顺序展开，图中的 Offer、Answer 通过应用的信令链路传递。

<figure style="max-width: 32rem; margin-inline: auto;">
  <img src="/images/webrtc/09-offer-answer.webp" alt="Peer A 和 Peer B 收集候选并交换 Offer SDP、Answer SDP，随后使用 STUN 检查双向连通性" width="941" height="1047" loading="lazy" decoding="async">
  <figcaption>建连的基本过程。图中的 Data Transmission 还需要等待相应安全传输与通道准备完成。</figcaption>
</figure>

实际应用常使用 Trickle ICE：候选发现一个就通知对方，无需全部收集完再一起交换，检查也能更早开始。[Trickle ICE 规范](https://www.rfc-editor.org/rfc/rfc8838.html)

对应到浏览器 API，基本操作是：

1. 创建 `RTCPeerConnection`，添加媒体轨道或创建 DataChannel。
2. 发起端创建 Offer，调用 `setLocalDescription()`，把会话描述交给信令服务。
3. 接收端调用 `setRemoteDescription()`，创建并设置本地 Answer，再回传给发起端。
4. 发起端收到 Answer 后，调用 `setRemoteDescription()` 设置远端描述。
5. 双方通过 `icecandidate` 事件取得本地候选，并用 `addIceCandidate()` 添加远端候选。
6. 等待相应连接与通道进入可用状态，再进行传输。

通常在设置本地描述后开始当前协商的 ICE 收集。如果远端候选早于远端描述到达，应用需要先暂存，等 `setRemoteDescription()` 完成后再添加。

生成 Answer、ICE 检查成功、DataChannel 可以发消息，分别对应不同阶段。DataChannel 要在 `readyState` 为 `open` 时才能发送。切换网络后，原有路径可能失效，应用还需要根据连接状态决定是否发起 ICE restart。[WebRTC API 规范](https://w3c.github.io/webrtc-pc/)

走到这里，双方已经协商了会话参数，也找到了一条能够互通的路径。接下来还要完成安全传输与通道的准备，才能持续交换有用的数据。

[继续阅读《WebRTC 传输原理：媒体与 DataChannel 怎样工作》](/2026/11/12/webrtc-transport/)
