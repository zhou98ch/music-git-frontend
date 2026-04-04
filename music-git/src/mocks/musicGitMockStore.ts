import type { Lane, Song, Take, Track } from "../common/types";

type PieceDTO = {
  tracks: Track[];
  lanes: Lane[];
  takes: Take[];
};

const mockSongs: Song[] = [
  {
    id: 1,
    name: "Demo Song",
    artist: "Mock Artist",
    description: "Local mock song for timeline UI",
    isPrivate: 0,
    createdUserId: 1,
    categoryId: 1,
  },
];

const initialPiece: PieceDTO = {
  tracks: [
    {
      id: 1,
      createdDate: "2026-03-12",
      description: "Yesterday practice",
    },
    {
      id: 2,
      createdDate: "2026-03-13",
      description: "Today practice",
    },
  ],
  lanes: [
    {
      id: 101,
      trackId: 1,
      description: "Main vocal",
      order: 1,
    },
    {
      id: 102,
      trackId: 1,
      description: "Harmony",
      order: 2,
    },
    {
      id: 201,
      trackId: 2,
      description: "Lead take",
      order: 1,
    },
    {
      id: 202,
      trackId: 2,
      description: "Alt phrasing",
      order: 2,
    },
  ],
  takes: [
    {
      id: "mock-take-1",
      trackId: 1,
      laneId: 101,
      startSec: 5,
      endSec: 18,
      recordedAt: 1,
      recordedTime: Date.parse("2026-03-12T10:00:00Z"),
      description: "Warm-up",
      evaluation: 3,
      audioUrl: "",
      audioBlob: new Blob([], { type: "audio/webm" }),
    },
    {
      id: "mock-take-2",
      trackId: 1,
      laneId: 102,
      startSec: 22,
      endSec: 34,
      recordedAt: 1,
      recordedTime: Date.parse("2026-03-12T10:10:00Z"),
      description: "Harmony pass",
      evaluation: 4,
      audioUrl: "",
      audioBlob: new Blob([], { type: "audio/webm" }),
    },
    {
      id: "mock-take-3",
      trackId: 2,
      laneId: 201,
      startSec: 8,
      endSec: 26,
      recordedAt: 1,
      recordedTime: Date.parse("2026-03-13T09:30:00Z"),
      description: "First take today",
      evaluation: 2,
      audioUrl: "",
      audioBlob: new Blob([], { type: "audio/webm" }),
    },
  ],
};

const mockPieceState: PieceDTO = structuredClone(initialPiece);

function clonePiece(): PieceDTO {
  return {
    tracks: [...mockPieceState.tracks],
    lanes: [...mockPieceState.lanes],
    takes: [...mockPieceState.takes],
  };
}

export function listMockSongsByCategory(categoryId: number): Song[] {
  return mockSongs.filter((song) => song.categoryId === categoryId);
}

export function getMockSongRecordingsById(): PieceDTO {
  return clonePiece();
}

export function createMockLane(trackId: number): Lane {
  const siblings = mockPieceState.lanes
    .filter((lane) => lane.trackId === trackId)
    .sort((a, b) => a.order - b.order);
  const order = siblings.length + 1;
  const newLane: Lane = {
    id: trackId * 100 + order,
    trackId,
    description: `Lane ${order}`,
    order,
  };

  mockPieceState.lanes.push(newLane);

  return newLane;
}
