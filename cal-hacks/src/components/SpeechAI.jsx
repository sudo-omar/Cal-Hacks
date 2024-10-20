import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { SimliClient } from 'simli-client';
import {useWebSocket} from "./useWebSockets";


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






   const { message, isConnected, sendAudioData, startWebSocket } = useWebSocket(process.env.REACT_APP_SERVER_URL, simliClient);


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
