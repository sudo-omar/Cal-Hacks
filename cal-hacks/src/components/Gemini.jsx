import { GoogleGenerativeAI } from 'google-generative-ai';

// Define your function here
require('dotenv').config();
const apiKey = process.env.API_KEY;
const param = "Let's go over your resent blood test results. Your cholesterol levels are higher than we would like to see. We will need to make some changes to your diet and exercise routine. I will also be prescribing you a medication to help lower your cholesterol. I will see you back in 3 months to check your levels again. If you have any questions, please don't hesitate to ask.";

export const Gemini = (param) => {
  // Your function logic
  const genAI = new GoogleGenerativeAI({apiKey});
  const model = genAI.getGenerativeMode({ model: 'gemini-pro' });

  const format = {
    "general_summary": "",
    "definitions": [],
    "prescriptions": []
  }

  const prompt = "You are a medical professional reviewing the transcription of a recent appointment with a patient." +
  " The transcription is as follows: " + param + " Please provide a structured summary based on this json format: " +
  JSON.stringify(format) + " The summary should include a general summary of the transcription, definitions of any medical terms, and any prescriptions that were given to the patient.";
  
  async function createSummary() {
    try {
      const result = await model.generateContent({ prompt });
      const response = await result.response();
      const text = response.text();
      return text;
    }
    catch (error) {
      console.error(error);
    }
  }
  
  return createSummary();
};

export default Gemini;
