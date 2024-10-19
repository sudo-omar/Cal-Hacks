import React from "react";
import styled from "styled-components";
import { Mic } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const PageContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 8% 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const MainColumn = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 32px;
    margin: 0;
`;

const AppointmentAndTranscribeContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const AppointmentList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AppointmentItem = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 4px;
`;

const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AppointmentTitle = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const TranscribeBox = styled.div`
  flex: 0 0 300px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  height: fit-content;
  text-align: center;
`;

const TranscribeButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  cursor: pointer;
`;

const Option = styled.button`
    background-color: transparent;
    border: none;
    color: ${(props) => (props.active ? "purple" : "gray")};
    &:active {
        color: purple;
    }
`;

const Date = styled.p`
    font-size: 12px;
    color: gray;
`;

const Selection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`;

const Appointment = () => {
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false); // Recording state
    const deepgram = createClient("55e40a026dc89525f4d2b118ffecd3c674837953");
    const [fulltranscript, setFullTranscript] = useState("");
    const [transcript, setTranscript] = useState(false);
    const [summary, setSummary] = useState(true);

    const handleTranscript = () => {
        setTranscript(true);
        setSummary(false);
    };
    const handleSummary = () => {
        setTranscript(false);
        setSummary(true);
    };

    const firebaseConfig = {
        apiKey: "AIzaSyBqKvxFvmwfr_u2Bq9uS-qg-NGNGKkeCF0",
        authDomain: "medicai-2ab57.firebaseapp.com",
        projectId: "medicai-2ab57",
        storageBucket: "medicai-2ab57.appspot.com",
        messagingSenderId: "1010875331468",
        appId: "1:1010875331468:web:bed2564ccd919dd72edca9",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const startRecording = async () => {
        try {
            // Get audio stream from user's microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            // Create a live transcription connection
            const connection = deepgram.listen.live({
                model: "nova-2",
                language: "en-US",
                smart_format: true,
            });

            // Listen for transcription events
            connection.on(LiveTranscriptionEvents.Open, () => {
                console.log("Connection opened");

                connection.on(LiveTranscriptionEvents.Transcript, (data) => {
                    const newTranscript = data.channel.alternatives[0].transcript; // Get the new transcript
                    setFullTranscript(
                        (prevTranscript) => prevTranscript + " " + newTranscript
                    );
                });
                console.log(fulltranscript);

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
            console.error(
                "Error accessing microphone or Deepgram connection:",
                error
            );
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop(); // Stop the recording
            mediaRecorderRef.current.stream
                .getTracks()
                .forEach((track) => track.stop()); // Stop all audio tracks
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
        <PageContainer>
            <ContentContainer>
                <MainColumn>
                    <Title>Appointment 1</Title>
                    <Date>Oct 18, 2024 12:00 PM</Date>
                    <AppointmentAndTranscribeContainer>
                        <AppointmentList>
                            <Selection>
                                <Option style={{ width: 30 + "%" }} onClick={handleSummary} active={summary}>Summary</Option>
                                <Option style={{ width: 30 + "%" }} onClick={handleTranscript} active={transcript}>Transcript</Option>
                            </Selection>
                            <AppointmentItem>
                                {summary && <><p>serverSummary</p></>}
                                {transcript && <><p>serverTranscript</p></>}
                            </AppointmentItem>
                        </AppointmentList>
                        <TranscribeBox>
                            <p>Press the button to start transcribing your doctor appointments!</p>
                            {fulltranscript}
                            <TranscribeButton onClick={toggleRecording}>
                                <Mic size={24} />
                            </TranscribeButton>
                            <p>Transcribe</p>
                        </TranscribeBox>
                    </AppointmentAndTranscribeContainer>
                </MainColumn>
            </ContentContainer>
        </PageContainer>
    );
};

export default Appointment;