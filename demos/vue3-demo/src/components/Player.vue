<script lang="ts" setup>
import { EZUIKitPlayer } from "ezuikit-js";
import { onMounted } from "vue";

interface IPlayer {
  play: Function;
  stop: Function;
  getOSDTime: Function;
  capturePicture: Function;
  openSound: Function;
  closeSound: Function;
  startSave: Function;
  stopSave: Function;
  startTalk: Function;
  stopTalk: Function;
  fullscreen: Function;
  destroy: Function;
  eventEmitter: any;
  on: any // eventEmitter
}

let player: IPlayer;

const play = () => {
  if (player) player.play()
};

const stop = () => {
  if (player) player.stop();
};

const getOSDTime = () => {
  if (player)
  player.getOSDTime().then((data: any) => {
    console.log("getOSDTime 获取 数据", data);
  });
};

const capturePicture = () => {
  if (player)
    player.capturePicture(
      `${new Date().getTime()}`
    ).then((data: any) => {
      console.log("capturePicture 获取 数据", data);
    });
};

const openSound = () => {
    if (player) player.openSound();
};

const closeSound = () => {
    if (player) player.closeSound();
};

const startSave = () => {
  if (player)
    player.startSave(`${new Date().getTime()}`).then((data: any) => {
      console.log("startSave 获取 数据", data);
    });
};

const stopSave = () => {
  if (player)
    player.stopSave().then((data: any) => {
      console.log("stopSave 获取 数据", data);
    });
};

const startTalk = () => {
  if (player) player.startTalk();
};

const stopTalk = () => {
  if (player) player.stopTalk();
};

const fullscreen = () => {
  if (player) player.fullscreen();
};

const destroy = () => {
  if (player) {
    player.destroy().then((data: any) => {
      console.log("promise 获取 数据", data);
    });
    player = null!;
  }
};

const init = () => {
  if (player) {
    destroy();
  }
  console.group("mounted 组件挂载完毕状态===============》");
  // fetch("https://open.ys7.com/jssdk/ezopen/demo/token")
  //   .then((response) => response.json())
  //   .then((res) => {
  //     var accessToken = res.data.accessToken;
  player = new EZUIKitPlayer({
    id: "video-container", // 视频容器ID
    accessToken:
      "at.9uoaxo0k3e5dinq8bretm18e5l37k1l6-26lx1qcvcc-1neesaz-kh9hqvqc3",
    url: "ezopen://open.ys7.com/BC7799091/1.hd.live",
    // simple: 极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放;security: 安防版; voice: 语音版;
    template: "pcLive",
    // width: 600,
    height: 400,
    // quality: 1, // 
    // language: "en", // zh | en
    handleError: (err: any) => {
      console.error("handleError", err);
    },
    // 自定义清晰度 默认 null, 如果有值 sdk 内部不在进行获取, null 默认使用接口获取的清晰度列表, videoLevelList.length === 0 不展示清晰度控件 sdk 内部不在进行获取, videoLevelList.length > 0 展示控件 sdk 内部不在进行获取
    // videoLevelList: [
    //   { level: 0, name: "流畅", streamTypeIn: 1 },
    //   { level: 1, name: "标清", streamTypeIn: 1 },
    // ],
    // staticPath: "./ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
    scaleMode: 1, // 默认 0 完全填充窗口，会有拉伸 1: 等比适配 2: 等比完全填充窗口, 超出隐藏 @sine 8.2.0
    env: {
      // https://open.ys7.com/help/1772?h=domain
      // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
      // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
      domain: "https://open.ys7.com",
    },
    // staticPath: "https://openstatic.ys7.com/ezuikit_js/v8.1.9/ezuikit_static",
    // 日志打印设置
    loggerOptions: {
      // player.setLoggerOptions(options)
      level: "INFO", // INFO LOG  WARN  ERROR
      name: "ezuikit",
      showTime: true,
    },
    // 视频流的信息回调类型
    /**
     * 打开流信息回调，监听 streamInfoCB 事件
     * 0 : 每次都回调
     * 1 : 只回调一次
     * 注意：会影响性能
     * 默认值 1
     */
    streamInfoCBType: 1,
    // v8.1.10
    // 自定义清晰度 默认 null, 如果有值 sdk 内部不在进行获取, null 默认使用接口获取的清晰度列表, videoLevelList.length === 0 不展示清晰度控件 sdk 内部不在进行获取, videoLevelList.length > 0 展示控件 sdk 内部不在进行获取
    // videoLevelList: [
    //   { level: 1, name: "标清", streamTypeIn: 2 }, // 需要保证支持子码流 (streamTypeIn=2)
    //   { level: 2, name: "高清", streamTypeIn: 1 },
    // ],
    // videoLevelList: [
    //   { level: -1, name: "标清", streamTypeIn: 2 }, // 8.1.17 开始 当 level 的值小于 0时， 不在向设备发送指令，仅根据 streamTypeIn 切换码流 （请保证 streamTypeIn 对应的码流存在）
    //   { level: -2, name: "高清", streamTypeIn: 1 }, // 8.1.17 开始 当 level 的值小于 0时， 不在向设备发送指令，仅根据 streamTypeIn 切换码流 （请保证 streamTypeIn 对应的码流存在）
    // ]
  });

      // 8.1.x 事件监听
      // player.eventEmitter.on(EZUIKitPlayer.EVENTS.videoInfo, (info) => {
      //   console.warn("eventEmitter videoInfo", info);
      // });
      // 8.2.x 事件监听
      player.on(EZUIKitPlayer.EVENTS.videoInfo, (info: any) => {
        console.warn("videoInfo", info);
      });

      // 8.1.x 事件监听
      // player.eventEmitter.on(EZUIKitPlayer.EVENTS.audioInfo, (info) => {
      //   console.warn("eventEmitter audioInfo", info);
      // });
      // 8.2.x 事件监听
      player.on(EZUIKitPlayer.EVENTS.audioInfo, (info: any) => {
        console.warn("audioInfo", info);
      });

      // 首帧渲染成功
      // first frame display
      // 8.1.x 事件监听
      // player.eventEmitter.on(EZUIKitPlayer.EVENTS.firstFrameDisplay, () => {
      //     console.warn("eventEmitter firstFrameDisplay ");
      // });
      // 8.2.x 事件监听
      player.on(EZUIKitPlayer.EVENTS.firstFrameDisplay, () => {
        console.warn("firstFrameDisplay ");
      });

      // 8.1.x 事件监听
      // player.eventEmitter.on(EZUIKitPlayer.EVENTS.streamInfoCB, (info) => {
      //   console.warn("eventEmitter streamInfoCB ", info);
      // });
      // 8.2.x 事件监听
      player.on(EZUIKitPlayer.EVENTS.streamInfoCB, (info: any) => {
        console.warn("streamInfoCB ", info);
      });

      window.player = player;
  // });
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="hello-ezuikit-js">
    <div>
      <div id="video-container" style="height: 400px"></div>
    </div>
    <div>
      <button @click="init">init</button>
      <button @click="stop">stop</button>
      <button @click="play">play</button>
      <button @click="openSound">openSound</button>
      <button @click="closeSound">closeSound</button>
      <button @click="startSave">startSave</button>
      <button @click="stopSave">stopSave</button>
      <button @click="capturePicture">capturePicture</button>
      <button @click="fullscreen">fullscreen</button>
      <button @click="getOSDTime">getOSDTime</button>
      <button @click="startTalk">startTalk</button>
      <button @click="stopTalk">stopTalk</button>
      <button @click="destroy">destroy</button>
    </div>
  </div>
</template>
