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
            <div className="lane-row" key = {laneId} style={{background: " #dbceffff"}}>
                {/* <p>.</p> */}
                <div className="lane-title" style={{background: " #c8c8c8ff"}}> Lane {laneId}: </div>
                {
                    laneTakes.map((take) => (
                        <div className="take-block" key = {take.id} style={{
                            padding: "4px 8px",
                            background: "#ddeeff",
                            borderRadius: "4px",
                            display: "inline-block",
                            marginRight: "8px",
                            marginBottom: "6px",}}
                        > Take {take.id}: {take.startSec}s → {take.endSec}s </div>
                    ))
                }
                {/* <p>.</p> */}
            </div>
                
        ))
        }
    {/* <p>.</p> */}
    </div>
    </>
    )
 }