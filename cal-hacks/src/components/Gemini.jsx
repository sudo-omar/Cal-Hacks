import { GoogleGenerativeAI } from "@google/generative-ai"


// Define your function here
const apiKey = 'AIzaSyANTwQaXVS9TM6FQL9H6Z_c1Uk0qsZFgZQ';
const genAI = new GoogleGenerativeAI(apiKey);

export const Gemini = (param) => {
  // Your function logic
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

//   const format = {
//     "general_summary": "",
//     "definitions": [],
//     "prescriptions": []
//   }

//   const prompt = "You are a medical professional reviewing the transcription of a recent appointment with a patient." +
//   " The transcription is as follows: " + param + " The summary should include a general summary of the transcription, definitions of any medical terms, and any prescriptions that were given to the patient. Please provide a structured summary based on this json format inputed";
  
const input = {
    transcription: param, // The patient's transcription
    format: {
      "general_summary": "",
      "definitions": [],
      "prescriptions": []
    },
    instructions: "You are a medical professional reviewing the transcription of a recent appointment with a patient. Please provide a structured summary based on the provided format."
  };

// console.log("prompt:" + prompt)

  async function createSummary() {
    try {

    // console.log("prompt:" + prompt)
        
      const result = await model.generateContent(input);
      const response = await result.response();
      console.log(result)
      const text = response.text();
      console.log("this is resutl: " + text);
      return text;
    } catch (error) {
      console.error(error);
    }
  }
  
  return createSummary();
};

export default Gemini;
