import React, { useState, useRef } from 'react'; 

const ScreenRecorder = () => { 
const mediaRecorderRef = useRef(null); 
const [recording, setRecording] = useState(false); 
const [recordedChunks, setRecordedChunks] = useState([]); 

const startRecording = async () => { 
try { 
// Request screen recording permission from the user 
const stream = await navigator.mediaDevices.getDisplayMedia({ video: { 
cursor: "always" }, // Capture video and show the cursor 
audio: true, // Capture audio as well 
}); 
mediaRecorderRef.current = new MediaRecorder(stream, { 
mimeType: 'video/webm; codecs=vp9', // High-quality video codec 
videoBitsPerSecond: 2500000, // Set higher bitrate for better quality 
}); 
mediaRecorderRef.current.ondataavailable = handleDataAvailable; 
mediaRecorderRef.current.start(); 
setRecording(true); 
} 
catch (err) { 
console.error("Error: " + err); 
} 
}; 

const stopRecording = () => { 
mediaRecorderRef.current.stop(); setRecording(false); 
}; 

const handleDataAvailable = (event) => { 
if (event.data.size > 0) { 
setRecordedChunks((prev) => prev.concat(event.data)); 
} 
}; 

const downloadRecording = () => { 
const blob = new Blob(recordedChunks, { type: 'video/webm', }); 
const url = URL.createObjectURL(blob); 
const a = document.createElement('a'); 
a.style.display = 'none'; 
a.href = url; 
a.download = 'screen_recording.webm'; 
document.body.appendChild(a); 
a.click(); 
window.URL.revokeObjectURL(url); 
}; 

const handleKeyDown = (event) => { 
if (event.key === 'Enter' || event.key === ' ') { 
if (recording) { stopRecording(); 
} 
else { 
startRecording(); 
} 
} 
}; 

return ( 
<div> 
<div> 
{recording ? ( 
<button onClick={stopRecording} onKeyDown={handleKeyDown} aria-pressed="true" aria-label="Stop screen recording" > Stop Recording </button> 
) : ( 
<button onClick={startRecording} onKeyDown={handleKeyDown} aria-pressed="false" aria-label="Start screen recording" > Start Recording </button> 
)} 
{recordedChunks.length > 0 && ( 
<button onClick={downloadRecording} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { downloadRecording(); } }} aria-label="Download screen recording" > Download </button> 
)} 
</div> 
</div> 
); 
}; 

export default ScreenRecorder;
