import React from "react";
import type { Take } from "../common/types";
import { TrackView } from "./TrackView";
import { PieceGlobalAxis } from "./PieceGlobalAxis";
import { SelectedTakePanel } from "./SelectedTakePanel";

type PieceTimelineProps  = {
    totalDurationSec: number;
    tracks:Record<string, Take[]>; // key: trackId, value: all takes for this song pieces; takes belong to different lanes, and lanes belong to different tracks
}

export const PieceTimeline : React.FC<PieceTimelineProps > = ({totalDurationSec, tracks}) => {
    const [hoveredTake, setHoveredTake] = React.useState<Take | null>(null);
    const [selectedTake, setSelectedTake] = React.useState<Take | null>(null);
return (
        <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>

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
                onSelectTake={setSelectedTake}
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
        );

}