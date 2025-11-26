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

    return( <div>Track Timeline for {trackId} on {date}, with {takes.length} takes
    {Object.entries(lanes).map(([laneId, laneTakes])=> (<div key = {laneId}> lane Id: {laneId}, number of takes: {laneTakes.length} </div>))
    }
    </div>
    )
 }