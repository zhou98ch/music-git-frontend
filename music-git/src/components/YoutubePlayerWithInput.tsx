import React from "react";
import { YouTubePlayer } from "./YoutubePlayer.tsx";
import type { TimeBase } from "../common/TimeBase.ts";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
type TakeDraft ={
  id: string;
  startSec: number;
  endSec: number;
  recordedTime: number;
  audioUrl: string;
}
export const YouTubePlayerWithInput: React.FC = () => {
  const { isRecording, startRecording, stopRecording, error } = useAudioRecorder();
  const [url, setUrl] = React.useState("");
  const [videoId, setVideoId] = React.useState<string | null>(null);
  const timeBaseRef = React.useRef<TimeBase | null>(null);
  const startSecRef = React.useRef<number|null>(null);
  const [takes, setTakes] = React.useState<TakeDraft[]>([]);

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
      {/* ////////////////////////recoring UI////////////////////// */}
      {videoId && (
        <div className="recording-area">
          <button onClick={async (e)=>{
            const tb = timeBaseRef.current;
            if (!tb) {
              console.warn("TimeBase not ready yet");
              return;
            }
            if(!isRecording) {
              const startSec = tb.nowSec();
              startSecRef.current = startSec;
              await startRecording();
              console.log("startSec:", startSec);
            }
            else {
              const endSec = tb.nowSec();
              const audio = await stopRecording();
              const startSec = startSecRef.current ?? endSec;

              const take: TakeDraft = {
                id: crypto.randomUUID(),
                startSec,
                endSec,
                recordedTime: Date.now(),
                audioUrl: audio.url,
              };
              setTakes((prev) => [...prev, take]);
              console.log("TAKE:", take);
            }
            
          }
          }>
            {!isRecording ? "start":"stop"}
          </button>
          {error && (
            <div style={{ marginTop: 8, color: "crimson", fontSize: 12 }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            {takes.map((t) => (
              <div key={t.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: "#555" }}>
                  {t.startSec.toFixed(2)}s → {t.endSec.toFixed(2)}s
                </div>
                <audio controls src={t.audioUrl} />
              </div>
            ))}
          </div>

        </div>
      )}
      {/* //////////////////////////////////////////////////////////// */}
    </div>
  );
};