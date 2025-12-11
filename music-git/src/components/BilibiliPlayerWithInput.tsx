import React from "react";
import { BilibiliPlayer } from "./BilibiliPlayer.tsx";

export const BilibiliPlayerWithInput: React.FC = () => {
  const [url, setUrl] = React.useState("");
  const [videoId, setVideoId] = React.useState<string | null>(null);

  // extract a unique identifier:bvid from Bilibili URL
    function extractBvid(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.pathname.startsWith("/video/")) {
        // /video/BV1111ddkfj/
        return u.pathname.split("/")[2] || null;
        }
    } catch {
        // not URL，directly input with bvid
        if (url.startsWith("BV")) return url;
    }
    return null;
    }

  const handleLoad = () => {
    const id = extractBvid(url.trim());
    setVideoId(id);
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="paste Bilibili link or bvid"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "80%", marginRight: 8 }}
        />
        <button onClick={handleLoad}>Load the video</button>
      </div>

      {videoId ? (
        <BilibiliPlayer bvid={videoId} />
      ) : (
        <div style={{ fontSize: 12, color: "#666" }}>
          Please enter a valid Bilibili Link
        </div>
      )}
    </div>
  );
};
