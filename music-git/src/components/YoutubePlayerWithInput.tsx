import React from "react";
import { YouTubePlayer } from "./YoutubePlayer.tsx";
import type { TimeBase } from "../common/TimeBase.ts";

export const YouTubePlayerWithInput: React.FC = () => {
  const [url, setUrl] = React.useState("");
  const [videoId, setVideoId] = React.useState<string | null>(null);
  const timeBaseRef = React.useRef<TimeBase | null>(null);

  // extract a unique identifier from YouTube URL: v=xxx
  function extractVideoId(input: string): string | null {
    try {
      const urlObj = new URL(input);
      // https://www.youtube.com/watch?v=xxxx
      if (urlObj.hostname.includes("youtube.com")) {
        return urlObj.searchParams.get("v");
      }
      // https://youtu.be/xxxx
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1) || null;
      }
    } catch {
      // when it is not a valid URL, then perhaps it is a videoId
      if (input.length >= 8) {
        return input;
      }
    }
    return null;
  }

  const handleLoad = () => {
    const id = extractVideoId(url.trim());
    setVideoId(id);
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="paste YouTube link or videoId"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "80%", marginRight: 8 }}
        />
        <button onClick={handleLoad}>Load the video</button>
      </div>

      {videoId ? (
        <YouTubePlayer videoId={videoId} 
        onTimeBaseReady={(tb) => {
          timeBaseRef.current = tb;
          console.log("timeBase ready, now:", tb.nowSec());
        }}/>
      ) : (
        <div style={{ fontSize: 12, color: "#666" }}>
          Please enter a valid YouTube Link
        </div>
      )}
    </div>
  );
};
  export function getCurrentTime(): number {
    return 0;
  }