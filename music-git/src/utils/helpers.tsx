import type { Take } from "../common/types";
/**
* Group the passed-in takes array by trackId, and sort the takes within each group in descending order by the recordedAt field.
* @param takes The list of takes to be grouped.
* @returns An object with trackId as the key and an array of takes belonging to that track (sorted in ascending date order).
*/
// Die Functionen wie Gruppierung erfolgt im Frontend, weil die UI flexibel bleibt:
// verschiedene Ansichten (nach Datum, Lane, Bewertung usw.) können
// ohne Änderungen am Backend umgesetzt werden.
export function groupTakesByTrack(takes: Take[]): Record<string, Take[]>
{
  const groupedTakes: Record<string, Take[]> = {}; 
  for (const take of takes) {
    const trackId = take.trackId;
    if (!groupedTakes[trackId]) {
      groupedTakes[trackId] = [];
    }
    groupedTakes[trackId].push(take);
  }
  for (const trackId in groupedTakes) {
    groupedTakes[trackId].sort((a, b) => a.recordedAt - b.recordedAt); //ascending order, old → new
  }
  return groupedTakes;
}

export function groupTakesByLane(allTakesInTrack: Take[]):Record<string, Take[]>{
  const groupedTakesByLane: Record<string, Take[]> = {};
  for (const take of allTakesInTrack) {
    const laneId = take.laneId;
    if(!groupedTakesByLane[laneId]){
      groupedTakesByLane[laneId] = [];
    }
    groupedTakesByLane[laneId].push(take);
  }
  for (const laneId in groupedTakesByLane) {
    groupedTakesByLane[laneId].sort((a, b) => a.startSec - b.startSec); //ascending order, beginning → end
  }
  return groupedTakesByLane;
}