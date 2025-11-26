// src/App.tsx

import {mockTakes} from "./common/types";
import { TrackView } from "./components/TrackView";
function App() {
  const totalDurationSec = 120; 
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Recording Git - Full Song Timeline</h1>
      <p>The song lasts 0s → {totalDurationSec}s，all Takes are arranged by time order。</p>

      {/* <FullTimeline totalDurationSec={totalDurationSec} takes={mockTakes} /> */}
      <TrackView trackId="1" date="11-24" takes= {mockTakes} totalDurationSec={totalDurationSec}></TrackView>
    </div>
  );
}

export default App;
