# To run the application
``` 
cd music-git
npm install
npm run dev
```

# Recording Flow in the AudioRecorder Component
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