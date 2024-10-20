import React, { useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Mic, Search, Calendar, Clock, MapPin, FileText } from "lucide-react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Link } from "react-router-dom";
import Gemini from "./Gemini";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #f5f7fa;
  }
`;

const PageContainer = styled.div`
  font-family: "Arial", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4% 20px;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 24px;
  padding: 10px 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  input {
    border: none;
    outline: none;
    font-size: 16px;
    width: 100%;
    margin-left: 10px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 30px;
`;

const AppointmentList = styled.div`
  flex: 1;
`;

const AppointmentCard = styled(Link)`
  background-color: white;
  width: 90%;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;
  display: block;

  &:hover {
    transform: translateY(-5px);
  }
`;

const AppointmentTitle = styled.h2`
  font-size: 20px;
  color: #4a90e2;
  margin-bottom: 10px;
`;

const AppointmentDetail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: #666;

  svg {
    margin-right: 10px;
  }
`;

const TranscribeBox = styled.div`
  flex: 0 0 300px;
  background-color: white;
  border-radius: 8px;
  padding: 20px 20px 20px 15px;
  height: 550px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: -50px; /* Adjust this value as needed */
`;

const TranscribeButton = styled.button`
  background-color: rgb(74, 144, 226);
  color: white;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  border-radius: 50%;
  margin: 15px auto;
  margin-top: 400px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3a7bd5;
  }
`;

const ReportAndTalk = () => {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const deepgram = createClient("55e40a026dc89525f4d2b118ffecd3c674837953");
  const [fulltranscript, setFullTranscript] = useState("");

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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "en-US",
        smart_format: true,
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("Connection opened");

        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
          const newTranscript = data.channel.alternatives[0].transcript;
          setFullTranscript(
            (prevTranscript) => prevTranscript + " " + newTranscript
          );
        });

        connection.on(LiveTranscriptionEvents.Error, (err) => {
          console.error(err);
        });
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          connection.send(event.data);
        }
      };

      mediaRecorderRef.current.start(250);
      setRecording(true);
    } catch (error) {
      console.error(
        "Error accessing microphone or Deepgram connection:",
        error
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setRecording(false);
    }
    Gemini(fulltranscript);
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Title>My Transcripts</Title>
        <SearchBar>
          <Search size={20} color="#666" />
          <input type="text" placeholder="Search" />
        </SearchBar>
        <ContentContainer>
          <AppointmentList>
            {[1, 2, 3].map((num) => (
              <AppointmentCard key={num} to={`/appointments`}>
                <AppointmentTitle>Appointment {num}</AppointmentTitle>
                <AppointmentDetail>
                  <Calendar size={16} />
                  {num === 1
                    ? "Jan 18, 2024"
                    : num === 2
                    ? "May 19, 2024"
                    : "Oct 18, 2024"}
                </AppointmentDetail>
                <AppointmentDetail>
                  <Clock size={16} />
                  {num === 1 ? "12:00 PM" : num === 2 ? "1:00 PM" : "2:00 PM"}
                </AppointmentDetail>
                <AppointmentDetail>
                  <MapPin size={16} />
                  UCLA Hospital
                </AppointmentDetail>
                <AppointmentDetail>
                  <FileText size={16} />
                  Reason:{" "}
                  {num === 1
                    ? "Abdominal Pain"
                    : num === 2
                    ? "Persistent Cough"
                    : "Severe Headaches"}
                </AppointmentDetail>
              </AppointmentCard>
            ))}
          </AppointmentList>
          <TranscribeBox>
            <p>
              Press the button to start transcribing your doctor appointments!
            </p>
            <TranscribeButton onClick={toggleRecording}>
              <Mic size={24} color="white" />
            </TranscribeButton>
            <p>Transcribe</p>
          </TranscribeBox>
        </ContentContainer>
      </PageContainer>
    </>
  );
};

export default ReportAndTalk;
