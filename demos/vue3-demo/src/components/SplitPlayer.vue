<template>
  <div class="split-player-container">
    <div class="controls">
      <button @click="setSplit(1)">1x1</button>
      <button @click="setSplit(2)">2x2</button>
      <button @click="setSplit(3)">3x3</button>
      <button @click="setSplit(4)">4x4</button>
    </div>
    
    <div 
      class="player-grid" 
      :style="{ 
        gridTemplateColumns: `repeat(${splitParams.cols}, 1fr)`,
        gridTemplateRows: `repeat(${splitParams.rows}, 1fr)` 
      }"
    >
      <div 
        v-for="index in splitParams.count" 
        :key="`${splitParams.count}-${index}`" 
        class="player-item"
        :id="`video-container-${index}`"
      >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { EZUIKitPlayer } from 'ezuikit-js';

const players = ref<any[]>([]);
const splitParams = ref({
  rows: 1,
  cols: 1,
  count: 1
});

const accessToken = ref(
  "at.3jrqzcus0dmobn345kgbvu0u4xeu7dvu-86ucwpqor2-10qsb5s-kscbjysy"
);

// 替换新的播放地址
const urls = ref([
    // "ezopen://open.ys7.com/G17974613/1.live",
    // "ezopen://open.ys7.com/G17974613/1.hd.live",
    // "ezopen://open.ys7.com/GV241431/1.live",
    // "ezopen://open.ys7.com/GV241431/1.hd.live",
    // "ezopen://open.ys7.com/BC779909/1.live",
    // "ezopen://open.ys7.com/BC779909/1.hd.live",
])

const staticPath = ref("");

const destroyPlayers = () => {
  players.value.forEach(player => {
    if (player) {
      player.destroy();
    }
  });
  players.value = [];
};

const initPlayers = async () => {
  destroyPlayers();
  
  await nextTick();
  
  for (let i = 1; i <= splitParams.value.count; i++) {
    const randomUrl = urls.value[Math.floor(Math.random() * urls.value.length)];
    
    if(!randomUrl) continue;

    const player = new EZUIKitPlayer({
      id: `video-container-${i}`, // 视频容器ID
      accessToken: accessToken.value,
      url: randomUrl,
      // simple: 极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放;security: 安防版; voice: 语音版;
      template: "pcLive",
      // width: "100%", // 宽度，支持百分比和像素值，默认 100%
      height: 400,
      dpr: 2,
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
      staticPath: staticPath.value,  // || "./ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值. 默认使用CDN静态资源 "https://openstatic.ys7.com/ezuikit_js/v{version}/ezuikit_static",
      scaleMode: 1, // 默认 0 完全填充窗口，会有拉伸 1: 等比适配 2: 等比完全填充窗口, 超出隐藏 @sine 8.2.0
      env: {
        // https://open.ys7.com/help/1772?h=domain
        // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
        // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
        domain: "https://open.ys7.com",
      },
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
      // ],
      // 回放列表弹框
      // recListOptions: null,
      // 时间选择器
      // timeOptions: null,
      recordOptions: {
        // 是否开启录制水印， 默认开启
        enabledWatermarkRecord: false,
      },
    });
    players.value.push(player);
  }
};

const setSplit = (num: number) => {
  splitParams.value = {
    rows: num,
    cols: num,
    count: num * num
  };
  initPlayers();
};

onMounted(() => {
  initPlayers();
});

onBeforeUnmount(() => {
  destroyPlayers();
});
</script>

<style scoped>
.split-player-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.controls {
  margin-bottom: 20px;
}
.controls button {
  margin-right: 10px;
  padding: 8px 16px;
  cursor: pointer;
}
.player-grid {
  display: grid;
  gap: 10px;
  width: 100%;
  height: 800px; /* Adjust as needed */
}
.player-item {
  background-color: #000;
  width: 100%;
  height: 100%;
}
</style>
