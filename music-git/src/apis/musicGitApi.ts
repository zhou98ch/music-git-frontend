import type { Song, Take, Track, Lane } from "../common/types";

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

type ApiResult<T> = {
  code: number;
  msg?: string;
  data: T;
} & Record<string, unknown>;

type PieceDTO = {
  tracks: Track[];
  lanes: Lane[];
  takes: Take[];
};

function unwrapResult<T>(res: ApiResult<T> | T): T {
  if (res && typeof res === "object" && "data" in res) {
    const apiRes = res as ApiResult<T>;
    if (apiRes.code !== 1) {
      throw new Error(apiRes.msg || "API error");
    }
    return apiRes.data;
  }
  return res as T;
}

export function createMusicGitApi() {
  const client = createJsonClient();

  return {
    getSongRecordingsById: async (songId: string | number) => {
      const res = await client.request<ApiResult<PieceDTO>>(
        `/api/song/${songId}`
      );
      return unwrapResult(res);
    },

    listSongsByCategory: async (categoryId: number) => {
      const res = await client.request<ApiResult<Song[]>>(
        `/api/song/list/${categoryId}`
      );
      return unwrapResult(res);
    },

    createSong: async (payload: Omit<Song, "id">) => {
      const res = await client.request<ApiResult<null>>("/api/song/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return unwrapResult(res);
    },

    updateSong: async (payload: Song) => {
      const res = await client.request<ApiResult<null>>("/api/song/update", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return unwrapResult(res);
    },

    deleteSongById: async (id: number) => {
      const res = await client.request<ApiResult<null>>(`/api/song/delete/${id}`, {
        method: "DELETE",
      });
      return unwrapResult(res);
    },
  };
}
