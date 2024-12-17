import React from "react";
import EZUIKit from "ezuikit-js";

let player = null;

class App extends React.Component {
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
      player = new EZUIKit.EZUIKitPlayer({
        id: "player-container", // 视频容器ID
        url: "ezopen://open.ys7.com/BB9480953/1.hd.live",
        accessToken:
          "at.2ec3m7dga2v59cps6rv0d1haa2vqsjka-1lbu5f5hyi-1j9rleq-npvulusoe",
        // simple:极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放; security: 安防版; voice: 语音版;
        template: "pcLive",
        plugin: ["talk"], // 加载插件，talk-对讲
        width: 600,
        height: 400,
        handleFirstFrameDisplay: (res) => {
          // 首帧
        },
        handleError: (error) => {
          console.log("handleError", error);
        },
        // language: "en", // zh | en
        // staticPath: "/ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
        // isCloudRecord: true, // 如果是云录制的播放 需要这个值，是必须的
        env: {
          // https://open.ys7.com/help/1772?h=domain
          // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
          // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
          domain: "https://open.ys7.com",
        },
      });
    }
    // });
  };

  play = () => {
    console.log(player);
    var playPromise = player.play();
    playPromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };

  stop = () => {
    var stopPromise = player.stop();
    stopPromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };

  getOSDTime = () => {
    var getOSDTimePromise = player.getOSDTime();
    getOSDTimePromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };

  capturePicture = () => {
    var capturePicturePromise = player.capturePicture(
      `${new Date().getTime()}`,
    );
    capturePicturePromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };

  openSound = () => {
    var openSoundPromise = player.openSound();
    openSoundPromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };

  closeSound = () => {
    var openSoundPromise = player.closeSound();
    openSoundPromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };

  startSave = () => {
    var startSavePromise = player.startSave(`${new Date().getTime()}`);
    startSavePromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };

  stopSave = () => {
    var stopSavePromise = player.stopSave();
    stopSavePromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };

  ezopenStartTalk = () => {
    player.startTalk();
  };

  ezopenStopTalk = () => {
    player.stopTalk();
  };

  fullScreen = () => {
    player.fullScreen();
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
          <div id="player-container" style={{ width: 600, height: 600 }}></div>
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
          <button onClick={this.fullScreen}>fullScreen</button>
          <button onClick={this.getOSDTime}>getOSDTime</button>
          <button onClick={this.ezopenStartTalk}>开始对讲</button>
          <button onClick={this.ezopenStopTalk}>结束对讲</button>
          <button onClick={this.destroy}>destroy</button>
        </div>
      </div>
    );
  }
}

export default App;
