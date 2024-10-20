import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { SimliClient } from 'simli-client';

const simli_faceid = '95708b15-bcb8-4d40-a4c5-b233778858b4';
const simliClient = new SimliClient();

const SpeechAI = () => {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [chatgptText, setChatgptText] = useState('');
    const [startWebRTC, setStartWebRTC] = useState(false);
    const audioContext = useRef(null);
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    const useWebSocket = (url) => {
        const [message, setMessage] = useState(null);
        const [isConnected, setIsConnected] = useState(false);
        const socketRef = useRef(null);
        const [isRecording, setIsRecording] = useState(false);
        const [mediaRecorder, setMediaRecorder] = useState(null);

        const blobToUint8Array = (blob) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.error) {
                        reject(reader.error);
                    } else {
                        resolve(new Uint8Array(reader.result));
                    }
                };
                reader.readAsArrayBuffer(blob);
            });
        };

        const convertAudio = (audioData) => {
            const audioDataView = new Int16Array(audioData);

            if (audioDataView.length === 0) {
                console.error("Received audio data is empty.");
                return;
            }

            const audioContext = new (window.AudioContext)({ latencyHint: "interactive", sampleRate: 48000 });
            const audioBuffer = audioContext.createBuffer(1, audioDataView.length, 48000);
            const audioBufferChannel = audioBuffer.getChannelData(0);

            for (let i = 0; i < audioDataView.length; i++) {
                audioBufferChannel[i] = audioDataView[i] / 32768;
            }
            return audioBufferChannel;
        };

        const startWebSocket = () => {
            console.log('WebSocket connecting');
            socketRef.current = new WebSocket(url);
            socketRef.current.binaryType = 'arraybuffer';

            socketRef.current.onopen = () => {
                setIsConnected(true);
                console.log('WebSocket connected');

                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const constraints = {
                        audio: {
                            sampleRate: 16000,
                            channelCount: 1,
                            echoCancellation: true,
                            autoGainControl: true,
                            noiseSuppression: false,
                            latency: 0,
                        },
                    };
                    navigator.mediaDevices.getUserMedia(constraints)
                        .then((stream) => {
                            const audioContext = new AudioContext();
                            const microphone = audioContext.createMediaStreamSource(stream);
                            const processor = audioContext.createScriptProcessor(4096, 1, 1);

                            processor.onaudioprocess = function (event) {
                                const inputData = event.inputBuffer.getChannelData(0);
                                const rms = Math.sqrt(inputData.reduce((sum, value) => sum + value * value, 0) / inputData.length);
                                const downsampledData = downsample(inputData, 48000, 16000);
                                sendAudioData(convertFloat32ToInt16(downsampledData));
                            };

                            microphone.connect(processor);
                            processor.connect(audioContext.destination);
                        })
                        .catch((error) => console.error('Error accessing microphone:', error));
                } else {
                    mediaRecorder?.stop();
                }
            };

            socketRef.current.onmessage = (event) => {
                if (event.data instanceof ArrayBuffer) {
                    const chunkSize = 6000;
                    for (let i = 0; i < event.data.byteLength; i += chunkSize) {
                        const chunk = event.data.slice(i, i + chunkSize);
                        const uint8Array = new Uint8Array(chunk);
                        simliClient.sendAudioData(uint8Array);
                    }
                }
            };

            socketRef.current.onclose = () => {
                setIsConnected(false);
                console.log('WebSocket disconnected');
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        const downsample = (buffer, fromSampleRate, toSampleRate) => {
            const sampleRateRatio = fromSampleRate / toSampleRate;
            const newLength = Math.round(buffer.length / sampleRateRatio);
            const result = new Float32Array(newLength);
            let offsetResult = 0;
            let offsetBuffer = 0;

            while (offsetResult < result.length) {
                const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
                let accum = 0, count = 0;
                for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                    accum += buffer[i];
                    count++;
                }
                result[offsetResult] = accum / count;
                offsetResult++;
                offsetBuffer = nextOffsetBuffer;
            }
            return result;
        };

        const convertFloat32ToInt16 = (buffer) => {
            const buf = new Int16Array(buffer.length);
            for (let i = 0; i < buffer.length; i++) {
                buf[i] = Math.min(1, buffer[i]) * 0x7fff;
            }
            return buf.buffer;
        };

        const sendAudioData = (audioData) => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(audioData);
            }
        };

        useEffect(() => {
            return () => {
                socketRef.current?.close();
            };
        }, []);

        return { message, isConnected, sendAudioData, startWebSocket };
    };

    const { message, isConnected, sendAudioData, startWebSocket } = useWebSocket(process.env.REACT_APP_SERVER_URL);

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

    return (
        <div className="bg-black w-full h-screen flex flex-col justify-center items-center font-mono text-white">
            <div className="w-[512px] h-screen flex flex-col justify-center items-center gap-4">
                <div className="relative w-full aspect-video">
                    <video ref={videoRef} id="simli_video" autoPlay playsInline className="w-full h-full object-cover"></video>
                    <audio ref={audioRef} id="simli_audio" autoPlay></audio>
                </div>
                {startWebRTC ? null : (
                    <button
                        onClick={handleStart}
                        className="w-full bg-white text-black py-2 px-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                    >
                        Start WebRTC
                    </button>
                )}
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default SpeechAI;