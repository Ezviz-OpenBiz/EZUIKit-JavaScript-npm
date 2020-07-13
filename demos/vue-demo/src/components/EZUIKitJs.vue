<template>
  <div class="hello-ezuikit-js">
    <div id="video-container" style="width:600px;height:600px"></div>
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted: () => {
    console.group("mounted 组件挂载完毕状态===============》");
    var player =  new EZUIKit.EZUIKitPlayer({
      autoplay: true,
      id: "video-container",
      accessToken:"at.5eust80k28pq5i8w7blbhl8e4vft3bwq-7slhtrs9dm-1fhprbb-tafuv0h5j",
      url: "ezopen://open.ys7.com/203751922/1.live",
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
    console.log("player",player);
    // setTimeout(()=>{
    //   player.stop(); // 方法调用示例，10秒后关闭视频
    // },10000)
  }
};
</script>
