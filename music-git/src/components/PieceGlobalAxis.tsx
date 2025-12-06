import React from "react";
import type { Take } from "../common/types";
import { groupTakesByLane } from "../utils/helpers";

type PieceGlobalAxis  = {
    totalDurationSec: number;
    hoveredTake: Take | null;
}


export const PieceGlobalAxis : React.FC<PieceGlobalAxis > = ({totalDurationSec, hoveredTake}) => { 
    return(<>
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
    </>
    )
}