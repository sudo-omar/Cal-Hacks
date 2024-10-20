import React, { useEffect } from "react";
import styled from "styled-components";
import { Mic, Search, Calendar, Clock, MapPin, FileText } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Link } from "react-router-dom";
import Gemini from "./Gemini";

import {
    addDoc,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
} from 'firebase/firestore'
    ;
import Appointment from './appointments'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppNavBar from "./AppNavBar";

const PageContainer = styled.div`
    font-family: 'Arial', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 4% 20px;
    background-color: #f5f7fa;
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

const AppointmentCard = styled.div`
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;

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

const ReportAndTalk = () => {
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const deepgram = createClient('55e40a026dc89525f4d2b118ffecd3c674837953');
    const [fulltranscript, setFullTranscript] = useState('');
    const [isSendingDataToGemi, setIsSendingDataToGemi] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const[appointmentNum, setAppointmentNum] = useState(1);

    const firebaseConfig = {
        apiKey: 'AIzaSyBqKvxFvmwfr_u2Bq9uS-qg-NGNGKkeCF0',
        authDomain: 'medicai-2ab57.firebaseapp.com',
        projectId: 'medicai-2ab57',
        storageBucket: 'medicai-2ab57.appspot.com',
        messagingSenderId: '1010875331468',
        appId: '1:1010875331468:web:bed2564ccd919dd72edca9',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const ids = await fetchDocumentIds();
        // Now fetch the appointments using the retrieved IDs
        if (ids.length > 0) {
            const fetchPromises = ids.map(async (id) => {
                const docRef = doc(db, 'record_history', id);
                const docSnap = await getDoc(docRef);
                return docSnap.exists() ? { id, ...docSnap.data() } : null;
            });

            const fetchedAppointments = await Promise.all(fetchPromises);
            setAppointments(fetchedAppointments.filter((app) => app));
        }
    };

    const fetchDocumentIds = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'record_history')); // Your collection name
            const ids = querySnapshot.docs.map((doc) => doc.id); // Extracting document IDs
            return ids; // Return the array of IDs
        } catch (error) {
            console.error('Error fetching document IDs:', error);
            return []; // Return an empty array on error
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            const connection = deepgram.listen.live({
                model: 'nova-2',
                language: 'en-US',
                smart_format: true,
            });

            connection.on(LiveTranscriptionEvents.Open, () => {
                console.log('Connection opened');

                connection.on(LiveTranscriptionEvents.Transcript, (data) => {
                    const newTranscript = data.channel.alternatives[0].transcript;
                    setFullTranscript(
                        (prevTranscript) => prevTranscript + ' ' + newTranscript
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
                'Error accessing microphone or Deepgram connection:',
                error
            );
        }
    };

    const stopRecording = async () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream
                .getTracks()
                .forEach((track) => track.stop());
            setRecording(false);
        }

        const gemini_response = await Gemini(fulltranscript);
        console.log('gemi response: ' + gemini_response);

        let parsedResponse;
        if (typeof gemini_response === 'string') {
            try {
                parsedResponse = JSON.parse(gemini_response);
                console.log('parsed response: ' + parsedResponse);
            } catch (error) {
                console.log('Error parsing Gemini response:');
                return; // Exit the function if parsing fails
            }
        } else {
            parsedResponse = gemini_response;
        }

        console.log(`Gemini response:`, parsedResponse);

        await addDoc(collection(db, 'record_history'), {
            transcript: fulltranscript,
            geminiResult: parsedResponse,
            timestamp: new Date(),
            title: 'Appointment ' + appointmentNum,
        });

        setAppointmentNum(appointmentNum + 1);
        setFullTranscript('');
        setIsSendingDataToGemi(true);
        fetchAppointments();
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
            <AppNavBar />
      <PageContainer>
          <Title>My Transcripts</Title>
          <SearchBar>
              <Search size={20} color="#666" />
              <input type="text" placeholder="Search" />
          </SearchBar>
          <ContentContainer>
              <AppointmentList>
                  {appointments.map((appointment) => (
                      <AppointmentCard key={appointment.id}>
                          <Link to={`/appointments/${appointment.id}`}>
                          <AppointmentTitle>
                              {appointment.title || 'Appointment'}
                          </AppointmentTitle>
                          </Link>
                          <AppointmentDetail>
                              <Calendar size={16} />
                              Date &#38; Time: {appointment.timestamp ? appointment.timestamp.toDate().toLocaleString() : 'N/A'}
                              </AppointmentDetail>
                          <AppointmentDetail>
                              <FileText size={16} />
                              Reason for Appointment: {appointment.geminiResult.main_complaint || 'N/A'}
                          </AppointmentDetail>
                      </AppointmentCard>
                  ))}
              </AppointmentList>
              <TranscribeBox>
                  <p>Press the button to start transcribing your doctor appointments!</p>
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
