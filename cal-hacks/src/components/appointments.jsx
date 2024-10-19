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
    background-color: #f5f7fa;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
    color: #333;
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
  background-color: white;
  padding: 20px;
  border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TranscribeBox = styled.div`
    flex: 0 0 300px;
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    height: fit-content;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TranscribeButton = styled.button`
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #3a7bd5;
    }
`;

const Option = styled.button`
    background-color: transparent;
    border: none;
    font-size: 20px;
    color: ${(props) => (props.active ? "purple" : "gray")};
    position: relative;
    transition: color 0.2s;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px; /* Adjust as needed */
        width: ${(props) => (props.active ? "100%" : "0")};
        height: 2px; /* Adjust as needed */
        background-color: purple;
        transition: width 0.2s;
    }

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
    margin-top: 10px;
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