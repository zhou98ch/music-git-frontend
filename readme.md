**The goal is to make music practice easier to review, and progress easier to notice.**
# music-git

music-git is an experimental tool for recording and reviewing instrument practice,  **inspired by Git**.

When practicing an instrument, people often play along with something:
the original recording, a performance video, or a video with scrolling notation.
In practice, musicians usually repeat **small sections** of a piece again and again,
trying to improve a few bars at a time.

music-git helps record these practice attempts in a simple and structured way.
It records **microphone audio only**, while using a video (currently YouTube)
as a shared timeline.
Each recording is aligned to the same video time,
making it easy to look back, compare different attempts,
and see how your practice has evolved over time.

The idea is similar to Git:
each practice attempt is a new “take”/("commit") of a specific section. History recording can be tracked,
and the latest version can be easily compared with previous attempts.
So progress and effort are not lost, but clearly visible.

# To run the application
``` 
cd music-git
npm install
npm run dev
```
# Current Status

 - [x] MediaRecorder-based microphone recording

 - [x] Promise-based stop flow (awaitable recording finalization)

 - [x] YouTube IFrame Player integration

 - [x] TimeBase abstraction and adapter

 - [x] Git-like data model (Track / Lane / Take)

 - [ ] Timeline playback synchronization

 - [ ] Persistent storage / backend

- [ ]  Practice analytics and comparison tools
- [ ]  Deployment on web server


# Design Ideas
## Recording Flow in the AudioRecorder Component
```
UI / User          stopRecording()            MediaRecorder
--------------------------------------------------------------
Click Stop  ───▶  stopRecording()
                   - create Promise
                   - save resolve
                   - recorder.stop()  ───▶   recorder.stop()

await stopRecording()
(waiting...)                              Browser flushes data
                                          onstop fires
                                          onstop handler:
                                           - create Blob
                                           - create URL
                                           - resolve({blob, url})
                           ◀──────────── Promise resolved

const { blob, url } = result
```

## Audio–Video Time Alignment (TimeBase)

This project records microphone audio while using a video (currently YouTube) as the **single source of truth** for time reference (because the recording must timely align with the background video).
To keep the recorder reusable and future-proof (e.g. switching video providers or even running without video), the codebase separates concerns into two layers:

### 1) TimeBase (time reference)
`TimeBase` is a small interface that represents a **time reference** in seconds.

- `nowSec()` returns the current reference time (seconds).
- Optional controls (`play/pause/seekTo`) are provided when available.

The recorder never depends on YouTube-specific APIs. Instead, it only depends on `TimeBase`.

### 2) YouTubePlayer adapter → TimeBase
The `YouTubePlayer` component encapsulates all YouTube IFrame API details:
- loading the YouTube IFrame API script
- creating and destroying the `YT.Player` instance
- exposing a stable, minimal `TimeBase` API to the rest of the app

When the YouTube player becomes ready, `YouTubePlayer` calls `onTimeBaseReady(tb)` and provides a `TimeBase` implementation:
- `tb.nowSec()` delegates to `player.getCurrentTime()`
- `tb.seekTo()` delegates to `player.seekTo(...)`
- `tb.play()/pause()` delegates to `player.playVideo()/pauseVideo()`

### Why this design?
- **Decoupling**: recording logic does not know (or care) whether the time comes from YouTube, another provider, or no video at all.
- **Testability**: a mock `TimeBase` can drive deterministic tests.
- **Extensibility**: adding another provider means implementing `TimeBase`, without rewriting the recorder.

### Recording flow (high-level)
1. On "Record": capture `startSec = timeBase.nowSec()` and start `MediaRecorder`.
2. On "Stop": capture `endSec = timeBase.nowSec()`, stop `MediaRecorder` (await final blob), then create a `Take { startSec, endSec, ... }`.
3. Takes are rendered on the timeline using `startSec/endSec` aligned to the same video timeline.
