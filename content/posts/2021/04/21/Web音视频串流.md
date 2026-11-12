---
title: "做直播，我们是认真的：Web 音视频串流"
pubDatetime: 2021-04-19T00:00:00+08:00
description: "梳理浏览器直播中的编码封装与传输协议，结合 WebSocket 和 RTMP 方案介绍推流、转发与播放"
categories: ["音视频与图像"]
tags: ["Node.js","音视频","直播"]
---

<a id="摘要"></a>

## 摘要

这次分享主要是对在浏览器环境中实现直播的相关技术介绍，其中包括了对音视频的格式以及推送、播放技术的探索。分享过程中还会对目前自己已经实现的一套Web直播方案进行分析。最后还会简单介绍现在比较热门的WebRTC技术。

<a id="音视频串流简介"></a>

## 音视频串流简介

音视频串流从广义角度来说，就是能够实现设备A将音视频画面同步传输给设备B进行播放，例如电视投屏、会议投屏。而今天所介绍的Web音视频串流主要是实现允许用户在浏览器环境就能完成串流。

一个完整的Web媒体串流应当具备3种角色，推流客户端（主播侧），媒体服务器（MediaServer）和拉流客户端（观众侧）。其中推流和拉流客户端其实都是在网页中进行处理的，而MediaServer位于服务端，并且要能够完成同时接收来自不同推流客户端的流数据，并对这些流进行区分，向拉流客户端提供获取对应流的渠道。

