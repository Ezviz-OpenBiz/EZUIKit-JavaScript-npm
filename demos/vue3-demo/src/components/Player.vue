<script lang="ts" setup>
import EZUIKit from "ezuikit-js";
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

const ezopenStartTalk = () => {
  player.startTalk();
};

const ezopenStopTalk = () => {
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
  player = new EZUIKit.EZUIKitPlayer({
    id: "video-container", // 视频容器ID
    accessToken:
      "at.a9vba5iia6ixphqu8db7y16174p6neje-6f0n0ahcu8-1uvhxp7-rxswkykaa",
    url: "ezopen://open.ys7.com/BD3957004/1.hd.live",
    // simple: 极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放;security: 安防版; voice: 语音版;
    template: "pcLive",
    plugin: ["talk"], // 加载插件，talk-对讲
    width: 600,
    height: 400,
    // language: "en", // zh | en
    handleError: (err: any) => {
      console.error("handleError", err);
    },
    // staticPath: "/ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
    env: {
      // https://open.ys7.com/help/1772?h=domain
      // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
      // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
      domain: "https://open.ys7.com",
    },
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
      <button @click="ezopenStartTalk">startTalk</button>
      <button @click="ezopenStopTalk">stopTalk</button>
      <button @click="destroy">destroy</button>
    </div>
  </div>
</template>
