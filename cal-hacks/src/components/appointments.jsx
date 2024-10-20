import React, { useEffect } from "react";
import styled from "styled-components";
import { Mic } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import SpeechAI from "./SpeechAI";

import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";



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
  background-color: #d9d9d9;
  padding: 20px;
  border-radius: 4px;
  height: 496px;
  width: 92%;
`;

const TranscribeBox = styled.div`
  flex: 0 0 300px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  height: 550px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: -10px;
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

const Option = styled.button`
  background-color: transparent;
  border: none;
  font-size: 20px;
  color: ${(props) => (props.active ? "purple" : "gray")};
  position: relative;
  transition: color 0.2s;

  &::after {
    content: "";
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
  font-size: 17.5px;
  color: gray;
`;

const Selection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 10px;
`;

const Appointment = () => {

    const [transcript, setTranscript] = useState(false);
    const [summary, setSummary] = useState(true);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false); // Recording state
    const deepgram = createClient("55e40a026dc89525f4d2b118ffecd3c674837953");
    const [fulltranscript, setFullTranscript] = useState("");
    const { id } = useParams();
    const [jsonGemini, setJsonGemini] = useState("");
    const [transcriptText, setTranscriptText] = useState("");
    const [activeTab, setActiveTab] = useState("summary");
    const [appointmentData, setAppointmentData] = useState(null);



    console.log("ID from params:", id);

    // Initialize Firebase
    // const app = initializeApp(firebaseConfig);
    // const db = getFirestore(app);

    // //get the doc nad data values ot dispaly
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const docRef = doc(db, 'record_history', id); // Replace with your collection name
    //             const docSnap = await getDoc(docRef);
                
    //             if (docSnap.exists()) {
    //                 const invalidJsonString = docSnap.data().geminiResult;
    //                 // Replace single quotes with double quotes and add double quotes around keys
    //                 // const validJsonString = invalidJsonString
    //                 //     .replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":') // Add quotes around keys
    //                 //     .replace(/'/g, '"'); // Replace single quotes with double quotes
    //                 // console.log("valid json string: ", validJsonString);
    //                 setJsonGemini(JSON.parse(invalidJsonString));
    //                 setTranscriptText(docSnap.data().transcript);
    //             } else {
    //                 console.log("No such document!");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching document:", error);
    //         }
    //     };
    
    //     fetchData(); // Call the async function
    
    //     // Optionally, you can return a cleanup function if needed
    // }, [id]); // Ensure to add `id` to the dependencies if it changes
    

    // const startRecording = async () => {
    //     try {
    //         // Get audio stream from user's microphone
    //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //         mediaRecorderRef.current = new MediaRecorder(stream);

    //         // Create a live transcription connection
    //         const connection = deepgram.listen.live({
    //             model: "nova-2",
    //             language: "en-US",
    //             smart_format: true,
    //         });

    //         // Listen for transcription events
    //         connection.on(LiveTranscriptionEvents.Open, () => {
    //             console.log("Connection opened");

    //             connection.on(LiveTranscriptionEvents.Transcript, (data) => {
    //                 const newTranscript = data.channel.alternatives[0].transcript; // Get the new transcript
    //                 setFullTranscript(
    //                     (prevTranscript) => prevTranscript + " " + newTranscript
    //                 );
    //             });
    //             // console.log(fulltranscript);

    //             connection.on(LiveTranscriptionEvents.Error, (err) => {
    //                 console.error(err);
    //             });
    //         });

    //         // When data is available, send it to Deepgram
    //         mediaRecorderRef.current.ondataavailable = (event) => {
    //             if (event.data.size > 0) {
    //                 connection.send(event.data); // Send the audio data
    //             }
    //         };

    //         // Start recording
    //         mediaRecorderRef.current.start(250); // Send audio every 250 ms
    //         setRecording(true); // Update state to indicate recording has started
    //     } catch (error) {
    //         console.error(
    //             "Error accessing microphone or Deepgram connection:",
    //             error
    //         );
    //     }
    // };

    // const stopRecording = () => {
    //     if (mediaRecorderRef.current) {
    //         mediaRecorderRef.current.stop(); // Stop the recording
    //         mediaRecorderRef.current.stream
    //             .getTracks()
    //             .forEach((track) => track.stop()); // Stop all audio tracks
    //         setRecording(false); // Update state to indicate recording has stopped
    //     }
    // };

//set the data in firestore
useEffect(() => {
    const fetchData = async () => {
        console.log("Fetching data from Firestore...");
        try {
            const docRef = doc(db, 'record_history', id); // Adjust collection name as needed
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document snapshot exists");
                const geminiResult = docSnap.data().geminiResult; // Get the geminiResult directly

                setAppointmentData(docSnap.data());
                if (typeof geminiResult === 'string') {
                    // Only parse if it's a string
                    try {
                        console.log("geminiResult before parsing:", geminiResult);
                        const parsedJson = JSON.parse(geminiResult);
                        console.log("Parsed JSON:", parsedJson);
                        
                        setJsonGemini(parsedJson);
                    } catch (parseError) {
                        console.error("Error parsing JSON:", parseError);
                        setJsonGemini(null); // Handle the error gracefully
                        console.error("Original string:", geminiResult);
                    }
                } else {
                    // If it's already an object, set it directly
                    setJsonGemini(geminiResult);
                }
                

                // Do not set the transcript here
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    };

    fetchData(); // Call the async function
}, [db, id]);


    // //grab the data for this id
    // useEffect(() => {
    //     const fetchAppointment = async () => {
    //         console.log("ID from params:", id);
    //         try {
    //             const docRef = doc(db, 'appointments', id);
    //             const docSnap = await getDoc(docRef);
                
    //             if (docSnap.exists()) {
    //                 console.log('Document data:', docSnap.data());
    //                 setAppointmentData(docSnap.data());
    //             } else {
    //                 console.error('No such document!');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching appointment:', error);
    //         }
    //     };

    //     fetchAppointment();
    // }, [id]);

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
            <Title>{appointmentData?.title  || 'na'}</Title>
            <Date>{appointmentData?.timestamp?.toDate().toLocaleString() || 'na'}</Date>
            <AppointmentAndTranscribeContainer>
                <AppointmentList>
                    <Selection>
                        <Option 
                            style={{ width: "30%" }} 
                            active={activeTab === "summary"}
                            onClick={() => setActiveTab("summary")}
                        >
                            Summary
                        </Option>
                        <Option 
                            style={{ width: "30%" }} 
                            active={activeTab === "transcript"}
                            onClick={() => setActiveTab("transcript")}
                        >
                            Transcript
                        </Option>
                    </Selection>
                    
                    <AppointmentItem>
                        {activeTab === "summary" ? (
                            <>
                                <h3>Main Complaint:</h3>
                                <p>{}</p>
                                <p>{appointmentData?.geminiResult?.main_complaint || "N/A"}</p>
                                
                                <h3>General Summary:</h3>
                                <p>{appointmentData?.geminiResult?.summary || "N/A"}</p>
                                <p></p>

                                

                                <h3>Prescriptions:</h3>
                                <p>{appointmentData?.geminiResult?.prescriptions || "N/A"}</p>
                                <p></p>

                            </>
                        ) : (
                            <>
                                <h3>Transcript:</h3>
                                
                                <p>{appointmentData?.transcript || "N/A"}</p>
                            </>
                        )}
                    </AppointmentItem>
                </AppointmentList>
                

                <TranscribeBox>
                  <p>Press the button to start transcribing your doctor appointments!</p>
                  <SpeechAI/>
                </TranscribeBox>

            </AppointmentAndTranscribeContainer>
        </MainColumn>
    </ContentContainer>
</PageContainer>
    );
};

export default Appointment;
