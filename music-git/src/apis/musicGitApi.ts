import type { Take,Track,Lane } from "../common/types";

type ApiConfig = {
  baseUrl: string; 
};

function createJsonClient(config: ApiConfig) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${config.baseUrl}${path}`, {
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

export function createMusicGitApi(config: ApiConfig) {
    return {};
}
