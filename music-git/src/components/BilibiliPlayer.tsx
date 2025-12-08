import React from "react";

type BilibiliPlayerProps = {
  bvid: string;    // e.g.：BV1Xx411c7mD
  page?: number;   // optional：page numer，default 1
};

export const BilibiliPlayer: React.FC<BilibiliPlayerProps> = ({ bvid, page = 1 }) => {
  bvid = "BV15j411r756"; //mock

  const embedUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=${page}`;

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
      <iframe
        src={embedUrl}
        scrolling="no"
        frameBorder="no"
        allowFullScreen
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
      ></iframe>
    </div>
  );
};
