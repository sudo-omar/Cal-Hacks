import React, { useRef, useState } from 'react';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';


const HealthHub = () => {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false); // Recording state
  const deepgram = createClient('55e40a026dc89525f4d2b118ffecd3c674837953'); 

  const startRecording = async () => {
    try {
      // Get audio stream from user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Create a live transcription connection
      const connection = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
      });

      // Listen for transcription events
      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('Connection opened');

        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
          console.log(data.channel.alternatives[0].transcript);
        });

        connection.on(LiveTranscriptionEvents.Error, (err) => {
          console.error(err);
        });
      });

      // When data is available, send it to Deepgram
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          connection.send(event.data); // Send the audio data
        }
      };
        
      // Start recording
      mediaRecorderRef.current.start(250); // Send audio every 250 ms
      setRecording(true); // Update state to indicate recording has started
    } catch (error) {
      console.error('Error accessing microphone or Deepgram connection:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop the recording
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Stop all audio tracks
      setRecording(false); // Update state to indicate recording has stopped
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div>
        <h1>My Transcriptions</h1>

      <button onClick={toggleRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default HealthHub;
