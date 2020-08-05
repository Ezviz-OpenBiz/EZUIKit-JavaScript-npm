<template>
  <div class="hello-ezuikit-js">
    <div id="video-container" style="width:600px;height:600px"></div>
      <button @click="change">按钮</button>
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js";
var player = null;

export default {
  name: "HelloWorld",
  // data:function () {
  //     return {
  //         player: null,
  //     }
  // },
  props: {
    msg: String
  },
  mounted: () => {
    console.group("mounted 组件挂载完毕状态===============》");
     player =  new EZUIKit.EZUIKitPlayer({
      autoplay: true,
      id: "video-container",
      accessToken:"at.ciwomi1k3lklzen416tqflyu4fm7cqvc-32g97d9qk2-15iad60-l2vw2olyd",
      url: "ezopen://open.ys7.com/244640009/1.rec",
      template: "simple", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
      // 视频上方头部控件
      //header: ["capturePicture", "save", "zoom"], // 如果templete参数不为simple,该字段将被覆盖
      //plugin: ['talk'],                       // 加载插件，talk-对讲
      // 视频下方底部控件
      // footer: ["talk", "broadcast", "hd", "fullScreen"], // 如果template参数不为simple,该字段将被覆盖
      // audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
      // openSoundCallBack: data => console.log("开启声音回调", data),
      // closeSoundCallBack: data => console.log("关闭声音回调", data),
      // startSaveCallBack: data => console.log("开始录像回调", data),
      // stopSaveCallBack: data => console.log("录像回调", data),
      // capturePictureCallBack: data => console.log("截图成功回调", data),
      // fullScreenCallBack: data => console.log("全屏回调", data),
      // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
      width: 600,
      height: 400
    });
    // console.log("player",player);
    // setTimeout(()=>{
    //   player.stop(); // 方法调用示例，10秒后关闭视频
    // },10000)
  },
  methods: {
    change() {
      player.stop();
      // 切换为直播
      player.play({
        url:"ezopen://open.ys7.com/244640009/1.live"
      })
   
      // setTimeout(()=>{
      //   player.play({
      //     url:"ezopen://open.ys7.com/244640009/1.live"
      //   })      
      // },1000)
    },

  }
};
</script>
