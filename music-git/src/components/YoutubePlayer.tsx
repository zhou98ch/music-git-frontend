import React from "react";
import type { TimeBase } from "../common/TimeBase";
/**
* YouTubePlayer → TimeBase Adapter
* The YouTubePlayer component encapsulates all YouTube-specific logic:
* loading the YouTube IFrame API
* creating and destroying the YT.Player instance
* mapping YouTube methods to a minimal TimeBase
* When the YouTube player becomes ready, it exposes a TimeBase instance via a callback:
* onTimeBaseReady(tb: TimeBase)
* This allows the rest of the application to remain completely unaware of YT.Player.
*/
type YouTubePlayerProps = {
  videoId: string;

  /**
   * Called once the YouTube player is initialized and ready.
   *
   * The callback receives a TimeBase adapter, which exposes a minimal,
   * provider-agnostic API (nowSec/seekTo/play/pause).
   *
   * This is the core decoupling point:
   * - Parent/business logic can use TimeBase without knowing YT.Player details.
   * - Recorder and timeline can later switch to another provider by swapping
   *   the TimeBase implementation, without changing recording code.
   */
  onTimeBaseReady?: (tb: TimeBase) => void;
};

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeIframeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    if (existing) {
      window.onYouTubeIframeAPIReady = () => resolve();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => resolve();
  });
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onTimeBaseReady }) => {
  const playerRef = React.useRef<any>(null);

  React.useEffect(() => {
    let destroyed = false;

    (async () => {
      await loadYouTubeIframeAPI();
      if (destroyed) return;

      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        playerVars: { origin: window.location.origin },
        events: {
          onReady: () => { // Fired when player is ready
            // console.log("YT Player ready");

            const tb: TimeBase = {
              nowSec: () => playerRef.current?.getCurrentTime?.() ?? 0,
              play: () => playerRef.current?.playVideo?.(),
              pause: () => playerRef.current?.pauseVideo?.(),
              seekTo: (sec: number) => playerRef.current?.seekTo?.(sec, true),
              isReady: () => true,
            };

            onTimeBaseReady?.(tb);
          },
        },
      });
    })();

    return () => {
      destroyed = true;
      if (playerRef.current?.destroy) playerRef.current.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <div>
      <div id="yt-player" />
      <button
        onClick={() => {
          const sec = playerRef.current?.getCurrentTime?.();
          console.log("YT currentTime:", sec);
        }}
      >
        Debug: getCurrentTime
      </button>
    </div>
  );
};