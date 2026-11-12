---
title: "WebRTC 传输原理：媒体与 DataChannel 怎样工作"
pubDatetime: 2023-04-13T16:54:00+08:00
description: "结合分享中的媒体与协议配图，理解 RTP 和抖动缓冲、丢包恢复、GCC 拥塞控制、DataChannel 交付策略，以及 DTLS 和 SRTP 的安全边界。"
categories: ["音视频与图像"]
tags: ["WebRTC", "音视频", "拥塞控制", "DataChannel"]
featured: false
draft: false
---

在[连接篇](/2026/11/12/webrtc/)中，两台处于不同内网的设备通过地址交换、打洞或中继，找到了一条能够互通的路径。接下来，声音、画面和普通消息还要面对丢包、乱序、抖动与拥塞。

这些数据的要求并不相同：音视频需要赶上播放时间，文件要尽量完整，游戏或鼠标位置更新则更在意最新状态。WebRTC 为媒体与 DataChannel 提供了不同的传输机制，再通过加密保护内容。

这篇沿用数据传输分享中的过程图，从媒体包怎样还原成画面讲起，再看发送端怎样适应网络，以及普通消息如何选择交付策略。

## 1. 媒体要赶上播放时间

连接建立后，音视频面临的约束是：**数据要在播放时间之前到达，才有价值。**

一份文件少了一块，我们通常愿意等它重传。通话里的某个音频片段晚到几秒，补齐它也无法恢复当时的交流。因此，媒体传输需要同时考虑内容完整度和播放时间。在典型 UDP 路径中，上层协议会根据这些要求选择恢复方式。

### RTP 把媒体拆成带有时间信息的数据包

RTP 携带编码后的媒体，同时提供序列号和时间戳等信息。

<figure>
  <img src="/images/webrtc/10-rtp-packet.webp" alt="RTP 报文结构，其中包括 Sequence Number、Timestamp 和 Payload 字段" width="592" height="372" loading="lazy" decoding="async">
  <figcaption>Sequence Number 用于识别顺序与序号缺口，Timestamp 表达媒体采样时间，Payload 承载实际媒体数据。</figcaption>
</figure>

