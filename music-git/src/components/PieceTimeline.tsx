import React from "react";
import type { Take, TakeDraft } from "../common/types";
import { TrackView } from "./TrackView";
import { PieceGlobalAxis } from "./PieceGlobalAxis";
import { SelectedTakePanel } from "./SelectedTakePanel";
import type { TimeBase } from "../common/TimeBase";
type PieceTimelineProps  = {
    totalDurationSec: number;
    tracks:Record<string, Take[]>; // key: trackId, value: all takes for this song pieces; takes belong to different lanes, and lanes belong to different tracks
    timeBaseRef:React.RefObject<TimeBase | null>;
}
export const PieceTimeline : React.FC<PieceTimelineProps > = ({totalDurationSec, tracks, timeBaseRef}) => {
    const [hoveredTake, setHoveredTake] = React.useState<Take | null>(null);
    const [selectedTake, setSelectedTake] = React.useState<Take | null>(null);
    const takeAudioRef = React.useRef<HTMLAudioElement | null>(null);
    // const [activeTake, setActiveTake] = React.useState<Take | null>(null);
    const playTake = React.useCallback((t: Take | null) => {
        if (!t) return;
        const tb = timeBaseRef.current;
        if (!tb) {
            alert("Video Provider not ready");
            return;
        }
        const ready = tb.isReady ? tb.isReady() : true;
        if (!ready) {
            alert("Video Provider not ready");
            return;
        }

        // Video control
        tb.seekTo(t.startSec);
        tb.play();

        // Take audio
        const audio = takeAudioRef.current;
        if(!audio) return;
        if(audio.src != t.audioUrl) audio.src = t.audioUrl;
        audio.currentTime = 0;
        void audio.play();
    }, [timeBaseRef]);

return (
        <>
        <div style={{ display: "flex", flexDirection: "row", gap: "16px", width: "100%" }}>

            {/* left：recording timeline */}
            <div style={{ flex: 1 }}>
            <PieceGlobalAxis totalDurationSec={totalDurationSec} hoveredTake={hoveredTake} />

            {Object.entries(tracks).map(([trackId, takes]) => (
                <TrackView
                    key={trackId}
                    trackId={trackId}
                    date={trackId}
                    takes={takes}
                    totalDurationSec={totalDurationSec}
                    hoveredTake={hoveredTake}
                    onHoverTake={setHoveredTake}
                    selectedTake={selectedTake}
                    onSelectTake={(t)=>{
                        setSelectedTake(t);
                        playTake(t);
                    }}
                />
            ))}
            </div>

            {/* right：selected take's info */}
            <div style={{ width: "300px" }}>
            {selectedTake && (
                <SelectedTakePanel take={selectedTake} />
            )}
            </div>
            
        </div>
        <audio ref={takeAudioRef} controls 
            onPlay={() => {
                const tb = timeBaseRef.current;
                if (!tb) return;
                const ready = tb.isReady ? tb.isReady() : true;
                if (!ready) return;
                tb.play();
            }}
            onPause={() => {
                const tb = timeBaseRef.current;
                if (!tb) return;
                tb.pause();
            }}

            onSeeked={() => {
                const tb = timeBaseRef.current;
                const audio = takeAudioRef.current;
                const take = selectedTake; // activeTake
                if (!tb || !audio || !take) return;

                const ready = tb.isReady ? tb.isReady() : true;
                if (!ready) return;

                const target = take.startSec + audio.currentTime;
                tb.seekTo(target);

                if (!audio.paused) tb.play();
            }}
        />
        </>
        );

}