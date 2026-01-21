import type { Take, Track, Lane } from "../common/types";

type ApiConfig = {
  baseUrl?: string;
};

function createJsonClient() {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      throw new Error("Missing VITE_API_BASE_URL");
    }

    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;

    return (await res.json()) as T;
  }

  return { request };
}

type PieceDTO = {
  tracks: Track[];
  lanes: Lane[];
  takes: Take[];
};

export function createMusicGitApi() {
  const client = createJsonClient();

  return {
    getPieceRecordingsById: (pieceId: string) =>
      client.request<PieceDTO>(`/pieces/${pieceId}`),

    createLane: (trackId: string) =>
      client.request<Lane>(`/tracks/${trackId}/lanes`, {
        method: "POST",
      }),
  };
}
