import React, { useCallback, useEffect, useRef } from "react";
// 必须引入主题样式 (The theme stylesheet is required)
import "@ezuikit/player-theme/dist/style.css";
import { Theme } from "@ezuikit/player-theme";
import type { ThemeOptions } from "@ezuikit/player-theme";
import "./index.css";

/**
 * @ezuikit/player-theme 单独使用示例
 *
 * Theme 只负责播放器的 UI 展示与交互（控件栏、加载动画、全屏等），不负责解码和拉流。
 * 这里用原生 <video> 播放 mp4，通过 Theme 事件驱动 video，再把 video 状态同步回 Theme。
 *
 * Standalone example of @ezuikit/player-theme.
 * Theme only renders the UI and handles interaction; it does not decode or pull streams.
 * A native <video> plays the mp4: Theme events drive the video, and video state is synced back to Theme.
 */
const ThemePlayer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // video 由代码创建并挂到 Theme 的渲染区域，不交给 React 渲染 (the video is created imperatively, not rendered by React)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const theme = useRef<Theme | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);

  const destroyTheme = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
      videoRef.current = null;
    }
    if (theme.current) {
      theme.current.destroy();
      theme.current = null;
    }
  }, []);

  // 组件卸载时销毁，避免内存泄漏 (destroy on unmount to avoid leaks)
  useEffect(() => destroyTheme, [destroyTheme]);

  const initTheme = useCallback(() => {
    const container = containerRef.current;
    const url = urlRef.current?.value.trim();
    if (!container || !url) {
      console.warn("container or url is empty!");
      return;
    }

    destroyTheme();

    const options: ThemeOptions = {
      container,
      type: "mp4",
      sdkType: "base", // 必填: base 基线 | custom 定制 (required in the type declaration)
      isEzviz: false, // 非萤石播放地址 (the url is not an Ezviz address)
      url,
      width: 600,
      height: 400,
      scaleMode: 1,
      // Theme 实际默认 autoPlay 为 true，且会在构造时立刻触发 play 事件，此时下面的监听器还没注册，
      // 会导致 UI 显示播放中而 video 仍是暂停。这里显式关闭，由用户点击播放。
      // Theme's effective default for autoPlay is true and it emits `play` during construction, before the
      // listeners below are registered, leaving the UI "playing" while the video is paused. Turn it off explicitly.
      autoPlay: false,
      // Theme 默认会渲染一张封面（z-index 高于视频，且单独使用时不会自动隐藏），会挡住画面，所以这里不渲染封面。
      // 如需封面，请在视频播放后自行调用 theme.posterControl.hide()，或传入 posterOptions: { poster: "..." }。
      // Theme renders a default poster above the video and, when used standalone, never hides it by itself,
      // so it would cover the picture. Disable it here. To keep a poster, call theme.posterControl.hide() once playing.
      posterOptions: null,
      language: languageRef.current?.value,
      // 自定义控件布局，也可以改用内置模板: template: "pcLive"
      // Custom control layout. You can also use a built-in template instead: template: "pcLive"
      themeData: {
        autoFocus: 3, // 控件无操作 3 秒后自动隐藏 (seconds), 0 表示一直展示
        header: { btnList: [] },
        footer: {
          btnList: [
            { iconId: "play", part: "left" },
            { iconId: "volume", part: "left" },
            { iconId: "fullscreen", part: "right" },
          ],
        },
      },
    };
    theme.current = new Theme(options);
    const t = theme.current;
    (window as any).theme = t;

    // 把 video 放进 Theme 的视频渲染区域 (.ezplayer-content-video)，控件会叠加在它上方
    // Put the video into Theme's render area (.ezplayer-content-video); the controls overlay it.
    const video = document.createElement("video");
    video.playsInline = true;
    video.preload = "auto";
    videoRef.current = video;
    t.contentControl.$video.appendChild(video);

    // Theme -> video: 用户点击控件
    t.on(Theme.EVENTS.play, (playing: boolean) => {
      if (playing && video.paused) {
        video.play().catch((e) => console.warn("play failed", e));
      } else if (!playing && !video.paused) {
        video.pause();
      }
    });
    t.on(Theme.EVENTS.volumechange, (volume: number, muted: boolean) => {
      video.volume = volume;
      video.muted = muted;
    });

    // video -> Theme: 把真实播放状态同步给 UI
    video.onplay = () => (t.playing = true);
    video.onpause = () => (t.playing = false);
    video.onwaiting = () => (t.loading = true);
    video.oncanplay = () => (t.loading = false);
    video.onplaying = () => (t.loading = false);
    video.onended = () => (t.playing = false);

    t.loading = true;
    video.src = url;
    video.load();
  }, [destroyTheme]);

  return (
    <div className="player-wrapper">
      <h2>player-theme 使用示例 (Example of using @ezuikit/player-theme)：</h2>
      {/* Theme 挂载到这个容器 (Theme mounts into this container) */}
      <div ref={containerRef} id="theme-container" />
      <div className="form">
        <div className="form-item">
          <label>url (mp4)</label>
          {/* prettier-ignore */}
          <input ref={urlRef} placeholder="mp4 url" defaultValue="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
        </div>
        <div className="form-item">
          <label>language</label>
          <select ref={languageRef} defaultValue="zh" style={{ width: 100 }}>
            <option value="zh">zh</option>
            <option value="en">en</option>
          </select>
        </div>
      </div>
      <div>
        <button onClick={initTheme}>初始化(init)</button>
        <button onClick={() => theme.current?.fullscreen()}>fullscreen</button>
        <button onClick={() => theme.current?.resize(400, 300)}>resize 400x300</button>
        <button onClick={() => theme.current?.resize(600, 400)}>resize 600x400</button>
        <button onClick={destroyTheme}>destroy</button>
      </div>
    </div>
  );
};

export default ThemePlayer;
