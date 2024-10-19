import React from "react";
import styled from "styled-components";
import { Search, Mic } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';


const PageContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
`;

const IconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
  background-color: #000;
  margin-right: 10px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 8px 16px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
`;

const ProfilePic = styled.div`
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 50%;
  margin-left: 10px;
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
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 34%;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  flex-grow: 1;
  font-size: 16px;
  margin-left: 10px;
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

const ReportAndTalk = () => {

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
    <PageContainer>
      <Header>
        <Logo>
          <IconPlaceholder />
          MedicAI
        </Logo>
        <Nav>
          <NavButton>My Transcripts</NavButton>
          <ProfilePic />
        </Nav>
      </Header>

      <ContentContainer>
        <MainColumn>
          <Title>My Transcripts</Title>

          <SearchBar>
            <Search size={20} />
            <SearchInput placeholder="Search" />
          </SearchBar>

          <AppointmentAndTranscribeContainer>
            <AppointmentList>
              <AppointmentItem>
                <AppointmentHeader>
                  <AppointmentTitle>
                    Appointment 1 Oct 18, 2024 12:00 PM
                  </AppointmentTitle>
                </AppointmentHeader>
              </AppointmentItem>
              <AppointmentItem>
                <AppointmentHeader>
                  <AppointmentTitle>
                    Appointment 2 Oct 18, 2024 12:01 PM
                  </AppointmentTitle>
                </AppointmentHeader>
              </AppointmentItem>
              <AppointmentItem>
                <AppointmentHeader>
                  <AppointmentTitle>
                    Appointment 3 Oct 18, 2024 12:02 PM
                  </AppointmentTitle>
                </AppointmentHeader>
              </AppointmentItem>
            </AppointmentList>

            <TranscribeBox>
              <p>
                Press the button to start transcribing your doctor appointments!
              </p>
             
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

export default ReportAndTalk;
