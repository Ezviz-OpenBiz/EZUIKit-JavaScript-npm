<template>
  <div class="page">
    <div class="multi-container">
      <div class="main-container">
        <div id="main"></div>
      </div>
      <div class="right-container">
        <div
          :class="['sub-container', { selected: selectedIndex === 0 }]"
          @click="subClick(0)"
        >
          <div id="right1"></div>
          <img v-if="selectedIndex === 0 && cover" :src="cover" />
        </div>
        <div
          :class="['sub-container', { selected: selectedIndex === 1 }]"
          @click="subClick(1)"
        >
          <div id="right2"></div>
          <img v-if="selectedIndex === 1 && cover" :src="cover" />
        </div>
        <div
          :class="['sub-container', { selected: selectedIndex === 2 }]"
          @click="subClick(2)"
        >
          <div id="right3"></div>
          <img v-if="selectedIndex === 2 && cover" :src="cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EZUIKitPlayer } from "ezuikit-js";

export default {
  name: "Multi",
  data() {
    return {
      players: [],
      mainPlayer: null,
      list: [
        {
          url: "ezopen://open.ys7.com/BC7799090/1.live",
          id: "right1",
          accessToken:
            "at.ao9rmhn824rnxeao5ck7fm4e1j2x7zey-4g4qudp8vd-1vumcfo-t28imym6",
        },
        {
          url: "ezopen://open.ys7.com/BF6985117/1.live",
          id: "right2",
          accessToken:
            "at.ao9rmhn824rnxeao5ck7fm4e1j2x7zey-4g4qudp8vd-1vumcfo-t28imym6",
        },
        {
          url: "ezopen://open.ys7.com/C69625500/1.live",
          id: "right3",
          accessToken:
            "at.ao9rmhn824rnxeao5ck7fm4e1j2x7zey-4g4qudp8vd-1vumcfo-t28imym6",
        },
      ],
      selectedIndex: 0,
      cover: "",
    };
  },
  mounted() {
    console.log(this.list);
    for (let i = 0; i < this.list.length; i++) {
      if (this.selectedIndex === i) {
        this.players.push(null);
        continue;
      }
      this.players.push(this.createPlayer(this.list[i]));
    }

    this.createMainPlayer(this.selectedIndex);
  },
  methods: {
    createPlayer(options) {
      return new EZUIKitPlayer({
        ...options,
        // simple: 极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放;security: 安防版; voice: 语音版;
        template: "simple",
        handleError: (error) => {
          console.error("handleError", error);
        },
        // language: "en", // zh | en
        // staticPath: "/ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
        env: {
          // https://open.ys7.com/help/1772?h=domain
          // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
          // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
          domain: "https://open.ys7.com",
        },
        dpr: 2,
        // staticPath:"https://openstatic.ys7.com/ezuikit_js/v8.1.9/ezuikit_static",
        // 日志打印设置
        loggerOptions: {
          // player.setLoggerOptions(options)
          level: "ERROR", // INFO LOG  WARN  ERROR
          name: "ezuikit",
          showTime: true,
        },
        download: false,
        // 视频流的信息回调类型
        /**
         * 打开流信息回调，监听 streamInfoCB 事件
         * 0 : 每次都回调
         * 1 : 只回调一次
         * 注意：会影响性能
         * 默认值 1
         */
        streamInfoCBType: 1,
      });
    },

    createMainPlayer(index) {
      if (this.mainPlayer) {
        this.mainPlayer.destroy();
        this.mainPlayer = null;
      }
      this.mainPlayer = this.createPlayer({
        ...this.list[index],
        id: "main",
      });

      this.mainPlayer.eventEmitter.on(
        EZUIKitPlayer.EVENTS.firstFrameDisplay,
        () => {
          setTimeout(() => {
            this.mainPlayer.capturePicture().then((res) => {
              this.cover = res.data.base64;
            });
          }, 10);
        }
      );
    },

    subClick(index) {
      console.log("subClick", index);
      this.cover = "";
      // 其实这里平移窗口，然后 resize 窗口应该更合理, 不用每次都销毁重新创建
      this.players[index].destroy();
      this.players[index] = null;
      this.players[this.selectedIndex] = this.createPlayer(
        this.list[this.selectedIndex]
      );
      this.selectedIndex = index;
      this.createMainPlayer(index);
    },
  },
  beforeDestroy() {
    // 销毁所有播放器
    for (let i = 0; i < this.list.length; i++) {
      if (this.players[i]) {
        this.players[i].destroy();
      }
    }
    this.players = [];

    if (this.mainPlayer) {
      this.mainPlayer.destroy();
      this.mainPlayer = null;
    }
  },
};
</script>
<style scoped>
.multi-container {
  display: flex;
}
.main-container {
  width: 600px;
  height: 606px;
  background-color: #000;
}

#main {
  width: 600px;
  height: 606px;
}

.right-container {
  display: flex;
  flex-direction: column;
}
.right-container > div {
  background-color: #000;
  border: 1px solid transparent;
  position: relative;
}

.sub-container img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  font-size: 0;
  outline: none;
  display: none;
}

#right1,
#right2,
#right3 {
  width: 300px;
  height: 200px;
}

.selected {
  border-color: red !important;
}

.selected img {
  display: flex;
}
</style>
