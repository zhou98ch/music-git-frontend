import React from "react";

export function useAudioRecorder() {
    const [isRecording, setIsRecording] = React.useState(false);
    const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const streamRef = React.useRef<MediaStream | null>(null);
    const chunksRef = React.useRef<BlobPart[]>([]);
    const stopResolveRef = React.useRef<((result: {blob:Blob; url: string}) => void) | null>(null);
    
    const startRecording = async () => {
        // 0) in case of double clicks
        if (isRecording) return;
        // 1) reset UI errors
        setError(null);

        // 2) clean previous audio url to avoid memory leak
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }

        // 3) reset chunks (ref: no re-render, no stale closure)
        chunksRef.current = [];

        // 4) feature checks
        if (!navigator.mediaDevices?.getUserMedia) {
            setError("getUserMedia is not supported in this browser.");
            return;
        }
        if (typeof MediaRecorder === "undefined") {
            setError("MediaRecorder is not supported in this browser.");
            return;
        }

        try {
            // 5) request microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // 6) create recorder
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;

            // 7) collect chunks
            recorder.ondataavailable = (e: BlobEvent) => {
            if (e.data && e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
            };

            // 8) build final blob on stop
            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                stopResolveRef.current?.({blob, url});
                stopResolveRef.current = null;

                // release microphone
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((t) => t.stop());
                    streamRef.current = null;
                }

                // cleanup recorder
                mediaRecorderRef.current = null;

                // update UI state (recording really finished here)
                setIsRecording(false);
            };

            // 9) start recording
            recorder.start();
            setIsRecording(true);
                
        } catch (err) {
            setError("Microphone permission denied or not available.");
        }
    };
    const stopRecording = () => {
        const recorder = mediaRecorderRef.current;
        if (!recorder || recorder.state === "inactive") {
          throw new Error("Not recording");
        }

        return new Promise<{blob:Blob; url:string}>((resolve) => {
            stopResolveRef.current = resolve;
            recorder.stop();
        })
    };
    return { isRecording, startRecording, stopRecording, error, audioUrl  };
}
