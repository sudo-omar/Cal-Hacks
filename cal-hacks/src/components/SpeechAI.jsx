import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Mic } from "lucide-react";
import { SimliClient } from 'simli-client';
import {useWebSocket} from "./useWebSockets";
import styled from "styled-components";
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {createClient, LiveTranscriptionEvents} from "@deepgram/sdk";

const simli_faceid = "148efaa3-0224-490d-ab77-2a026f4e6738";
const simliClient = new SimliClient();

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

const SpeechAI = () => {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [chatgptText, setChatgptText] = useState('');
    const [startWebRTC, setStartWebRTC] = useState(false);
    const audioContext = useRef(null);
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false); // Recording state
    const deepgram = createClient("55e40a026dc89525f4d2b118ffecd3c674837953");
    const [fulltranscript, setFullTranscript] = useState('');
    const [isStart, setIsStart] = useState(false);

    const { message, isConnected, sendAudioData, startWebSocket } = useWebSocket(process.env.REACT_APP_SERVER_URL, simliClient);

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

    useEffect(() => {
        if (videoRef.current && audioRef.current) {
            const SimliConfig = {
                apiKey: process.env.REACT_APP_SIMLI_API_KEY,
                faceID: simli_faceid,
                handleSilence: true,
                videoRef: videoRef,
                audioRef: audioRef,
                maxSessionLength: 300,
                maxIdleTime: 60,
            };

            simliClient.Initialize(SimliConfig);
            console.log('Simli Client initialized');
        }

        return () => {
            simliClient.close();
        };
    }, [videoRef, audioRef]);

    const handleStart = () => {
        startWebSocket();
        simliClient.on('connected', () => {
            const audioData = new Uint8Array(6000).fill(0);
            simliClient.sendAudioData(audioData);
        });

        simliClient.on('disconnected', (e) => {
            console.log('SimliClient has disconnected!', e);
        });

        simliClient.on('failed', (e) => {
            console.log('SimliClient has failed to connect!', e);
        });

        simliClient.start();
        setStartWebRTC(true);

        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            if (audioContext.current) {
                audioContext.current.close();
            }
        };
    };

    const handleEnd = () => {
        if (simliClient) {
            simliClient.close();
        }

        if (audioRef.current && audioRef.current.srcObject) {
            const audioTracks = audioRef.current.srcObject.getTracks();
            audioTracks.forEach(track => track.stop()); // Stop all audio tracks
        }

        if (videoRef.current && videoRef.current.srcObject) {
            const videoTracks = videoRef.current.srcObject.getTracks();
            videoTracks.forEach(track => track.stop()); // Stop all video tracks
        }

        if (audioContext.current) {
            audioContext.current.close();
            audioContext.current = null;
        }

        setStartWebRTC(false);
    };

    const handleClick = () => {
        if (!isStart) {
            handleStart();
        }
        else {
            handleEnd();
        }
        toggleRecording();
        setIsStart(!isStart);
    };

    return (
        <div className="bg-black w-full h-screen flex flex-col justify-center items-center font-mono text-white">
            <div className="w-[512px] h-screen flex flex-col justify-center items-center gap-4">
                <div className="relative w-full aspect-video">
                    <video ref={videoRef} id="simli_video" autoPlay playsInline className="w-full h-full object-cover"></video>
                    <audio ref={audioRef} id="simli_audio" autoPlay></audio>
                </div>
                {startWebRTC ? (
                    <>
                        <TranscribeButton
                            onClick={handleClick}
                            className="w-full bg-white text-black py-2 px-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                        >
                            <Mic size={24} />
                        </TranscribeButton>
                        <p>{recording ? "Transcribing..." : "Transcribe"}</p>
                    </>
                ) : (
                    <>
                        <TranscribeButton
                            onClick={handleClick}
                            className="w-full bg-white text-black py-2 px-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                        >
                            <Mic size={24} />
                        </TranscribeButton>
                        {fulltranscript && <p>{fulltranscript}</p>}
                        <p>{recording ? "Transcribing..." : "Transcribe"}</p>
                    </>
                )}
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default SpeechAI;