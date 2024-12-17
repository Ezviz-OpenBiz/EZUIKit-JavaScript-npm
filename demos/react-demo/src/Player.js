import React, { useCallback, useRef } from "react";
import EZUIKit from "ezuikit-js";
import { isMobile } from "./utils";

const Player = () => {
  const player = useRef();

  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const urlRef = useRef();
  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const accessTokenRef = useRef();

  const initPlayer = useCallback(() => {
    if (document.getElementById("player-container")) {
      let width = 600;
      let height = 400;

      if (isMobile()) {
        width = document.documentElement.clientWidth;
        height = (width * 9) / 16;
      }

      if (player.current) {
        player.current.destroy();
        player.current = null;
      }

      player.current = new EZUIKit.EZUIKitPlayer({
        id: "player-container",
        url: urlRef.current.value, // "ezopen://open.ys7.com/BB9480953/1.hd.live",
        accessToken: accessTokenRef.current.value, // "at.2ec3m7dga2v59cps6rv0d1haa2vqsjka-1lbu5f5hyi-1j9rleq-npvuluse",
        width,
        height,
        template: "pcLive",
        language: "en", // zh | en
        // isCloudRecord: true, // 如果是云录制的播放 需要这个值，是必须的
        env: {
          // https://open.ys7.com/help/1772?h=domain
          // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
          // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
          domain: "https://open.ys7.com",
        },
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

  /** 获取OSD时间 */
  const handleGetOSDTime = useCallback(() => {
    if (player.current) {
      console.log("OSDTime", player.current.getOSDTime());
    }
  }, []);

  /**
   * 开始对讲 （仅直播live）
   */
  const handleStartTalk = useCallback(() => {
    if (player.current) {
      player.current.startTalk();
    }
  }, []);

  /**
   * 开始对讲 （仅直播live）
   */
  const handleStopTalk = useCallback(() => {
    if (player.current) {
      player.current.stopTalk();
    }
  }, []);

  const handleDestroy = () => {
    if (player.current) {
      player.current.destroy();
      player.current = null;
    }
  };

  return (
    <div>
      <h2>视频模式使用示例：</h2>
      <div>
        <div id="player-container"></div>
      </div>
      <div>
        url: <input type="text" ref={urlRef} style={{ width: 500 }} />
      </div>
      <div>
        accessToken:
        <input type="text" ref={accessTokenRef} style={{ width: 500 }} />
      </div>
      <div>
        <button onClick={initPlayer}>init</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handlePlay}>play</button>
        <button onClick={handleOpenSound}>openSound</button>
        <button onClick={handleCloseSound}>closeSound</button>
        <button onClick={handleStartSave}>startSave</button>
        <button onClick={handleStopSave}>stopSave</button>
        <button onClick={handleCapturePicture}>capturePicture</button>
        <button onClick={handleFullscreen}>fullScreen</button>
        <button onClick={handleGetOSDTime}>getOSDTime</button>
        <button onClick={handleStartTalk}>startTalk</button>
        <button onClick={handleStopTalk}>stopTalk</button>
        <button onClick={handleDestroy}>destroy</button>
      </div>
    </div>
  );
};

export default Player;
