// src/App.tsx

import {mockTakes} from "./common/types";
import { PieceTimeline } from "./components/PieceTimeline";
import { TrackView } from "./components/TrackView";
import { groupTakesByTrack } from "./utils/helpers";
function App() {
  const mockTotalDurationSec = 120; 
  const mockSongName = "Demo Song";
  const tracks = groupTakesByTrack(mockTakes);
  console.log("Grouped Takes by Track:", tracks);
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Recording Git - Full Song Timeline</h1>
      <p>The song "{mockSongName}" lasts 0s → {mockTotalDurationSec}s，all Takes are arranged by time order。</p>
      <PieceTimeline totalDurationSec = {mockTotalDurationSec} tracks={tracks}/>
    </div>
  );
}

export default App;
