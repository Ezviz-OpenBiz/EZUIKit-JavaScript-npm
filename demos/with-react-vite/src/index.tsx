import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Player from "./Player";
import ThemePlayer from "./ThemePlayer";

const App = () => {
  const [tab, setTab] = useState<"ezuikit" | "theme">("ezuikit");

  return (
    <>
      <div className="tabs">
        <button disabled={tab === "ezuikit"} onClick={() => setTab("ezuikit")}>
          ezuikit-js
        </button>
        <button disabled={tab === "theme"} onClick={() => setTab("theme")}>
          @ezuikit/player-theme
        </button>
      </div>
      {tab === "ezuikit" ? <Player /> : <ThemePlayer />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
