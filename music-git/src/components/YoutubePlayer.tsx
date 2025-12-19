import React from "react";

type YouTubePlayerProps = { videoId: string };

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

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
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
          onReady: () => console.log("YT Player ready"),
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
