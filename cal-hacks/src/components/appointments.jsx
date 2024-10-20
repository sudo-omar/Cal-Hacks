import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import SpeechAI from "./SpeechAI";

import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import AppNavBar from "./AppNavBar";

const PageContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 8% 20px;
    background-color: white;
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
    const [transcript, setTranscript] = useState(false);
    const [summary, setSummary] = useState(true);
    const { id } = useParams();
    const [jsonGemini, setJsonGemini] = useState("");
    const [activeTab, setActiveTab] = useState("summary");
    const [appointmentData, setAppointmentData] = useState(null);

    console.log("ID from params:", id);

    const handleTranscript = () => {
        setTranscript(true);
        setSummary(false);
        setActiveTab("transcript");
    };
    const handleSummary = () => {
        setTranscript(false);
        setSummary(true);
        setActiveTab("summary");
    };

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

    return (
        <>
            <AppNavBar/>
        <PageContainer>
            <ContentContainer>
                <MainColumn>
                    <Title>{appointmentData?.title  || 'na'}</Title>
                    <Date>{appointmentData?.timestamp?.toDate().toLocaleString() || 'na'}</Date>
                    <AppointmentAndTranscribeContainer>
                        <AppointmentList>
                            <Selection>
                                <Option style={{ width: 30 + "%" }} onClick={handleSummary} active={summary}>Summary</Option>
                                <Option style={{ width: 30 + "%" }} onClick={handleTranscript} active={transcript}>Transcript</Option>
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
        </>
    );
};

export default Appointment;