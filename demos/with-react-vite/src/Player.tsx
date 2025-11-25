import React, { useCallback, useRef } from "react";
import { EZUIKitPlayer } from "ezuikit-js";
import { isMobile } from "./utils";
import "./index.css";

const Player = () => {
  const player = useRef<any>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const accessTokenRef = useRef<HTMLInputElement>(null);
  const staticPathRef = useRef<HTMLInputElement>(null);
  const domainRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);
  const templateRef = useRef<HTMLSelectElement>(null);

  const initPlayer = useCallback(() => {
    if (document.getElementById("player-container")) {
      let width = 600;
      let height = 400;

      const url = urlRef.current?.value.trim();
      const accessToken = accessTokenRef.current?.value.trim();
      const staticPath = staticPathRef.current?.value.trim() || undefined;
      const domain = domainRef.current?.value.trim() || "https://open.ys7.com";
      const language = languageRef.current?.value.trim();
      const template = templateRef.current?.value.trim();

      if (!url || !accessToken) {
        console.warn("url or accessToken is empty!");
        return;
      }

      if (isMobile()) {
        width = document.documentElement.clientWidth;
        height = (width * 9) / 16;
      }

      if (player.current) {
        player.current.destroy();
        player.current = null;
      }

      player.current = new EZUIKitPlayer({
        id: "player-container",
        url,
        accessToken,
        width,
        height,
        template,
        staticPath, // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
        // quality: 1, // 
        language, // zh | en
        // isCloudRecord: true, // 如果是云录制的播放 需要这个值，是必须的, 8.2.0 开始 默认支持
        scaleMode: 1, // 默认 0 完全填充窗口，会有拉伸 1: 等比适配 2: 等比完全填充窗口, 超出隐藏 @sine 8.2.0
        env: {
          // https://open.ys7.com/help/1772?h=domain
          // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
          // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
          domain, // "https://open.ys7.com"
        },
        plugin: ["talk"], // 加载插件，talk-对讲
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
        // ]
      });

      (window as any).player = player.current;

      player.current.eventEmitter.on(
        EZUIKitPlayer.EVENTS.videoInfo,
        (info: any) => {
          console.log("videoinfo", info);
        },
      );

      player.current.eventEmitter.on(
        EZUIKitPlayer.EVENTS.audioInfo,
        (info: any) => {
          console.log("audioInfo", info);
        },
      );

      // 首帧渲染成功
      // first frame display
      player.current.eventEmitter.on(
        EZUIKitPlayer.EVENTS.firstFrameDisplay,
        () => {
          console.log("firstFrameDisplay ");
        },
      );
      player.current.eventEmitter.on(
        EZUIKitPlayer.EVENTS.streamInfoCB,
        (info: any) => {
          console.log("streamInfoCB ", info);
        },
      );
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
      player.current.fullscreen();
    }
  }, []);

  /** 获取OSD时间 */
  const handleGetOSDTime = useCallback(() => {
    if (player.current) {
      player.current.getOSDTime();
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
    <div className="player-wrapper">
      <h2>ezopen使用示例 (Example of using ezopen)：</h2>
      <div>
        <div id="player-container"></div>
      </div>
      <div className="form">
        <div className="form-item">
          <label>url</label>
          {/* prettier-ignore */}
          <input ref={urlRef} placeholder="ezopen url" defaultValue="ezopen://open.ys7.com/BC7799091/1.hd.live" />
        </div>
        <div className="form-item">
          <label>accessToken</label>
          {/* prettier-ignore */}
          <input ref={accessTokenRef} placeholder="ezopen accessToken" defaultValue="at.9ew2187oaepbxokgc19z6b3ya0wpohl6-2vf37nx7xp-1w19i9r-a0yogcb05" />
        </div>
        <div className="form-item">
          <label>staticPath</label>
          {/* prettier-ignore */}
          {/* https://openstatic.ys7.com/ezuikit_js/v8.1.9/ezuikit_static */}
          <input
            ref={staticPathRef}
            placeholder="ezopen staticPath"
            defaultValue="https://openstatic.ys7.com/ezuikit_js/v8.1.14/ezuikit_static"
          />
        </div>
        <div className="form-item">
          <label>domain</label>
          {/* prettier-ignore */}
          <input ref={domainRef} placeholder="ezopen env.domain" defaultValue="https://open.ys7.com" />
        </div>
        <div className="form-item">
          <label>language</label>
          <select ref={languageRef} defaultValue="zh" style={{ width: 100 }}>
            <option value="zh">zh</option>
            <option value="en">en</option>
          </select>
        </div>
        <div className="form-item">
          <label>template</label>
          {/* prettier-ignore */}
          <select ref={templateRef} defaultValue="pcLive" style={{ width: 100 }}>
            <option value="simple">simple</option>
            <option value="pcLive">pcLive</option>
            {/* To use the replay theme, please use the replay playback address */}
            <option value="pcRec">pcRec</option>
            {/* <option value="mobileLive">mobileLive</option>
            <option value="mobileRec">mobileRec</option> */}
          </select>
        </div>
      </div>
      <div>
        <button onClick={initPlayer}>初始化(init)</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handlePlay}>play</button>
        <button onClick={handleOpenSound}>openSound</button>
        <button onClick={handleCloseSound}>closeSound</button>
        <button onClick={handleStartSave}>startSave</button>
        <button onClick={handleStopSave}>stopSave</button>
        <button onClick={handleCapturePicture}>capturePicture</button>
        <button onClick={handleFullscreen}>fullscreen</button>
        <button onClick={handleGetOSDTime}>getOSDTime</button>
        <button onClick={handleStartTalk}>开始对讲(startTalk)</button>
        <button onClick={handleStopTalk}>结束对讲(stopTalk)</button>
        <button onClick={handleDestroy}>destroy</button>
      </div>
    </div>
  );
};

export default Player;
