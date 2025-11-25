import React from "react";
import { EZUIKitPlayer } from "ezuikit-js";


let player = null;

class Player extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.init();
  }

  init = () => {
    // fetch('https://open.ys7.com/jssdk/ezopen/demo/token')
    // .then(response => response.json())
    // .then(res => {
    // var accessToken = res.data.accessToken;

    if (player) {
      player.destroy();
      player = null;
    }

    if (document.getElementById("player-container")) {
      player = new EZUIKitPlayer({
        id: "player-container", // 视频容器ID
        url: "ezopen://open.ys7.com/BC7799091/1.hd.live",
        accessToken:
          "at.9uoaxo0k3e5dinq8bretm18e5l37k1l6-26lx1qcvcc-1neesaz-kh9hqvqc3",
        // simple:极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放; security: 安防版; voice: 语音版;
        template: "pcLive",
        // width: 600,
        height: 400,
        // quality: 1, // 
        handleFirstFrameDisplay: (res) => {
          // 首帧
        },
        handleError: (error) => {
          console.log("handleError", error);
        },
        // language: "en", // zh | en
        // staticPath: "/ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
        // isCloudRecord: true, // 如果是云录制的播放 需要这个值，是必须的
        scaleMode: 1, // 默认 0 完全填充窗口，会有拉伸 1: 等比适配 2: 等比完全填充窗口, 超出隐藏 @sine 8.2.0
        env: {
          // https://open.ys7.com/help/1772?h=domain
          // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
          // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
          domain: "https://open.ys7.com",
        },
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
    }
    // });
  };

  play = () => {
   if (player) player.play();
  };

  stop = () => {
    if (player) player.stop()
  };

  getOSDTime = () => {
    if (player)
      player.getOSDTime().then((data) => {
        console.log("getOSDTime 获取 数据", data);
      });
  };

  capturePicture = () => {
    if (player)
      player.capturePicture(
        `${new Date().getTime()}`,
      ).then((data) => {
        console.log("capturePicture 获取 数据", data);
      });
  };

  openSound = () => {
    if (player) player.openSound()
  };

  closeSound = () => {
    if (player) player.closeSound()
  };

  startSave = () => {
    if (player)
      player.startSave(`${new Date().getTime()}`).then((data) => {
        console.log("startSave 获取 数据", data);
      });
  };

  stopSave = () => {
    if (player)
      player.stopSave().then((data) => {
        console.log("startSave 获取 数据", data);
      });
  };
 
  startTalk = () => {
    // 请确保已经开启麦克风权限和已有麦克风可以使用
    if (player) player.startTalk();
  };

  stopTalk = () => {
    if (player) player.stopTalk();
  };

  fullscreen = () => {
    if (player) player.fullscreen();
  };

  destroy = () => {
    if (player) {
      player.destroy();
      player = null;
    }
  };

  render() {
    return (
      <div className="demo">
        <h2>视频模式使用示例：</h2>
        <div>
          <div id="player-container" style={{ width: '100%', height: 600 }}></div>
        </div>
        <div>
          <button onClick={this.init}>init</button>
          <button onClick={this.stop}>stop</button>
          <button onClick={this.play}>play</button>
          <button onClick={this.openSound}>openSound</button>
          <button onClick={this.closeSound}>closeSound</button>
          <button onClick={this.startSave}>startSave</button>
          <button onClick={this.stopSave}>stopSave</button>
          <button onClick={this.capturePicture}>capturePicture</button>
          <button onClick={this.fullscreen}>fullscreen</button>
          <button onClick={this.getOSDTime}>getOSDTime</button>
          <button onClick={this.startTalk}>开始对讲</button>
          <button onClick={this.stopTalk}>结束对讲</button>
          <button onClick={this.destroy}>destroy</button>
        </div>
      </div>
    );
  }
}

export default Player;
