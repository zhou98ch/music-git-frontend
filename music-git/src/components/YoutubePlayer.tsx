import React from "react";

type YouTubePlayerProps = {
  videoId: string;           // e.g. "dQw4w9WgXcQ"
};

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
    videoId = "ujpywovQqeU?si=DEIrIQ2svnP-g42c";
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
      <iframe
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          inset: 0,
          width: "50%",
          height: "50%",
          border: "none",
        }}
      />
    </div>
  );
};
