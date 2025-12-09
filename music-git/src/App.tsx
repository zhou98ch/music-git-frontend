// src/App.tsx

import {mockTakes} from "./common/types";
import { BilibiliPlayer } from "./components/BilibiliPlayer";
import { PieceTimeline } from "./components/PieceTimeline";
import { YouTubePlayerWithInput } from "./components/YoutubePlayerWithInput";
import { groupTakesByTrack } from "./utils/helpers";
function App() {
  const mockTotalDurationSec = 120; 
  const mockSongName = "Demo Song";
  const tracks = groupTakesByTrack(mockTakes);
  console.log("Grouped Takes by Track:", tracks);
  return (
    <>
        <div style={{ padding: 20 }}>
          <BilibiliPlayer bvid="BV1Xx411c7mD" />
        </div>
        <div style={{ padding: 20 }}>
          <YouTubePlayerWithInput />
        </div>
        <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
          <h1>Recording Git - Full Song Timeline</h1>
          <p>The song "{mockSongName}" lasts 0s → {mockTotalDurationSec}s，all Takes are arranged by time order。</p>
          <PieceTimeline totalDurationSec = {mockTotalDurationSec} tracks={tracks}/>
        </div>
    </>

  );
}

export default App;
