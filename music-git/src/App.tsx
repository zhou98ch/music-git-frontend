// src/App.tsx

import {mockTakes} from "./common/types";
import { AudioRecorder } from "./components/AudioRecorder";
import { BilibiliPlayer } from "./components/BilibiliPlayer";
import { BilibiliPlayerWithInput } from "./components/BilibiliPlayerWithInput";
import { BiliIFrameProbe } from "./components/BiliIFrameProbe";
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
        <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
          <h1>Recording Git - Full Song Timeline</h1>
          <p>The song "{mockSongName}" lasts 0s → {mockTotalDurationSec}s，all Takes are arranged by time order。</p>
          {/* <div style={{ padding: 20 }}> */}
            {/* <BilibiliPlayerWithInput /> */}
            {/* <BiliIFrameProbe src="https://player.bilibili.com/player.html?bvid=BV1xx411c7mD" /> */}
          {/* </div> */}
          <div style={{ padding: 20 }}>
            <YouTubePlayerWithInput />
          </div>
          <PieceTimeline totalDurationSec = {mockTotalDurationSec} tracks={tracks}/>
        </div>
        <div style={{ padding: 20 }}>
          <AudioRecorder />
        </div>
    </>

  );
}

export default App;