![Untitled Diagram (8)](https://raw.githubusercontent.com/JackyM06/MyPictures/master/Untitled%20Diagram%20\(8\).png)

<a id="关于音视频的编码和封装格式概念补充"></a>

## 关于音视频的编码和封装格式概念补充

<a id="音视频编码格式"></a>

### 音视频编码格式

在封装格式里的视频可以用不同的编码格式,编码格式简单的理解就是用特定的压缩技术把视频做些处理。不过容器其实也可以做些压缩处理。所以视频是可以在编码格式、容器格式中做两次压缩。

常见的编码格式有:mpeg-2、mpeg-4、h.263、h.264、RV40

<a id="音视频封装格式"></a>

### 音视频封装格式

封装格式就是把已经编码封装好的视频、音频按照一定的规范放到一起

同一种封装格式中可以放不同编码的视频，不过一种视频容器格式一般是只支持某几类编码格式的视频。我们能够最直观判断封装格式的方法就是文件后缀。

常见的容器格式有: MP4、rmvb、rm、flv、AVI、mov、WMV、mk

<a id="浏览器支持的格式"></a>

### 浏览器支持的格式

对于video标签来说，浏览器支持视频播放的封装格式有：MP4、WebM和Ogg。其中我们就MP4来说，必须使用h.264编码的视频和aac编码的音频，才能被浏览器正确解析，否则是没有办法播放的。

![Untitled Diagram (2)](https://raw.githubusercontent.com/JackyM06/MyPictures/master/Untitled%20Diagram%20\(2\).png)

下面列出了另外两种封装格式下浏览器能直接解码的音视频编码组合：

-   WebM ：使用 VP8 视频编解码器和 Vorbis 音频编解码器
-   Ogg：使用 Theora 视频编解码器和 Vorbis音频编解码器

<a id="适合媒体串流中的封装格式"></a>

### 适合媒体串流中的封装格式

由于在媒体串流的过程中，客户端是需要源源不断接受来自外界传输的音视频，并且需要播放已经接受到的部分，后文中把这种特殊的媒体简写为<strong>流媒体</strong>。

而不论是MP4还是WebM还是Ogg都是需要等待完整的数据传递完成后才能够开始播放，并且不能将多个音视频进行无缝连接播放，所以这三种格式统统无法没流媒体利用，凉凉。

因此我们需要其他更加适合串流的媒体封装格式，这里主要介绍下面两种，为后文作铺垫。

<a id="FLV（Flash-Video）封装格式"></a>

#### FLV（Flash Video）封装格式

![Untitled Diagram (5)](https://raw.githubusercontent.com/JackyM06/MyPictures/master/Untitled%20Diagram%20\(5\).png)

FLV格式的流中， 每一个音视频数据都被封装成了包含时间戳信息头的数据包。在传输时，只需要当播放器拿到这些数据包解包的时候能够根据时间戳信息把这些音视频数据和之前到达的音视频数据连续起来播放。

而MP4，MKV等等类似这种封装，必须拿到完整的音视频文件才能播放，因为里面的单个音视频数据块不带有时间戳信息，播放器不能将这些没有时间戳信息数据块连续起来，所以就不能实时的解码播放。

<a id="TS（Transport-Stream）封装格式"></a>

#### TS（Transport Stream）封装格式

就如TS（传输流）的命名，似乎天生就是为了流媒体而生的一种封装格式，其特点是多个TS片段可以被播放器无缝拼接进行播放，无需等待重新载入。不过TS的实现相对FLV要复杂许多，在此不再说明（太难了🤯）。

<a id="音视频串流的协议"></a>

## 音视频串流的协议

<a id="RTMP（Real-Time-Messaging-Protocol-实时信息控制协议）"></a>

### RTMP（Real Time Messaging Protocol 实时信息控制协议）

RTMP是 Adobe Systems 公司为 Flash 播放器和服务器之间音频、视频和数据传输开发的开放协议， 该协议在国内直播平台中较为普及。

RTMP 是一种基于TCP进行实时流媒体通信的网络协议，主要用来在 Flash 平台和支持 RTMP 协议的流媒体服务器之间进行音视频和数据通信。RTMP协议下可以用来拉流，也可以进行退流。在浏览器中并不支持RTMP协议，只能通过Flash插件进行处理。RTMP传输是所支持的媒体格式为FLV。

主播 ==> MediaServer ==> 观众

<a id="HTTP-FLV"></a>

### HTTP-FLV

这种协议主要是为了让原本只能在RTMP中进行传输的FLV音视频流也能够在HTTP下进行传输。主要是用于FLV能够在浏览器页面中进行播放，由于HTML的Video不直接支持Flv格式的音视频，所以在早期需要在网页中加入Flash插件才能够播放。目前大量的流媒体服务器 Media Server都支持了将FLV格式流通过HTTP-FLV的形式对外界进行开放。

<a id="HLS"></a>

### HLS

HLS（HTTP Living Stream） 是一个由苹果公司提出的基于 HTTP 的[流媒体](https://zh.wikipedia.org/wiki/流媒体)网络传输协议。

HLS 的工作原理是把整个流分成一个个小的基于 HTTP 的文件来下载，每次只下载一些。当媒体流正在播放时，客户端可以选择从许多不同的备用源中以不同的速率下载同样的资源，允许流媒体会话适应不同的数据速率。在开始一个流媒体会话时，客户端会下载一个包含元数据的 extended M3U (m3u8) playlist文件，用于寻找可用的媒体流。

![img](https://raw.githubusercontent.com/JackyM06/MyPictures/master/1382048-20180604152939120-1356963733.png)

来解释一下这张图，从左到右讲，左下方的inputs的视频源是什么格式都无所谓，他与server之间的通信协议也可以任意（比如RTMP），总之只要把视频数据传输到服务器上即可。这个视频在server服务器上被转换成HLS格式的视频（既TS和m3u8文件）文件。细拆分来看server里面的Media encoder的是一个转码模块负责将视频源中的视频数据转码到目标编码格式（H264）的视频数据。转码成H264视频数据之后，在stream segmenter模块将视频切片，切片的结果就是index file（m3u8）和ts文件了。图中的Distribution其实只是一个普通的HTTP文件服务器，然后客户端只需要访问一级m3u8文件的路径就会自动播放HLS视频流了。

说说m3u8文件

m3u8的命名来源是m3u文件 + utf-8编码而来，两者的文件内容是完全一样的。下文中直接称为m3u

m3u (移动图像专家组音频层3统一资源定位器)

m3u实际上就是一个索引文件，其中可以记录TS文件地址，客户端会按照下载的顺序进行连续播放。

![image-20210418115656418](https://raw.githubusercontent.com/JackyM06/MyPictures/master/image-20210418115656418.png)

对于一个记录了TS的文件M3U的文件内容如下

```text
#EXTM3U // 声明文件为M3U，必须写在第一行
#EXT-X-PLAYLIST-TYPE:VOD // 当前播放类型为点播
#EXT-X-TARGETDURATION:10 //每个视频分段最大的时长（单位秒）
#EXTINF:10, //下面ts切片的播放时长
2000kbps-00001.ts //ts文件路径
#EXTINF:10,
2000kbps-00002.ts
#ZEN-TOTAL-DURATION:20
#ZEN-AVERAGE-BANDWIDTH:2190954
#ZEN-MAXIMUM-BANDWIDTH:3536205
#EXT-X-ENDLIST // m3u结束指令
```

不光如此，m3u还可以记录二级m3u的文件的地址。

![1328846-d0df01e6b2dec3bb](https://raw.githubusercontent.com/JackyM06/MyPictures/master/1328846-d0df01e6b2dec3bb.png)

下面是一个记录了文件地址的m3u8内容

```text
#EXTM3U
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=2128000
drawingSword(1080p).m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1064000
drawingSword(720p).m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=564000
drawingSword(480p).m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=282000
drawingSword(360p).m3u8
#EXT-X-ENDLIST
```

bandwidth指定视频流的比特率，PROGRAM-ID表示资源的ID，每一个#EXT-X-STREAM-INF的下一行是二级index文件的路径，可以用相对路径也可以用绝对路径。例子中用的是相对路径。这个文件中记录了不同比特率视频流的二级index文件路径，客户端可以当前环境的网络带宽，来决定播放哪一个视频流。也可以在网络带宽变化的时候平滑切换到和带宽匹配的视频流。

<a id="HLS目前的不足"></a>

#### HLS目前的不足

由于HLS需要将采集到的音视频进行分片、客户端也需要对接受到的分片后的音视频进行合并处理，因此相对来时会存在比较大的延迟，大概会达到 10s左右。

<a id="HLS在浏览器中的兼容情况"></a>

##### HLS在浏览器中的兼容情况

事实上，HLS 在 PC 端仅支持safari浏览器，而其他大部分PC浏览器使用HTML5 video标签由于无法解析TS所以不能直接播放(需要通过hls.js)。移动端不论是安卓还是IOS统统都原生支持HLS。这点主要是由于HLS是由Apple公司推广的，苹果自家的浏览器上都是支持的，而安卓也进行了跟进。所以如果想要在PC浏览器上使用到HLS，仍然需要使用其他技术手段才能实现。

各协议总结：

| 协议 | http-flv | rtmp | hls |
| --- | --- | --- | --- |
| 传输层 | http | tcp | http |
| 视频格式 | flv | flv | Ts文件 |
| 延时 | 低 | 低 | 很高 |
| 数据分段 | 连续流 | 连续流 | 切片文件 |
| Html5播放 | 暂不支持 | 不支持 | 移动端支持 |

<a id="WebSocket-RTMP在网页中进行音视频串流的方案"></a>

## WebSocket + RTMP在网页中进行音视频串流的方案

所谓兼容RTMP的方案就是，把RTMP推流的工作放到中间服务层（此次以Node为例）去,而拉流通过流媒体服务器开放的HTTP-FLV，并在播放前使用Flv.js将转换后的流数据喂给Video去解析播放。

这里需要介绍一款处理音视频非常有效的工具 FFmpeg, 这款工具提供以命令行的方式去对视频进行转码、转封装格式、增加水印等等功能其中还包括了RTMP推流的功能。同时FFmpeg也为Node提供了一些控制的Bridge，在后文中，我会在中间层使用Node来控制FFmpeg进行音视频的推流。

![loadimage](https://raw.githubusercontent.com/JackyM06/MyPictures/master/loadimage.png)

<a id="推流客户端-gt-Node中间处理层"></a>

### 推流客户端 => Node中间处理层

这里有包括两种推流的音视频源，一种是实时录制自己的摄像头进行推流。另外一种是使用本地的视频文件进行发送。这里我们分开来讲

对于推流客户端推送实时录制的音视频数据时，其核心操作就用过浏览器来调用摄像头数据，并通过[MediaStreamRecorder.js](https://github.com/streamproc/MediaStreamRecorder)去捕获音视频二进制数据（Blob）注意此处每个时间片返回一个blob，获得当前时间片的Blob后通过WebSocket将blob数据传递给Node中间层。

而对于推流客户端推送视频格式的文件时，需要做的就是将视频文件按照每段时间的视频量进行分片。例如对于一个100s的视频，如果按照每段blob需要发送4s的数据量，那就需要分为25段blob，这些可以通过前端去进行分片，分片发送的中间Node层。后面的操作就和摄像头推流一致了。

<a id="Node中间处理层-gt-流媒体服务器"></a>

### Node中间处理层 => 流媒体服务器

在Blob数据抵达Node中间层后会被转化为Buffer，在Node层我们需要做的这些分段的视频格式转化为ts格式的片段，再将ts片段（这里就利用到了TS能够无缝拼接进行播放的特性，能够让ffmpeg推送持续的流媒体）通过ffmpeg将持续不断接受到的TS格式的流媒体转化为Flv流并通过RTMP推流到流媒体服务器上。

![Untitled Diagram (12)](https://raw.githubusercontent.com/JackyM06/MyPictures/master/Untitled%20Diagram%20\(12\).png)

流媒体服务器是在Node.js环境下通过node-media-server第三方包进行搭建。Node-media-server许多不同协议的推流和拉流的方法。其中它支持外界通过RTMP的方式进行推流拉流（端口1935），也支持将RTMP流转换为HTTP-FLV协议的流对外开放（端口8000）。通过Node-media-server建立一个流媒体服务步骤也很简单，只需要如下代码：

```javascript
const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

const nms = new NodeMediaServer(config)
nms.run();
```

在Node-media-server中，提供了通过使用不用的URL路径来对流进行区分。这里贴上一个官方提供的URL格式

```awk
rtmp://hostname:port/appname/stream
http://hostname:port/appname/stream.flv
```

例如对于音视频流A，它的URL是这样的：

rtmp://47.110.88.142:1935/live/root\_14465

可以看出对于这个流，appName这里被命名为了live, 而stream被命名为了root\_14465。对应的，如果想通过HTTP-FLV进行拉这条流，可以通过下面这条URL:

[http://47.110.88.142:8000/live/root\_14465.flv](http://47.110.88.142:8000/live/root_14465.flv)

在完成流媒体服务器的搭建后，不同用户会生成对应不同的推流URL，只要为观众发放正确对应的拉流URL就会播放正确的流数据。实现了并行串流的目的。

本地演示：

1.  起流媒体服务器
2.  通过ffmpeg推流
3.  通过http-flv拉流

<a id="流媒体服务器-gt-拉流客户端"></a>

### 流媒体服务器 => 拉流客户端

通过Http-flv进行传输，浏览器的video标签通过http获取到flv流后，使用Flv.js【后文中介绍】进行转换封包格式后为MP4后便能够持续播放。

<a id="Flv-js"></a>

#### Flv.js

B站开源的一款媒体流转码插件，该插件能够利用Js将接受到的HTTP-FLV实时转码为Video能够接受的MP4格式。

![img](https://raw.githubusercontent.com/JackyM06/MyPictures/master/architecture.png)

得益于浏览器提供了Media Source Extensions API（MSE）,使得flv.js能够通过JavaScript来对流数据格式进行转换，并分片为

这里我们贴一段flv.js的简单的使用代码

```html
<script src="flv.min.js"></script>
<video id="videoElement"></video>
<script>
    if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: 'http://example.com/flv/video.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
</script>
```

<a id="Flv-js不足"></a>

##### Flv.js不足

MSE目前在PC端浏览器上支持较好，但是一些较低版本的移动端流览器就不是那么理想了如图：

![image-20210418002005470](https://raw.githubusercontent.com/JackyM06/MyPictures/master/image-20210418002005470.png)

由于Flv.js是基于MSE制作的，所以一些低版本移动端流览器中是无法正常播放的，因此在考虑兼容性的情况下需要慎用。

<a id="关于WebRTC"></a>

## 关于WebRTC

在研究Web音视频串流的时候，发现了一种新兴的平台 - Web视频会议，用户直接通过PC浏览器即可加入音视频会议。列出一些目前市场上的web视频会议产品：

Google Meet: [https://meet.google.com](https://meet.google.com)

轻雀视频会议[https://www.qingque.cn/meet/](https://www.qingque.cn/meet/)

![image-20210419160402279](https://raw.githubusercontent.com/JackyM06/MyPictures/master/image-20210419160402279.png)

而移动端的浏览器由于种类繁多并不能较好的适配，因此不被推荐直接在移动端浏览器中使用web视频会议。

Google给出的方案是需要下载一个应用程序GoogleMeet，而轻雀给出的方案比较适合国内的场景，提供了微信小程序或者轻雀APP两种方式供参会者加入。

如果从音视频串流的角度来思考，视频会议就是让传统的单向直播变化为了双向直播，即每个参与者即需要推流，也需要拉流。但是显然这样对流媒体服务器的压力过于庞大，并且还有不可忽视的延时问题。因此促进了Google对WebRTC的建设。

![Untitled Diagram (9)](https://raw.githubusercontent.com/JackyM06/MyPictures/master/Untitled%20Diagram%20\(9\).png)

而这两种视频会议都是由WebRTC技术进行实现的

> WebRTC （Web Real-Time Communications） 是一项由Google推行的实时通讯技术，它允许网络应用或者站点，在<strong>不借助中间媒介</strong>的情况下，建立浏览器之间点对点（Peer-to-Peer）的连接，实现视频流和（或）音频流或者其他任意数据的传输。

大部分主流浏览器为开发者开放了可以开箱即用WebRTC - API，可以通过执行API就能呼叫指定的Peer并建立连接。但需要注意使用WebRTC技术虽然音视频数据不经过服务端传输，但是仍然需要服务端去交换一些连接的必要信息。

<a id="WebRTC技术的工作流"></a>

### WebRTC技术的工作流

WebRTC更适合用来做Web视频会议的原因就是它能够实现浏览器和浏览器之间进行音视频的传输。

![Untitled Diagram (10)](https://raw.githubusercontent.com/JackyM06/MyPictures/master/Untitled%20Diagram%20\(10\).png)

这其中的传输过程如图。这里面的PeerN指的是连接的浏览器客户端，在多个Peer连接之前，每个Peer需要和信令服务器（Signaling Server）进行连接，这里面提到的信令服务器需要由开发者自行搭建。

可以看到Peer与 信令服务器的连接是双向的，这是因为连接的各方需要通过信令服务器交换一些关键信息，这些信息都会以信令的信息发送和接受。

Peer之间主要需要交换下面3种类型的信息

-   初始化和关闭通信，及报告错误；
-   用户WebRTC的的IP和端口号
-   当前浏览器支持播放的音视频编码及封装格式，以及能播放的最高分辨率等信息。

其中需要重点关注第二点，因为需要交换各个Peer之间的IP来进行Peer之间的连接，所以要保证Peer之间是要能够正确访问到对方ip的，如果所有的Peer都是在同一个局域网下没有问题，但是如果参会的Peer来自不通的局域网，那么他们交换的IP是无法访问到的。

所以在这里还需要增加一个借助另一种服务器（称为STUN server）实现NAT/Firewall穿越。主要做的工作就是将用户交换IP的过程中需要把根据局域网IP生成一个公网IP，这样就实现了公网环境的传输。

![Untitled Diagram (11)](https://raw.githubusercontent.com/JackyM06/MyPictures/master/Untitled%20Diagram%20\(11\).png)

<a id="最后"></a>

## 最后

具体应当如何建设一个WebRTC方案的Web音视频会议平台的方法，目前能力尚浅，还需要进一步实践和探索。如果有机会，未来会继续分享有关WebRTC相关的支持。感谢大家宝贵时间！