序列号随 RTP 包递增，接收端可以据此发现乱序和缺口。时间戳采用相应媒体的时钟频率，并不直接等于系统时钟的时间。一帧较大的画面往往拆成多个 RTP 包，这些包可以拥有相同的时间戳。[RTP 规范](https://www.rfc-editor.org/rfc/rfc3550.html)

### Jitter Buffer 等待乱序的数据

数据包的发送顺序和到达顺序可能不同。下面的例子里，一帧画面拆成四个包，4 先到，随后才到 3、1、2。接收端需要先整理这些数据，才能交给解码器。

<figure>
  <img src="/images/webrtc/11-jitter-buffer.webp" alt="一帧视频拆为四个 RTP 包，乱序到达接收端，经过 Jitter Buffer 收集和组帧后交给解码器" width="3432" height="1986" loading="lazy" decoding="async">
  <figcaption>缓冲区为乱序与抖动留出等待时间，让零散数据能够重新组成可解码的媒体。</figcaption>
</figure>

Jitter Buffer，也就是抖动缓冲区，会参与缓冲、排序与播放调度。多等一会儿可以吸收更多抖动，同时也会增加通话延迟。缓冲时长需要在连续性和实时性之间取舍。

### 丢失的包对后续画面也有影响

视频编码会利用帧间预测减少重复信息。下面用 I、P、B 帧说明依赖关系：某些帧能够独立解码，另一些需要参考其他帧。具体实时编码结构取决于编码器和配置，并非都会使用 B 帧。

<figure>
  <img src="/images/webrtc/12-frame-dependencies.webp" alt="I 帧、P 帧和 B 帧之间通过预测关系相互依赖的示意" width="2870" height="576" loading="lazy" decoding="async">
  <figcaption>参考画面受损时，影响可能沿着预测依赖传播到后续画面。</figcaption>
</figure>

这也解释了为什么接收端既可能请求重传某个包，也可能请求发送端刷新画面。RTCP 承担这些反馈：

| 机制         | 表达什么                    | 发送端可能采取的动作           |
| ------------ | --------------------------- | ------------------------------ |
| Generic NACK | 某些 RTP 序列号对应的包缺失 | 在仍有价值时重传相应数据包     |
| PLI          | 画面丢失，解码参考可能受损  | 刷新画面，常见做法是发送关键帧 |
| FIR          | 请求完整的帧内刷新点        | 生成新的解码刷新点             |

NACK 关注缺失的包，PLI 和 FIR 关注解码状态的恢复。新的关键帧也可能拆成多个 RTP 包发送；关键帧之外，其他参考帧丢失同样可能影响后续解码。[RTCP 反馈规范](https://www.rfc-editor.org/rfc/rfc4585.html)、[FIR 规范](https://www.rfc-editor.org/rfc/rfc5104.html)

重传需要看时间和成本。包已经赶不上播放，或者额外流量会进一步加重拥塞，补发的收益就很低。发送端会结合包的重要程度和网络 RTT 决定是否补发；FEC 则通过额外冗余提高一定范围内的恢复能力。这些机制都要付出带宽或延迟成本。[WebRTC 媒体传输规范](https://www.rfc-editor.org/rfc/rfc8834.html)

## 2. 让发送速度跟上网络变化

假设视频持续以 3 Mbps 发送，而路径可用容量突然降到 1 Mbps，超出的流量会开始排队或丢失。即使每个丢包都能补回，队列持续增长也会让通话越来越滞后。

发送端需要根据反馈估计当前可用的发送速率，再让编码码率、分辨率和帧率适应这个预算。要完成调整，首先需要观察网络发生了什么。

### 用接收报告估算 RTT

RTCP 的发送方报告（SR）和接收报告块可以帮助估算 RTT。发送端记录发出 SR 的时刻，接收端在报告中返回对应信息，同时带上收到 SR 到发出报告之间的等待时间。

<figure style="max-width: 32rem; margin-inline: auto;">
  <img src="/images/webrtc/13-rtcp-rtt.webp" alt="发送端发出 SR，接收端返回接收报告，发送端扣除接收侧等待时间后得到往返耗时" width="605" height="453" loading="lazy" decoding="async">
  <figcaption>使用发送端自己的两个时间点做差，再扣除接收端的等待时间。</figcaption>
</figure>

用同一发送端的时间描述，T1 是发送 SR 的时刻，T2 是收到相关接收报告的时刻，D 是接收端等待时间，概念上的计算为：

`RTT = T2 − T1 − D`

协议中通过 LSR 和 DLSR 等字段完成计算。RTT 反映往返耗时，两边路径可能不对称，把 RTT 除以二只能得到单向耗时的粗略估计。[RTP 的接收报告与 RTT 计算](https://www.rfc-editor.org/rfc/rfc3550.html#section-6.4.1)

### 观察延迟是否持续增长

RTT 给出往返耗时，发送与到达间隔的差值还可以帮助观察排队趋势。设相邻两个包或包组的发送时刻为 S1、S2，到达时刻为 A1、A2：

`延迟变化 = (A2 − A1) − (S2 − S1)`

<figure style="max-width: 32rem; margin-inline: auto;">
  <img src="/images/webrtc/14-delay-gradient.webp" alt="发送侧的相邻帧时间间隔与接收侧的到达间隔做差，得到延迟变化" width="460" height="240" loading="lazy" decoding="async">
  <figcaption>比较各端自己的时间差，固定的时钟偏移会抵消。</figcaption>
</figure>

例如，发送间隔是 20 ms，到达间隔变成 35 ms，这次观测就增加了 15 ms 的相对延迟。下面两张图把这个变化放回路由器的转发过程里：

<figure>
  <div class="grid gap-4 sm:grid-cols-2">
    <img src="/images/webrtc/15-network-normal.webp" alt="正常传输中，各个数据包通过路由器后仍保持接近原来的间隔" width="1065" height="735" loading="lazy" decoding="async">
    <img src="/images/webrtc/16-network-queue.webp" alt="第二个包在路由器中排队，到达接收端时与第一个包的间隔明显增大" width="995" height="763" loading="lazy" decoding="async">
  </div>
  <figcaption>第一张图没有明显排队，第二张图的中间数据包等待转发，导致到达间隔被拉长。</figcaption>
</figure>

持续出现正向变化，可能意味着路径中的队列正在增长。网络流量回落、队列逐渐排空时，延迟变化也可能为负。单次变化仍可能来自抖动或乱序，需要平滑观测后再判断趋势。

### GCC 把反馈转成发送预算

GCC（Google Congestion Control）结合延迟、丢包和接收速率等反馈估计发送预算。早期 GCC 可以用下面两条反馈线理解：一条观察丢包，另一条观察延迟变化，再综合确定发送速率。

<figure>
  <img src="/images/webrtc/17-gcc-overview.webp" alt="早期 GCC 将网络反馈分别交给丢包估计与延迟估计，再综合得到带宽估计值" width="1300" height="599" loading="lazy" decoding="async">
  <figcaption>早期 GCC 的简化框架，用两条反馈线说明带宽估计的思路。</figcaption>
</figure>

基于延迟的判断需要先处理噪声，再与自适应阈值比较。下面的图中，蓝线表示延迟变化的估计，红线是上下阈值。持续高于上阈值时进入 overuse，低于下阈值时进入 underuse，中间区域对应 normal。

<figure style="max-width: 32rem; margin-inline: auto;">
  <img src="/images/webrtc/18-overuse-detection.webp" alt="蓝色延迟估计线与红色上下阈值比较，背景区分 overuse、underuse 和 normal 状态" width="437" height="194" loading="lazy" decoding="async">
  <figcaption>用平滑后的趋势判断排队变化，减少偶发抖动引起的误判。</figcaption>
</figure>

这些状态会影响后续速率调整：发现拥塞时减少发送；队列正在消退时可以先保持预算；网络稳定后再谨慎探测能否增加流量。状态反映的是排队趋势，还需要结合其他观测决定具体发送速度。

GCC 的实现会随版本演进。例如，当前 libwebrtc 的延迟估计路径使用 TrendlineEstimator，对平滑后的延迟历史进行线性拟合。图中的早期框架适合解释反馈过程，具体阈值、滤波器和速率调整方式需要看对应实现。[libwebrtc 延迟估计](https://webrtc.googlesource.com/src/+/refs/heads/main/modules/congestion_controller/goog_cc/delay_based_bwe.cc)、[趋势估计](https://webrtc.googlesource.com/src/+/refs/heads/main/modules/congestion_controller/goog_cc/trendline_estimator.cc)

## 3. DataChannel 怎样选择交付策略

聊天文本、文件、游戏状态和鼠标位置对交付的要求并不相同。文件缺一块就不完整，鼠标旧坐标晚到后却可能已经失去意义。

DataChannel 通过 SCTP 承载消息，支持有序或无序交付，也支持完全可靠或部分可靠传输。浏览器中的默认配置是有序、可靠，开发者可以根据业务改变它。[WebRTC 数据通道规范](https://www.rfc-editor.org/rfc/rfc8831.html)

### 按消息价值配置可靠性

下面假设 `pc` 已经是一个 `RTCPeerConnection` 实例，分别创建聊天和位置更新通道：

```javascript
// 聊天消息采用默认的有序可靠传输。
const chat = pc.createDataChannel("chat");

// 位置更新允许乱序，不对丢失的消息进行重传。
const position = pc.createDataChannel("position", {
  ordered: false,
  maxRetransmits: 0,
});
```

`ordered: false` 只改变交付顺序，本身不会关闭重传。`maxRetransmits` 限制重传次数，`maxPacketLifeTime` 限制传输和重传的时间窗口，这两个限制不能同时设置。生命周期设置也不等于端到端送达时限，接收端仍可能需要按消息时间或版本丢弃过期状态。[DataChannel API](https://w3c.github.io/webrtc-pc/#rtcdatachannel)

可靠传输同样有成本。有序通道中的前序消息缺失时，后续消息可能需要等待。多个通道虽然可以选择不同策略，同一 SCTP association 下的流仍共享拥塞控制资源，批量文件传输也会与其他通道争夺发送能力。

### DCEP 协商通道参数

默认的通道内协商使用 DCEP，也就是数据通道建立协议。它通过 DATA_CHANNEL_OPEN 和 DATA_CHANNEL_ACK 消息交换通道设置，OPEN 中包含通道类型、可靠性参数和标签等信息。

<figure style="max-width: 32rem; margin-inline: auto;">
  <img src="/images/webrtc/19-dcep-handshake.webp" alt="发起端发送 DCEP DataChannelOpen，接收端返回 DataChannelACK，双方使用 SCTP 承载数据" width="642" height="627" loading="lazy" decoding="async">
  <figcaption>DCEP 协商通道设置，SCTP 承载后续消息。</figcaption>
</figure>

应用也可以使用 `negotiated: true`，在两端自行约定通道 ID 和参数。DCEP 的两次消息交换说明基本协商过程，规范还允许在等待 ACK 时发送用户数据。[DCEP 规范](https://www.rfc-editor.org/rfc/rfc8832.html)

### SCTP 用序号和确认识别缺口

SCTP 将消息承载在数据块中，用 TSN 标识相应数据块。接收端通过 SACK 报告连续收到的部分，以及缺口之后已经收到的区间。

例如，假设此前已经连续收到所有更小的 TSN，这次又收到 1、3、4，但还没有收到 2：

- 累积确认点停在 1，表示到这里为止都已连续收到。
- Gap Ack Block 报告 3 到 4 已收到，对应相对累积确认点的偏移 2 到 3。
- 发送端据此发现缺口，再按重传机制处理 TSN 2。

累积确认点表达连续收到的最高位置，因此这里不能前进到 4。[SCTP 的 SACK 定义](https://www.rfc-editor.org/rfc/rfc9260.html#section-3.3.4)

<details>
  <summary>查看 SCTP DATA 与 SACK 的报文结构</summary>

<figure>
  <img src="/images/webrtc/20-sctp-data.webp" alt="SCTP DATA 数据块包含 TSN、流标识、流序号和用户载荷" width="599" height="397" loading="lazy" decoding="async">
  <figcaption>DATA 中的 TSN 标识数据块，传统 DATA 格式中的 Stream Sequence Number 用于相应流内的有序交付。</figcaption>
</figure>

<figure>
  <img src="/images/webrtc/21-sctp-sack.webp" alt="SCTP SACK 确认块包含 Cumulative TSN Ack 和多个 Gap Ack Block" width="603" height="722" loading="lazy" decoding="async">
  <figcaption>Cumulative TSN Ack 给出连续确认点，Gap Ack Blocks 补充缺口之后已经收到的区间。</figcaption>
</figure>

</details>

调用 `send()` 成功只说明数据进入本端发送流程。对于必须确认业务处理完成的消息，应用仍需要设计应答；大批量发送还应监控 `bufferedAmount`，缓冲区积压时暂停生产，等待 `bufferedamountlow` 再继续。[DataChannel 的发送与缓冲](https://w3c.github.io/webrtc-pc/#dom-rtcdatachannel-send)

## 4. 加密保护到哪一层

重传、有序交付和拥塞控制解决传输质量。数据经过哪些设备、这些设备能看到什么，需要看加密会话的边界。

在典型 UDP 路径上，媒体和普通数据使用不同的安全封装：

<figure>
  <img src="/images/webrtc/transport-stack.svg" alt="音视频通过 SRTP 和 SRTCP 保护，应用消息经过 SCTP 和 DTLS，两者共用 ICE 选定的传输路径" width="720" height="530" loading="lazy" decoding="async">
  <figcaption>DTLS 握手也为媒体协商密钥，实际媒体包使用 SRTP 传输。</figcaption>
</figure>

**媒体通过 SRTP 和 SRTCP 保护，DataChannel 的 SCTP 数据封装在 DTLS 中。** WebRTC 要求对这些流量进行加密和完整性保护。[WebRTC 传输规范](https://www.rfc-editor.org/rfc/rfc8835.html)

SDP 中的证书指纹参与绑定握手时的对端证书，因此信令传输和呼叫身份也必须可信。HTTPS 或 WSS 可以保护到信令服务的链路；如果还需要抵御恶意信令服务替换身份，就需要独立验证对端密钥或身份。[WebRTC 安全架构](https://www.rfc-editor.org/rfc/rfc8827.html#section-9.1)

### TURN 与 SFU 的安全边界

回看前面的 TURN 中继图，Server T 只负责转发数据包，浏览器之间的加密会话贯穿中继路径。仅提供转发的 TURN 服务通常无法读取媒体和 DataChannel 的明文内容，但仍可以观察通信地址、流量大小和时间等信息。

多人会议常使用 SFU，也就是选择性转发单元，由媒体服务器分发媒体。如果每个浏览器分别与 SFU 建立 DTLS-SRTP 会话，SFU 就处在这些加密会话的端点，可以接触解密后的媒体载荷。

要让媒体服务器也无法读取内容，还需要额外的端到端媒体加密与密钥管理。SFrame 就面向这种场景，让 SFU 读取转发所需的元数据，同时保护实际媒体内容。[SFrame 规范](https://www.rfc-editor.org/rfc/rfc9605.html)

浏览器的媒体权限也属于这个边界。获取摄像头和麦克风需要安全上下文以及相应授权，应用还需要处理房间鉴权、成员校验和录制权限。[媒体采集与权限规范](https://www.w3.org/TR/mediacapture-streams/)

## 5. 排查时沿着各层往下找

把上面的过程连起来，排查问题时就可以先确定当前卡在哪一层。

| 现象                         | 优先观察的证据                                      |
| ---------------------------- | --------------------------------------------------- |
| 对方没有收到呼叫或会话描述   | 信令投递、房间路由、Offer 与 Answer 的处理结果      |
| 收到了描述但始终连不上       | ICE 状态、双方候选、候选添加错误、TURN 分配是否成功 |
| 找到了可用路径但安全会话失败 | DTLS 状态、证书指纹和会话参数                       |
| 通道对象出现但消息发不出去   | DataChannel 的 readyState、open 事件和发送缓冲区    |
| 通话延迟增加或画面卡顿       | 丢包、RTT、jitter、抖动缓冲延迟、收发码率和解码表现 |

`getStats()` 提供候选对、传输、收发 RTP 流等统计。沿传输统计中的 `selectedCandidatePairId` 找到实际选定的候选对，可以查看路径是否使用 relay，以及对应的 RTT。观察媒体时，记录随时间变化的指标，再与用户感知的问题对齐。[WebRTC 统计规范](https://www.w3.org/TR/webrtc-stats/)

媒体传输围绕播放时间恢复内容，拥塞控制让发送速度适应网络，DataChannel 按消息价值选择交付策略，加密会话则决定内容保护到哪里。这些机制各自处理一部分问题，也共同影响一次实时通信的体验。

[回到《WebRTC 连接原理：NAT 穿透与 ICE 建连》](/2026/11/12/webrtc/)
