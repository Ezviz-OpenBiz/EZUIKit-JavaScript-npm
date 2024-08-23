import { useEffect, useRef } from "react";
import EZUIKit from "ezuikit-js";

const App = () => {
  const playerRef = useRef<any>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const accessTokenRef = useRef<HTMLInputElement>(null);

  const init = () => {
    const url = urlRef.current?.value;
    const accessToken = accessTokenRef.current?.value;
    if (!playerRef.current) {
      playerRef.current = new EZUIKit.EZUIKitPlayer({
        id: "video-container", // 视频容器ID
        template: "pcLive",
        accessToken:
          "at.0siysnsad14jkcgmbnp2pbop427gcbx6-8l00xx7oa9-193qkwi-ryfn1m0j",
        url: "ezopen://open.ys7.com/BC7900686/1.hd.live",
        width: 600,
        height: 400,
        handleError: (error: any) => {
          console.log("handleError", error);
        },
        // language: "zh", // zh | en
        // staticPath: "/ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
      });
    }
  };

  const handleInit = () => {
    init();
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  const handleCapturePicture = () => {
    if (playerRef.current) {
      playerRef.current.capturePicture();
    }
  };

  const handleDestroy = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  };

  return (
    <div>
      <div id="video-container"></div>
      <div>
        <div>
          <div>
            url:
            <input ref={urlRef} style={{ width: 400 }} />
          </div>
          <div>
            accessToken: <input ref={accessTokenRef} style={{ width: 400 }} />
          </div>
        </div>
        <button onClick={handleInit}>初始化</button>
        <button onClick={handleStop}>暂停</button>
        <button onClick={handleCapturePicture}>截图</button>
        <button onClick={handleDestroy}>销毁</button>
      </div>
    </div>
  );
};

export default App;
