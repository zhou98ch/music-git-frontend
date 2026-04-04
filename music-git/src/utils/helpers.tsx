import type { Take, TakeDraft } from "../common/types";
/**
* Group the passed-in takes array by trackId, and sort the takes within each group in descending order by the recordedAt field.
* @param takes The list of takes to be grouped.
* @returns An object with trackId as the key and an array of takes belonging to that track (sorted in ascending date order).
*/
// Die Functionen wie Gruppierung erfolgt im Frontend, weil die UI flexibel bleibt:
// verschiedene Ansichten (nach Datum, Lane, Bewertung usw.) können
// ohne Änderungen am Backend umgesetzt werden.
export function groupTakesByTrack(takes: Take[]): Record<number, Take[]>
{
  const groupedTakes: Record<number, Take[]> = {}; 
  for (const take of takes) {
    const trackId = take.trackId;
    if (!groupedTakes[trackId]) {
      groupedTakes[trackId] = [];
    }
    groupedTakes[trackId].push(take);
  }
  for (const trackId of Object.keys(groupedTakes).map(Number)) {
    groupedTakes[trackId].sort((a, b) => a.recordedAt - b.recordedAt); //ascending order, old → new
  }
  return groupedTakes;
}

export function groupTakesByLane(allTakesInTrack: Take[]):Record<number, Take[]>{
  const groupedTakesByLane: Record<number, Take[]> = {};
  for (const take of allTakesInTrack) {
    const laneId = take.laneId;
    if(!groupedTakesByLane[laneId]){
      groupedTakesByLane[laneId] = [];
    }
    groupedTakesByLane[laneId].push(take);
  }
  for (const laneId of Object.keys(groupedTakesByLane).map(Number)) {
    groupedTakesByLane[laneId].sort((a, b) => a.startSec - b.startSec); //ascending order, beginning → end
  }
  return groupedTakesByLane;
}
export function makeTakeFromDraft(args: {
  draft: TakeDraft;
  trackId: number;
  laneId: number;
  existingTakes: Take[];
}): Take {
  const { draft, trackId, laneId, existingTakes } = args;

  const recordedAt =
    existingTakes.filter((t) => t.trackId === trackId && t.laneId === laneId).length + 1;

  return {
    id: draft.id,
    trackId,
    laneId,
    startSec: draft.startSec,
    endSec: draft.endSec,
    recordedAt,
    recordedTime: draft.recordedTime,
    description: "",
    evaluation: 0,
    audioUrl: draft.audioUrl,
    audioBlob: draft.audioBlob,
  };
}

