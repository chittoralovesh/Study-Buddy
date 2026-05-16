require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const text = "Dummy text";
  const question = "heyyyy";
  const prompt = `You are a brilliant, encouraging AI tutor named StudyBuddy. A student asks: "${question}". Answer it accurately using the following study material. Keep your response conversational, formatting it with bullet points if necessary. \n\nMaterial:\n${text}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });
  console.log("Response:", response.text);
}
test();
