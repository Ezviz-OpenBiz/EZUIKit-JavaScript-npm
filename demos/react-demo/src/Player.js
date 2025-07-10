import React, { useCallback, useRef } from "react";
import { EZUIKitPlayer } from "ezuikit-js";
import { isMobile } from "./utils";

const Player = () => {
  const player = useRef();

  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const urlRef = useRef();
  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const accessTokenRef = useRef();
  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const staticPathRef = useRef();

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

      // https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm?tab=readme-ov-file#%E9%99%84%E5%BD%95-%E5%88%9D%E5%A7%8B%E5%8C%96%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E
      player.current = new EZUIKitPlayer({
        id: "player-container",
        url: urlRef.current.value, // "ezopen://open.ys7.com/BB9480953/1.hd.live",
        accessToken: accessTokenRef.current.value, // "at.2ec3m7dga2v59cps6rv0d1haa2vqsjka-1lbu5f5hyi-1j9rleq-npvuluse",
        width,
        height,
        template: "pcLive",
        language: "en", // zh | en
        // quality: 1, // 
        // isCloudRecord: true, // 如果是云录制的播放 需要这个值，是必须的
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
        staticPath: staticPathRef.current?.value.trim() || undefined, // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
        // v8.1.10
        // 自定义清晰度 默认 null, 如果有值 sdk 内部不在进行获取, null 默认使用接口获取的清晰度列表, videoLevelList.length === 0 不展示清晰度控件 sdk 内部不在进行获取, videoLevelList.length > 0 展示控件 sdk 内部不在进行获取
        // videoLevelList: [
        //   { level: 1, name: "标清", streamTypeIn: 2 }, // 需要保证支持子码流 (streamTypeIn=2)
        //   { level: 2, name: "高清", streamTypeIn: 1 },
        // ],
      });

      window.player = player.current;
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
        url:{" "}
        <input
          type="text"
          ref={urlRef}
          style={{ width: 500 }}
          defaultValue="ezopen://open.ys7.com/BC7799091/1.hd.live"
        />
      </div>
      <div>
        accessToken:
        <input
          type="text"
          ref={accessTokenRef}
          style={{ width: 500 }}
          defaultValue="at.d525oyj8d7bwohb40ssn3266cfq2mwi2-8hgpypehn9-1fafaty-ea2fxbc1"
        />
      </div>
      <div>
        staticPath:
        <input
          type="text"
          ref={staticPathRef}
          style={{ width: 500 }}
          defaultValue=""
        />
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
