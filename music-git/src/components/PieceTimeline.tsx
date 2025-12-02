import React from "react";
import type { Take } from "../common/types";
import { TrackView } from "./TrackView";

type PieceTimelineProps  = {
    totalDurationSec: number;
    tracks:Record<string, Take[]>; // key: trackId, value: all takes for this song pieces; takes belong to different lanes, and lanes belong to different tracks
}

export const PieceTimeline : React.FC<PieceTimelineProps > = ({totalDurationSec, tracks}) => {
    const [hoveredTrack, setHoveredTrack] = React.useState<string | null>(null);
    return(
        <div>
            {
                Object.entries(tracks).map(([trackId, takes])=>(
                    <TrackView
                        key={trackId}
                        trackId={trackId}
                        date={trackId}
                        takes={takes}
                        totalDurationSec={totalDurationSec}
                        // onHoverTake={setHoveredTake}   // TODO add hover handling later
                    />
            ))
            }
            
        </div>

    )
}