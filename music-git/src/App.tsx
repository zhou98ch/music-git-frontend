// src/App.tsx

// import {mockTakes} from "./common/types";

import { YouTubePlayerWithInput } from "./components/YoutubePlayerWithInput";
function App() {
  const mockTotalDurationSec = 120; 
  const mockSongName = "Demo Song";
  // const tracks = groupTakesByTrack(mockTakes);
  // console.log("Grouped Takes by Track:", tracks);
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
        </div>
    </>

  );
}

export default App;
