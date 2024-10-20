import React from "react";
import styled from "styled-components";
import { Mic } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import SpeechAI from "./SpeechAI";

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

    const handleTranscript = () => {
        setTranscript(true);
        setSummary(false);
    };
    const handleSummary = () => {
        setTranscript(false);
        setSummary(true);
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
                            <SpeechAI/>
                        </TranscribeBox>
                    </AppointmentAndTranscribeContainer>
                </MainColumn>
            </ContentContainer>
        </PageContainer>
    );
};

export default Appointment;