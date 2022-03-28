<template>
  <div class="hello-ezuikit-js">
    <div id="video-container" style="width:600px;height:400px"></div>
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
    fetch('https://open.ys7.com/jssdk/ezopen/demo/token')
      .then(response => response.json())
      .then(res => {
        var accessToken = res.data.accessToken;
        player = new EZUIKit.EZUIKitPlayer({
          id: 'video-container', // 视频容器ID
          accessToken: accessToken,
          url: 'ezopen://open.ys7.com/G39444019/1.live',
          template: 'simple', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版; theme-可配置主题；
          plugin: ['talk'],                       // 加载插件，talk-对讲
          width: 600,
          height: 400,
        });
      });
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
