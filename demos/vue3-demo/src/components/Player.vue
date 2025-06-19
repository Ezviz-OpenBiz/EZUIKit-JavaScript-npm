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
  fullScreen: Function;
  destroy: Function;
  eventEmitter: any;
}

let player: IPlayer;

const play = () => {
  const playPromise = player.play();
  playPromise.then((data: any) => {
    console.log("promise 获取 数据", data);
  });
};

const stop = () => {
  const stopPromise = player.stop();
  stopPromise.then((data: any) => {
    console.log("promise 获取 数据", data);
  });
};

const getOSDTime = () => {
  const getOSDTimePromise = player.getOSDTime();
  getOSDTimePromise.then((data: any) => {
    console.log("promise 获取 数据", data);
  });
};

const capturePicture = () => {
  const capturePicturePromise = player.capturePicture(
    `${new Date().getTime()}`
  );
  capturePicturePromise.then((data: any) => {
    console.log("promise 获取 数据", data);
  });
};

const openSound = () => {
  const openSoundPromise = player.openSound();
  openSoundPromise.then((data: any) => {
    console.log("promise 获取 数据", data);
  });
};

const closeSound = () => {
  const openSoundPromise = player.closeSound();
  openSoundPromise.then((data: any) => {
    console.log("promise 获取 数据", data);
  });
};

const startSave = () => {
  const startSavePromise = player.startSave(`${new Date().getTime()}`);
  startSavePromise.then((data: any) => {
    console.log("promise 获取 数据", data);
  });
};

const stopSave = () => {
  const stopSavePromise = player.stopSave();
  stopSavePromise.then((data: any) => {
    console.log("promise 获取 数据", data);
  });
};

const startTalk = () => {
  player.startTalk();
};

const stopTalk = () => {
  player.stopTalk();
};

const fullScreen = () => {
  player.fullScreen();
};

const destroy = () => {
  const destroyPromise = player.destroy();
  destroyPromise.then((data: any) => {
    console.log("promise 获取 数据", data);
  });
  player = null!;
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
      "at.d525oyj8d7bwohb40ssn3266cfq2mwi2-8hgpypehn9-1fafaty-ea2fxbc1",
    url: "ezopen://open.ys7.com/BC7799091/1.hd.live",
    // simple: 极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放;security: 安防版; voice: 语音版;
    template: "pcLive",
    plugin: ["talk"], // 加载插件，talk-对讲
    width: 600,
    height: 400,
    // language: "en", // zh | en
    handleError: (err: any) => {
      console.error("handleError", err);
    },
    // 自定义清晰度 默认 null, 如果有值 sdk 内部不在进行获取, null 默认使用接口获取的清晰度列表, videoLevelList.length === 0 不展示清晰度控件 sdk 内部不在进行获取, videoLevelList.length > 0 展示控件 sdk 内部不在进行获取
    // videoLevelList: [
    //   { level: 0, name: "流畅", streamTypeIn: 1 },
    //   { level: 1, name: "标清", streamTypeIn: 1 },
    // ],
    // staticPath: "/ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
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
    //   { level: 0, name: "流畅", streamTypeIn: 2 },
    //   { level: 1, name: "标清", streamTypeIn: 1 },
    // ],
  });

  player.eventEmitter.on(EZUIKitPlayer.EVENTS.videoInfo, (info: any) => {
    console.log("videoinfo", info);
  });

  player.eventEmitter.on(EZUIKitPlayer.EVENTS.audioInfo, (info: any) => {
    console.log("audioInfo", info);
  });

  // 首帧渲染成功
  // first frame display
  player.eventEmitter.on(EZUIKitPlayer.EVENTS.firstFrameDisplay, () => {
    console.log("firstFrameDisplay ");
  });
  player.eventEmitter.on(EZUIKitPlayer.EVENTS.streamInfoCB, (info: any) => {
    console.log("streamInfoCB ", info);
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
      <div id="video-container" style="width: 600px; height: 400px"></div>
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
      <button @click="fullScreen">fullScreen</button>
      <button @click="getOSDTime">getOSDTime</button>
      <button @click="startTalk">startTalk</button>
      <button @click="stopTalk">stopTalk</button>
      <button @click="destroy">destroy</button>
    </div>
  </div>
</template>
