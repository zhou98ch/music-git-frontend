import React from "react";
import type { Lane, Take } from "../common/types";

type TrackViewProps  = {
    trackId: string;
    date?: string;
    lanes: Lane[];
    takes: Take[];
    totalDurationSec: number;
    hoveredTake: Take | null;
    onHoverTake: (take: Take | null) => void;
    selectedTake: Take | null;
    onSelectTake: (take: Take | null) => void;
}

const MIN_WIDTH_PX = 6;

export const TrackView : React.FC<TrackViewProps > = ({trackId, lanes, takes, totalDurationSec, hoveredTake, onHoverTake, selectedTake, onSelectTake}) => { 
    // const [hoveredTake, setHoveredTake] = React.useState<Take | null>(null);
    return( <>
    {/* <div>Track Timeline for {trackId} on {date}, with {takes.length} takes
    {
        Object.entries(lanes).map(([laneId, laneTakes])=> (<div key = {laneId}> lane Id: {laneId}, number of takes: {laneTakes.length} </div>))
    }
    </div> */}
    <div className="track-row" style={{background: " #ffe2ceff"}}>
        {/* <p>.</p> */}
        <div className="track-title" style={{background: " #fff0ceff"}}>Track on {trackId}</div>
        { lanes.map((lane) => {
            const laneTakes = takes
                .filter((take) => take.laneId === lane.id)
                .sort((a, b) => a.startSec - b.startSec);

            return (
            <div className="lane-row" key = {lane.id} style={{background: " #dbceffff", marginBottom: "12px" }}>
                {/* <p>.</p> */}
                <div className="lane-title" style={{background: " #c8c8c8ff"}}> Lane {lane.description || lane.id}: </div>
                    <div
                        style={{
                        position: "relative",
                        height: "32px",
                        border: "1px solid #aaa",
                        borderRadius: "4px",
                        background: "#f7f7f7",
                        overflow: "hidden",
                        }}
                    >
                        
                            
                        {laneTakes.map((take) => {
                            const safeTotalDuration = totalDurationSec > 0 ? totalDurationSec : 1;
                            const leftPercent = (take.startSec / safeTotalDuration) * 100;
                            const widthPercent = ((take.endSec - take.startSec) / safeTotalDuration) * 100;
                            
                            const isHovered = hoveredTake?.id === take.id;
                            const isSelected = selectedTake?.id === take.id;

                            return(
                                <div  className="take-block" key = {take.id}       
                                      onMouseEnter={() => onHoverTake(take)} // tell parent component<PieceTimeline> which take is hovered
                                      onMouseLeave={() => onHoverTake(null)}
                                      onClick={() => onSelectTake?.(take)}

                                      style={{
                                            position: "absolute",
                                            left: `${leftPercent}%`,
                                            width: `${widthPercent}%`,
                                            minWidth: `${MIN_WIDTH_PX}px`,
                                            top: "4px",
                                            bottom: "4px",
                                            borderRadius: "4px",
                                            opacity: !isHovered ? 0.7 : 1,
                                            background: isSelected
                                            ? "#99c2ff"
                                            : isHovered
                                            ? "#bcd9ff"
                                            : "#ddeeff",
                                            border: isSelected
                                            ? "2px solid #0044cc"
                                            : isHovered
                                            ? "2px solid #3366cc"
                                            : "1px solid #8899bb",
                                            zIndex: isSelected ? 3 : isHovered ? 2 : 1,
                                            fontSize: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            cursor: "pointer",
                                    }}> 
                                    {/* Take {take.id}: {take.startSec}s → {take.endSec}s  */}
                                </div>
                                );
                            })
                        }
                        
                    </div>
                {/* <p>.</p> */}
            </div>
            );
        })}



    {/* <p>.</p> */}
    </div>
    </>
    )
 }