import React from "react";
import type { AudioMode } from "./useAudioRecorder";

type MicLevelOptions = {
  mode: AudioMode;
  deviceId: string; // "default" or real deviceId
};

export function useMicLevel({ mode, deviceId }: MicLevelOptions) {
  const [level, setLevel] = React.useState(0); // 0..1
  const [isMonitoring, setIsMonitoring] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const streamRef = React.useRef<MediaStream | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const dataRef = React.useRef<Uint8Array<ArrayBuffer> | null>(null);

  const stopMonitoring = React.useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (audioCtxRef.current) {
      // close releases audio resources
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    analyserRef.current = null;
    dataRef.current = null;

    setIsMonitoring(false);
    setLevel(0);
  }, []);

  const startMonitoring = React.useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("getUserMedia is not supported in this browser.");
      return;
    }

    // If already monitoring, do nothing
    if (isMonitoring) return;

    try {
      // Same reasoning as recorder:
      // - "instrument" wants raw-ish signal
      // - "voice" wants call-optimized processing
      const baseConstraints: MediaTrackConstraints =
        mode === "instrument"
          ? {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            }
          : {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          ...baseConstraints,
          ...(deviceId && deviceId !== "default"
            ? { deviceId: { exact: deviceId } }
            : {}),
        },
      });

      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048; // time-domain buffer size
      analyser.smoothingTimeConstant = 0.8; // smoother meter

      source.connect(analyser);
      analyserRef.current = analyser;


      const data = new Uint8Array<ArrayBuffer>(new ArrayBuffer(analyser.fftSize));
      dataRef.current = data;

      setIsMonitoring(true);

      const tick = () => {
        const a = analyserRef.current;
        const d = dataRef.current;
        if (!a || !d) return;

        a.getByteTimeDomainData(d);

        // Convert 0..255 -> centered -1..1 and compute RMS
        let sumSq = 0;
        for (let i = 0; i < d.length; i++) {
          const v = (d[i] - 128) / 128;
          sumSq += v * v;
        }
        const rms = Math.sqrt(sumSq / d.length); // ~0..1

        // Apply a gentle gain to make small signals visible
        const boosted = Math.min(1, rms * 2.5);
        setLevel(boosted);

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      setError("Microphone permission denied or not available.");
      stopMonitoring();
    }
  }, [deviceId, isMonitoring, mode, stopMonitoring]);

  // Stop on unmount
  React.useEffect(() => stopMonitoring, [stopMonitoring]);

  return { level, isMonitoring, error, startMonitoring, stopMonitoring };
}
