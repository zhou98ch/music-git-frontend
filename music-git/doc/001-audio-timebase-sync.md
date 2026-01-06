# Audio ↔ TimeBase Synchronization  
### Preventing Feedback Loops with `suppressAudioEventsRef`

In **music-git**, a single HTML `<audio>` element is used to play the selected **take**,
while an external **TimeBase** (currently based on user-chosen YouTube) provides the global time reference.

The system must support **bidirectional control**:

- Clicking a take should:
  - seek + play the TimeBase (YouTube)
  - load + play the take audio
- Using the `<audio controls>` (play / pause / seek) should:
- - seek + play the take audio
  - control the TimeBase accordingly in synchronized manner

This introduces a risk of **event feedback loops**.

This document is for future reference, explain the design decision on using **`suppressAudioEventsRef` and `setTimeout(..., 0)`**,
and shows the full event flow.



## The Core Problem

### Explaination
There are **two different sources of playback actions**:

#### 1. User actions
- User clicks ▶ / ⏸ on the `<audio>` controls
- User drags the audio seek bar

#### 2. Programmatic actions
- Clicking a take calls:
  - `audio.src = take.audioUrl`
  - `audio.currentTime = 0`
  - `audio.play()`

However, **HTML media events do not distinguish the source**.

`onPlay`, `onPause`, and `onSeeked` leads to **both user-initiated and code-initiated actions**.

If not handled carefully, this leads to **self-triggering control loops**.

---

### Example of a Feedback Loop (Without Protection)

```
Program calls audio.play()
        ↓
Browser fires <audio onPlay>
        ↓
onPlay handler calls timeBase.play()
        ↓
timeBase.play() was already called → duplicate control
```

## Solution Decision
### Why `suppressAudioEventsRef`

It acts like  a **mutable suppression flag**:

```ts
const suppressAudioEventsRef = useRef(false);
```

When the program controls the `<audio>` element, audio events should **not**
be treated as user intent.

---

### Why `setTimeout(..., 0)`

`audio.play()` does **not** synchronously trigger `onPlay`.

To keep suppression active until browser media events fire, we clear the flag
in the next event loop tick:

```ts
suppressAudioEventsRef.current = true;
audio.play();

setTimeout(() => {
  suppressAudioEventsRef.current = false;
}, 0);
```

## Result
### Event Flow Diagram (With suppression)

```
User clicks Take
      │
      ▼
playTake(take)
      │
      ├─ timeBase.seekTo(take.startSec)
      ├─ timeBase.play()
      │
      ├─ suppress = true
      ├─ audio.play()
      │        │
      │        ▼
      │   <audio onPlay> fires
      │        │
      │        └─ suppressed → ignored
      │
      └─ suppress = false (next tick)
```
