import React, { useCallback, useRef } from "react";
import EZUIKit from "ezuikit-js";
import { isMobile } from "./utils";

import "./App.css";

const Player = () => {
  const player = useRef();
  const initPlayer = useCallback(() => {
    if (document.getElementById("player-container")) {
      let width = 600;
      let height = 400;

      if (isMobile()) {
        width = document.documentElement.clientWidth;
        height = (width * 9) / 16;
      }

      player.current = new EZUIKit.EZUIKitPlayer({
        id: "player-container",
        url: "ezopen://open.ys7.com/C17369415/1.rec",
        accessToken:
          "ra.df4odsvw3qmz6rao4181c5oc8cfjprjl-60u980bhwa-081mbqo-d3xptaquw",
        width,
        height,
        template: "pcRec",
        // isCloudRecord: true, // 如果是云录制的播放 需要这个值， 是必须的
      });
    }
  }, []);

  /** 播放 */
  const handlePlay = useCallback(() => {
    if (player.current) {
      player.current.play();
    }
  }, []);

  /** 停止 */
  const handleStop = useCallback(() => {
    if (player.current) {
      player.current.stop();
    }
  }, []);

  /** 开启声音， 默认 0.8, 暂时不可调节， 如要调节请调节系统音量 */
  const handleOpenSound = useCallback(() => {
    if (player.current) {
      player.current.openSound();
    }
  }, []);

  const handleCloseSound = useCallback(() => {
    if (player.current) {
      player.current.closeSound();
    }
  }, []);
  /** 开始录制， 录制需要在播放状态下才可以 */
  const handleStartSave = useCallback(() => {
    if (player.current) {
      player.current.startSave();
    }
  }, []);

  const handleStopSave = useCallback(() => {
    if (player.current) {
      player.current.stopSave();
    }
  }, []);

  /** 抓图/截图 */
  const handleCapturePicture = useCallback(() => {
    if (player.current) {
      player.current.capturePicture();
    }
  }, []);

  /** 全屏 */
  const handleFullscreen = useCallback(() => {
    if (player.current) {
      player.current.fullScreen();
    }
  }, []);

  /** 回去OSD时间 */
  const handleGetOSDTime = useCallback(() => {
    if (player.current) {
      player.current.getOSDTime();
    }
  }, []);

  return (
    <div>
      <h2>视频模式使用示例：</h2>
      <div id="player-container"></div>
      <div>
        <button onClick={initPlayer}>初始化</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handlePlay}>play</button>
        <button onClick={handleOpenSound}>openSound</button>
        <button onClick={handleCloseSound}>closeSound</button>
        <button onClick={handleStartSave}>startSave</button>
        <button onClick={handleStopSave}>stopSave</button>
        <button onClick={handleCapturePicture}>capturePicture</button>
        <button onClick={handleFullscreen}>fullScreen</button>
        <button onClick={handleGetOSDTime}>getOSDTime</button>
        {/*<button onClick={() => this.ezopenStartTalk()}>开始对讲</button>
        <button onClick={() => this.ezopenStopTalk()}>结束对讲</button> */}
      </div>
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.player = null; //定义播放器
  }
  componentDidMount() {
    // fetch('https://open.ys7.com/jssdk/ezopen/demo/token')
    // .then(response => response.json())
    // .then(res => {
    // var accessToken = res.data.accessToken;

    if (window.player) {
      return;
    }

    this.player = new EZUIKit.EZUIKitPlayer({
      id: "video-container", // 视频容器ID
      accessToken:
        "at.0siysnsad14jkcgmbnp2pbop427gcbx6-8l00xx7oa9-193qkwi-ryfn1m0j",
      url: "ezopen://open.ys7.com/BC7900686/1.hd.live",
      // simple:极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放; security: 安防版; voice: 语音版;
      template: "pcLive",
      plugin: ["talk"], // 加载插件，talk-对讲
      width: 600,
      height: 400,
      handleFirstFrameDisplay: (res) => {
        if (window.player.jSPlugin) {
          console.log(
            "-------------------res",
            window.player.jSPlugin.player.getFrameInfo()
          );
        }
      },
      handleError: (error) => {
        console.log("handleError", error);
      },
      // language: "en", // zh | en
      // staticPath: "/ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
    });
    // });
    window.player = this.player;

    // console.log(window.player.jSPlugin);

    // if (window.player.jSPlugin) {
    //   window.player.jSPlugin.player.event.on("videoInfo", (res) => {
    //     console.log(res);
    //   });
    // }
  }
  play = () => {
    var playPromise = this.player.play();
    playPromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };
  stop = () => {
    var stopPromise = this.player.stop();
    stopPromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };
  getOSDTime = () => {
    var getOSDTimePromise = this.player.getOSDTime();
    getOSDTimePromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };
  capturePicture = () => {
    var capturePicturePromise = this.player.capturePicture(
      `${new Date().getTime()}`
    );
    capturePicturePromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };
  openSound = () => {
    var openSoundPromise = this.player.openSound();
    openSoundPromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };
  closeSound = () => {
    var openSoundPromise = this.player.closeSound();
    openSoundPromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };
  startSave = () => {
    var startSavePromise = this.player.startSave(`${new Date().getTime()}`);
    startSavePromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };
  stopSave = () => {
    var stopSavePromise = this.player.stopSave();
    stopSavePromise.then((data) => {
      console.log("promise 获取 数据", data);
    });
  };
  ezopenStartTalk = () => {
    this.player.startTalk();
  };
  ezopenStopTalk = () => {
    this.player.stopTalk();
  };
  fullScreen = () => {
    this.player.fullScreen();
  };
  render() {
    return (
      <div className="demo">
        <div id="video-container" style={{ width: 600, height: 600 }}></div>
      </div>
    );
  }
}

export default Player;
