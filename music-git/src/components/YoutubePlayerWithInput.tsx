import React from "react";
import { YouTubePlayer } from "./YoutubePlayer.tsx";
import type { TimeBase } from "../common/TimeBase.ts";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import type { AudioMode } from "../hooks/useAudioRecorder";
import { useMicLevel } from "../hooks/useMicLevel";
import type { TakeDraft } from "../common/types";

export const YouTubePlayerWithInput: React.FC = () => {
  const [audioInputs, setAudioInputs] = React.useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = React.useState<string>("default");
  const [url, setUrl] = React.useState("");
  const [videoId, setVideoId] = React.useState<string | null>(null);
  const timeBaseRef = React.useRef<TimeBase | null>(null);
  const startSecRef = React.useRef<number|null>(null);
  const [takes, setTakes] = React.useState<TakeDraft[]>([]);
  const [anchorSec, setAnchorSec] = React.useState(0);
  const [audioMode, setAudioMode] = React.useState<AudioMode>("instrument");
  const { isRecording, startRecording, stopRecording, error } = useAudioRecorder({mode: audioMode, deviceId: selectedDeviceId});
  const { level, isMonitoring, error: levelError, startMonitoring, stopMonitoring } =
    useMicLevel({ mode: audioMode, deviceId: selectedDeviceId });
  const refreshAudioInputs = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs = devices.filter((d) => d.kind === "audioinput");
    setAudioInputs(inputs);
  };

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
  React.useEffect(() => {
    refreshAudioInputs();
  }, []);

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
          {/* ////////////////////////button for Grant mic permission / Refresh devices UI////////////////////// */}
          <button
            onClick={async () => {
              try {
                const s = await navigator.mediaDevices.getUserMedia({ audio: true });
                // turn off immediately, in case of taking the microphone
                s.getTracks().forEach((t) => t.stop());
                await refreshAudioInputs();
              } catch (e) {
                console.warn("Mic permission denied", e);
              }
            }}
          >
            Grant mic permission / Refresh devices
          </button>
            {/* ////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            {/* ////////////////////////dropdown UI for difference recording devices///////////////////// */}
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, color: "#555" }}>
                Input device:
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  disabled={isRecording}
                  style={{ marginLeft: 8, maxWidth: 320 }}
                >
                  <option value="default">Default</option>
                  {audioInputs.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Audio input (${d.deviceId.slice(0, 6)}...)`}
                    </option>
                  ))}
                </select>
              </label>
              {isRecording && (
                <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
                  Stop recording to change input device.
                </div>
              )}
            </div>
            {/* /////////////////////////////////////////////////////////////////////// */}
          <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#555" }}>Mic mode:</span>

            <label style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12 }}>
              <input
                type="radio"
                name="audioMode"
                value="instrument"
                checked={audioMode === "instrument"}
                onChange={() => setAudioMode("instrument")}
                disabled={isRecording}
              />
              Instrument
            </label>

            <label style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12 }}>
              <input
                type="radio"
                name="audioMode"
                value="voice"
                checked={audioMode === "voice"}
                onChange={() => setAudioMode("voice")}
                disabled={isRecording}
              />
              Voice / Call
            </label>

            {isRecording && (
              <span style={{ fontSize: 12, color: "#999" }}>
                (stop recording to change)
              </span>
            )}
          </div>

          <button onClick={async (e)=>{
            const tb = timeBaseRef.current;
            if (!tb) {
              console.warn("TimeBase not ready yet");
              return;
            }
            if(!isRecording) {
              const startSec = anchorSec;
              startSecRef.current = startSec;
              tb.seekTo?.(startSec);
              tb.play?.();
              await startRecording();
              console.log("startSec:", startSec);
            }
            else {
              const endSec = tb.nowSec();
              const audio = await stopRecording();
              tb.pause?.()
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
        {/* ///////////////list of takes(temporary)////////////////////////// */}
        <div style={{ marginTop: 12 }}>
          {takes.map((t) => (
            <div
              key={t.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
              }}
            >
              <div
                role="button"
                style={{
                  fontSize: 12,
                  color: "#555",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const tb = timeBaseRef.current;
                  if (!tb || !tb.isReady()) {
                    alert("wait for YouTube to be ready");
                    return;
                  }
                  tb.seekTo(t.startSec);
                  tb.play();
                }}
              >
                {t.startSec.toFixed(2)}s → {t.endSec.toFixed(2)}s
              </div>

              <audio controls src={t.audioUrl} />
            </div>
          ))}
        </div>

        {/* /////////////////////////////////////////// */}
        </div>
      )}
      {/* //////////// frequency display UI/////////////////// */}
      <div style={{ marginTop: 12, padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={isMonitoring ? stopMonitoring : startMonitoring} disabled={isRecording}>
          {isMonitoring ? "Stop meter" : "Start meter"}
        </button>

        <div style={{ fontSize: 12, color: "#555" }}>
          Input level
        </div>
      </div>

      <div
        style={{
          marginTop: 8,
          height: 10,
          width: 260,
          borderRadius: 999,
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.round(level * 100)}%`,
            background: "linear-gradient(90deg, #4ade80, #fbbf24, #ef4444)",
            transition: "width 60ms linear",
          }}
        />
      </div>

      <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
        {Math.round(level * 100)}%
      </div>

      {levelError && (
        <div style={{ marginTop: 8, color: "crimson", fontSize: 12 }}>
          {levelError}
        </div>
      )}

      {isRecording && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>
          Stop recording to use the meter.
        </div>
      )}
    </div>

      {/* /////////////////////////////////////////////////////// */}
      <label style={{ display: "block", marginTop: 12 }}>
        Record from (sec):
        <input
          type="number"
          value={anchorSec}
          min={0}
          step={0.1}
          onChange={(e) => setAnchorSec(Number(e.target.value))}
          style={{ marginLeft: 8, width: 120 }}
        />
      </label>

      {/* //////////////////////////////////////////////////////////// */}
    </div>
  );
};