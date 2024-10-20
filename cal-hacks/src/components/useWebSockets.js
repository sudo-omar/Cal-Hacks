import {useEffect, useRef, useState} from "react";

export const useWebSocket = (url, simliClient) => {
    const [message, setMessage] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const startWebSocket = () => {
        console.log('WebSocket connecting');
        socketRef.current = new WebSocket(url);
        socketRef.current.binaryType = 'arraybuffer';
        window.ryqn = socketRef.current;
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