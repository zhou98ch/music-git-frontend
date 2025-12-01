import React from "react";
import type { Take } from "../common/types";
import { groupTakesByLane } from "../utils/helpers";

type TrackViewProps  = {
    trackId: string;
    date?: string;
    takes: Take[];
    totalDurationSec: number;
}


export const TrackView : React.FC<TrackViewProps > = ({trackId, date, takes, totalDurationSec}) => { 

    const lanes = groupTakesByLane(takes);
    const [hoveredTake, setHoveredTake] = React.useState<Take | null>(null);
    return( <>
    {/* <div>Track Timeline for {trackId} on {date}, with {takes.length} takes
    {
        Object.entries(lanes).map(([laneId, laneTakes])=> (<div key = {laneId}> lane Id: {laneId}, number of takes: {laneTakes.length} </div>))
    }
    </div> */}
    <div className="track-row" style={{background: " #ffe2ceff"}}>
        {/* <p>.</p> */}
        <div className="track-title" style={{background: " #fff0ceff"}}>Track on {trackId}</div>
        { Object.entries(lanes).map(([laneId, laneTakes])=> (
            <div className="lane-row" key = {laneId} style={{background: " #dbceffff", marginBottom: "12px" }}>
                {/* <p>.</p> */}
                <div className="lane-title" style={{background: " #c8c8c8ff"}}> Lane {laneId}: </div>
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

                            return(
                                <div className="take-block" key = {take.id}       
                                    onMouseEnter={() => setHoveredTake(take)}
                                    onMouseLeave={() => setHoveredTake(null)}
                                    style={{
                                        position: "absolute",
                                        left: `${leftPercent}%`,
                                        width: `${widthPercent}%`,
                                        top: "4px",
                                        bottom: "4px",
                                        borderRadius: "4px",
                                        background: isHovered ? "#bcd9ff" : "#ddeeff",
                                        border: isHovered ? "2px solid #3366cc" : "1px solid #8899bb",
                                        zIndex: isHovered ? 2 : 1,
                                        fontSize: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                    }}> 
                                    Take {take.id}: {take.startSec}s → {take.endSec}s 
                                </div>
                                );
                            })
                        }
                        
                    </div>
                {/* <p>.</p> */}
            </div>
                
        ))
        }

        {/* Unified time axis for this track */}
        <div
            style={{
            position: "relative",
            marginTop: "8px",
            height: "32px",
            border: "1px solid #666",
            borderRadius: "4px",
            background: "#f0f0f0",
        }}
        >
        {/* left end：0s */}
        <div
            style={{
            position: "absolute",
            left: 0,
            top: "16px",
            transform: "translateY(-50%)",
            fontSize: "10px",
            paddingLeft: "4px",
            }}
        >
            0s
        </div>
        {/* right end：totalDurationSec */}
        <div
            style={{
            position: "absolute",
            right: 0,
            top: "16px",
            transform: "translateY(-50%)",
            fontSize: "10px",
            paddingRight: "4px",
            }}
        >
            {totalDurationSec}s
        </div>

        {/* the line */}
        <div
            style={{
            position: "absolute",
            left: "0",
            right: "0",
            top: "50%",
            height: "1px",
            background: "#999",
            }}
        />

        {/* if a take is hovered, then draw axis (of start/end) on the timeline start/end */}
        {hoveredTake && (() => {
            const safeTotal = totalDurationSec > 0 ? totalDurationSec : 1;
            const startPercent = (hoveredTake.startSec / safeTotal) * 100;
            const endPercent = (hoveredTake.endSec / safeTotal) * 100;

            return (
            <>
                {/* start axis line */}
                <div
                style={{
                    position: "absolute",
                    left: `${startPercent}%`,
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    background: "#652a03ff",
                }}
                />
                {/* start text */}
                <div
                style={{
                    position: "absolute",
                    left: `${startPercent}%`,
                    top: "32px",
                    transform: "translate(-50%)",
                    fontSize: "10px",
                    color: "#652a03ff",
                    background: "#fff",
                    padding: "0 2px",
                    borderRadius: "2px",
                    border: "1px solid #652a03ff",
                }}
                >
                {hoveredTake.startSec}s
                </div>

                {/* end axis line */}
                <div
                style={{
                    position: "absolute",
                    left: `${endPercent}%`,
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    background: "#652a03ff",
                }}
                />
                {/* end text */}
                <div
                style={{
                    position: "absolute",
                    left: `${endPercent}%`,
                    top: "32px",
                    transform: "translate(-50%)",
                    fontSize: "10px",
                    color: "#652a03ff",
                    background: "#fff",
                    padding: "0 2px",
                    borderRadius: "2px",
                    border: "1px solid #652a03ff",
                }}
                >
                {hoveredTake.endSec}s
                </div>
            </>
            );
        })()}
        </div>

    {/* <p>.</p> */}
    </div>
    </>
    )
 }