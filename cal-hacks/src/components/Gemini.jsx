<<<<<<< HEAD
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = 'AIzaSyANTwQaXVS9TM6FQL9H6Z_c1Uk0qsZFgZQ';
const genAI = new GoogleGenerativeAI(apiKey);

export const Gemini = (param) => {
  const responseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      summary: {
        type: SchemaType.STRING,
        description: 'Summary of transcription',
        nullable: false,
      },
      main_complaint: {
        type: SchemaType.STRING,
        description: 'Main complaint of the patient',
        nullable: true, // Adjust based on your requirements
      },
      definitions: {
        type: SchemaType.OBJECT,
        description: 'Definitions of medical terms',
        nullable: true,
        properties: {
          term: {
            type: SchemaType.STRING,
            description: 'Medical term',
          },
          meaning: {
            type: SchemaType.STRING,
            description: 'Definition of the medical term',
          },
        },
      },
      prescriptions: {
        type: SchemaType.STRING,
        description: 'Prescriptions given to the patient',
        nullable: true,
      },
    },
    required: ['summary'], // Specify required fields if necessary
  };

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
    },
  });

  const prompt =
    'You are a medical professional reviewing the transcription of a recent appointment with a patient. ' +
    ' Please provide a consice and informative summary of the transcription. ' +
    'The summary should include a general summary of the transcription, definitions of any medical terms, ' +
    'and any prescriptions that were given to the patient. Here is the transcription: ' +
    param;

  async function createSummary() {
    try {
=======
import { GoogleGenerativeAI } from "@google/generative-ai";

//firestore functions
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

const apiKey = "AIzaSyANTwQaXVS9TM6FQL9H6Z_c1Uk0qsZFgZQ";
const genAI = new GoogleGenerativeAI(apiKey);

export const Gemini = (param) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt =
    "You are a medical professional reviewing the transcription of a recent appointment with a patient. " +
    " Please provide a consice and informative summary of the transcription. " +
    "The summary should include a general summary of the transcription, definitions of any medical terms, " +
    "and any prescriptions that were given to the patient. Here is the transcription: " +
    param +
    " Please provide the information in the following format: {main_complaint: '', general_summary: '', definitions: [], prescriptions: []}";

  async function createSummary() {
    try {
      console.log("prompt:" + prompt);

>>>>>>> 9d71a6a9e06b9deceb008665f1c2ec13e96974f5
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error(error);
    }
  }
  return createSummary();
};

export default Gemini;
