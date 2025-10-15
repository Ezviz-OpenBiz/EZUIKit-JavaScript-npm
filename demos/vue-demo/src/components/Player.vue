<template>
  <div class="player-box">
    <div>
      <div id="video-container" style="height: 400px"></div>
      <div style="display: flex; justify-content: center;">
        <div style="width: 500px; display: flex; flex-direction: column;">
          <div style="display: flex;">url: <input placeholder="url" :value="url" style="width: 450px;" @input="event => url = event.target.value"/></div>
          <div style="display: flex;">accessToken: <input placeholder="accessToken" :value="accessToken" style="width: 450px;" @input="event => accessToken = event.target.value"/></div>
          <div style="display: flex;">template: <input placeholder="template" :value="template" style="width: 450px;" @input="event => template = event.target.value"/></div>
          <div style="display: flex;">width: <input placeholder="width" :value="width" style="width: 450px;" @input="event => width = event.target.value"/></div>
          <div style="display: flex;">height: <input placeholder="height" :value="height" style="width: 450px;" @input="event => height = event.target.value"/></div>
        </div>
      </div>
    </div>
    <div>
      <button v-on:click="init">init</button>
      <button v-on:click="stop">stop</button>
      <button v-on:click="play">play</button>
      <button v-on:click="openSound">openSound</button>
      <button v-on:click="closeSound">closeSound</button>
      <button v-on:click="startSave">startSave</button>
      <button v-on:click="stopSave">stopSave</button>
      <button v-on:click="capturePicture">capturePicture</button>
      <button v-on:click="fullscreen">fullscreen</button>
      <button v-on:click="getOSDTime">getOSDTime</button>
      <button v-on:click="startTalk">startTalk</button>
      <button v-on:click="stopTalk">stopTalk</button>
      <button v-on:click="destroy">destroy</button>
    </div>
  </div>
</template>

<script>
import { EZUIKitPlayer } from "ezuikit-js";
var player = null;

export default {
  name: "Player",
  props: {
    msg: String,
  },
  data() {
    return {
      url: "ezopen://open.ys7.com/BC7900686/1.live",
      accessToken: "ra.c6wqy0gzcm1f6ryr5sh2vdqr7zo7zu26-1ovtzabpog-1rbv9vr-urpfpktwb",
      template: "pcLive",
      width: "100%",
      height: 400,
    };
  },
  mounted: () => {
    console.group("mounted 组件挂载完毕状态===============》");
  },
  methods: {
    init() {
      if (player) {
        this.destroy();
      }

      // fetch("https://open.ys7.com/jssdk/ezopen/demo/token")
      //   .then((response) => response.json())
      //   .then((res) => {
      //     var accessToken = res.data.accessToken;
      //   });
      player = new EZUIKitPlayer({
        id: "video-container", // 视频容器ID
        accessToken: this.accessToken,
        url: this.url,
        // simple: 极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放; security: 安防版; voice: 语音版;
        template: this.template, // 视频模板
        width: this.width,
        height: this.height,
        handleError: (error) => {
          console.error("handleError", error);
        },
        // quality: 1, // 
        // language: "en", // zh | en
        staticPath: "/ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
        env: {
          // https://open.ys7.com/help/1772?h=domain
          // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
          // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
          domain: "https://open.ys7.com",
        },
        // staticPath:"https://openstatic.ys7.com/ezuikit_js/v8.1.9/ezuikit_static",
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
      });

      // 8.1.x 事件监听
      // player.eventEmitter.on(EZUIKitPlayer.EVENTS.videoInfo, (info) => {
      //   console.warn("eventEmitter videoInfo", info);
      // });
      // 8.2.x 事件监听
      player.on(EZUIKitPlayer.EVENTS.videoInfo, (info) => {
        console.warn("videoInfo", info);
      });

      // 8.1.x 事件监听
      // player.eventEmitter.on(EZUIKitPlayer.EVENTS.audioInfo, (info) => {
      //   console.warn("eventEmitter audioInfo", info);
      // });
      // 8.2.x 事件监听
      player.on(EZUIKitPlayer.EVENTS.audioInfo, (info) => {
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
      player.on(EZUIKitPlayer.EVENTS.streamInfoCB, (info) => {
        console.warn("streamInfoCB ", info);
      });

      window.player = player;
    },
    play() {
      if (player) {
        player.play().then((data) => {
          console.log("play 获取 数据", data);
        });
      }
    },
    stop() {
      if (player) {
        player.stop().then((data) => {
          console.log("stop 获取 数据", data);
        });
      }
    },
    getOSDTime() {
      if (player) 
       player.getOSDTime().then((data) => {
        console.log("getOSDTime 获取 数据", data);
      });
    },
    capturePicture() {
      if (player) {
        player.capturePicture(`${new Date().getTime()}`).then((data) => {
          console.log("capturePicture 获取 数据", data);
        });
      }
    },
    openSound() {
      if (player) {
        player.openSound().then((data) => {
          console.log("openSound 获取 数据", data);
        });
      }
    },
    closeSound() {
      if (player) {
        player.closeSound().then((data) => {
          console.log("closeSound 获取 数据", data);
        });
      }
    },
    startSave() {
      if (player) {
        player.startSave(`${new Date().getTime()}`).then((data) => {
          console.log("startSave 获取 数据", data);
        });
      }
    },
    stopSave() {
      if (player) {
        player.stopSave().then((data) => {
          console.log("promise 获取 数据", data);
        });
      }
    },
    startTalk() {
      // 一个页面中只可以有一个对讲
      if (player) {
        player.startTalk();
      }
    },
    stopTalk() {
      if (player) {
        player.stopTalk();
      }
    },
    fullscreen() {
      if (player) player.fullscreen();
    },
    destroy() {
      if (player)  {
        player.destroy().then((data) => {
          console.log("promise 获取 数据", data);
        });
        player = null;
      }
    },
  },
};
</script>
