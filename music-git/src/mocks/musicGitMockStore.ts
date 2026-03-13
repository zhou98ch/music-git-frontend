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
      id: "2026-03-12",
      date: "2026-03-12",
      laneIds: ["lane-2026-03-12-1", "lane-2026-03-12-2"],
      description: "Yesterday practice",
    },
    {
      id: "2026-03-13",
      date: "2026-03-13",
      laneIds: ["lane-2026-03-13-1", "lane-2026-03-13-2"],
      description: "Today practice",
    },
  ],
  lanes: [
    {
      id: "lane-2026-03-12-1",
      trackId: "2026-03-12",
      description: "Main vocal",
      order: 1,
    },
    {
      id: "lane-2026-03-12-2",
      trackId: "2026-03-12",
      description: "Harmony",
      order: 2,
    },
    {
      id: "lane-2026-03-13-1",
      trackId: "2026-03-13",
      description: "Lead take",
      order: 1,
    },
    {
      id: "lane-2026-03-13-2",
      trackId: "2026-03-13",
      description: "Alt phrasing",
      order: 2,
    },
  ],
  takes: [
    {
      id: "mock-take-1",
      trackId: "2026-03-12",
      laneId: "lane-2026-03-12-1",
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
      trackId: "2026-03-12",
      laneId: "lane-2026-03-12-2",
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
      trackId: "2026-03-13",
      laneId: "lane-2026-03-13-1",
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

export function createMockLane(trackId: string): Lane {
  const siblings = mockPieceState.lanes
    .filter((lane) => lane.trackId === trackId)
    .sort((a, b) => a.order - b.order);
  const order = siblings.length + 1;
  const newLane: Lane = {
    id: `lane-${trackId}-${order}`,
    trackId,
    description: `Lane ${order}`,
    order,
  };

  mockPieceState.lanes.push(newLane);

  const track = mockPieceState.tracks.find((item) => item.id === trackId);
  if (track) {
    track.laneIds = [...track.laneIds, newLane.id];
  }

  return newLane;
}
