/**
 * TimeBase represents a unified time reference (in seconds) for the app.
 *
 * Key idea:
 * - The recorder (MediaRecorder) MUST NOT depend on any specific video provider.
 * - Instead, recording/timeline logic depends on this minimal interface.
 *
 * Implementations:
 * - YouTubeTimeBase: backed by YT.Player.getCurrentTime()
 * - Other video providers: implement nowSec/seekTo/play/pause as needed
 * - NoVideoTimeBase: a fallback clock based on performance.now()
 */
export type TimeBase = {
  /**
   * Returns the current reference time in seconds.
   * For YouTube, this maps to the current playback time on the video timeline.
   */
  nowSec: () => number;

  /** Optional playback controls if the underlying provider supports them. */
  play: () => void;
  pause: () => void;

  /**
   * Optional seek control.
   * Implementations should seek the provider to the given time in seconds.
   */
  seekTo: (sec: number) => void;

  /** Optional readiness check (e.g., YouTube player is initialized). */
  isReady: () => boolean;
};
