export type Track = { // One track is for one day
  id: string;
  date: string;
  laneIds: string[];
  description: string;
};
export type Lane = {
  id: string;
  trackId: string;
  description: string;
  order: number;
};
export type Take = {
  id: string;
  trackId: string; // default: trackId = YYYY-MM-DD
  laneId: string;
  startSec: number; //starting time point of this recording take in this song
  endSec: number; //ending time point of this recording take in this song
  recordedAt: number; //at which order number is this take recorded among all takes in this lane
  recordedTime: number;
  description?: string;
  evaluation?: number;
  audioUrl: string;
};
export type TakeDraft ={
  id: string;
  startSec: number;
  endSec: number;
  recordedTime: number;
  audioUrl: string;
}
export const mockTakes: Take[] = [
  // -------------------------
  // Track: 2025-11-24
  // -------------------------
  {
    id: "t1",
    trackId: "2025-11-24",
    laneId: "lane-1",
    startSec: 0,
    endSec: 10,
    recordedAt: 1,
    recordedTime: 1732443000000, // timestamp
    description: "First take of the day",
    evaluation: 3,
    audioUrl:"xxx"
  },
  {
    id: "t2",
    trackId: "2025-11-24",
    laneId: "lane-1",
    startSec: 5,
    endSec: 15,
    recordedAt: 2,
    recordedTime: 1732443300000,
    description: "Second take",
    evaluation: 4,
    audioUrl:"xxx"
  },
  {
    id: "t3",
    trackId: "2025-11-24",
    laneId: "lane-2",
    startSec: 0,
    endSec: 13,
    recordedAt: 3,
    recordedTime: 1732443600000,
    description: "Try another version on a new lane",
    evaluation: 2,
    audioUrl:"xxx"
  },

  // -------------------------
  // Track: 2025-11-25
  // -------------------------
  {
    id: "t4",
    trackId: "2025-11-25",
    laneId: "lane-1",
    startSec: 20,
    endSec: 33,
    recordedAt: 1,
    recordedTime: 1732529400000,
    description: "Started late section",
    evaluation: 5,
    audioUrl:"xxx"
  },
  {
    id: "t5",
    trackId: "2025-11-25",
    laneId: "lane-1",
    startSec: 0,
    endSec: 12,
    recordedAt: 2,
    recordedTime: 1732529700000,
    description: "Second try on same lane",
    evaluation: 3,
    audioUrl:"xxx"
  },
  {
    id: "t6",
    trackId: "2025-11-25",
    laneId: "lane-2",
    startSec: 0,
    endSec: 20,
    recordedAt: 3,
    recordedTime: 1732530000000,
    description: "Full section attempt",
    evaluation: 4,
    audioUrl:"xxx"
  },
];
