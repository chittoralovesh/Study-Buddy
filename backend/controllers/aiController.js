const Groq = require("groq-sdk");
const pdfParse = require("pdf-parse");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const processDocument = async (req, res) => {
  console.log("=> processDocument hit. Type:", req.body.type);
  try {
    let text = req.body.text;
    const type = req.body.type || "chat"; // Default to chat if missing

    if (req.file) {
      console.log("=> Received file:", req.file.originalname, "Size:", req.file.size);
      try {
        const data = await pdfParse(req.file.buffer);
        text = data.text;
        console.log("=> PDF Parsed. Character count:", text.length);
      } catch (pdfError) {
        console.error("=> PDF Parsing Failed:", pdfError);
        return res.status(500).json({ message: "Failed to parse PDF file content." });
      }
    }

    if (!text) {
      return res.status(400).json({ message: "No text or file provided" });
    }

    let prompt = "";
    if (type === "summary") {
      prompt = `Perform a deep, comprehensive analysis of the following study material. Create a high-quality study guide. Provide:
1. A descriptive, professional title.
2. A detailed 3-paragraph executive summary (overview) that covers the core thesis and major implications.
3. A list of 8-10 exhaustive key points covering technical details, nuances, and critical facts.
Return ONLY a JSON object exactly matching this schema: {"title": "string", "overview": "string", "keyPoints": ["string", "string"]} \n\nMaterial:\n${text.substring(0, 25000)}`;
    } else if (type === "quiz") {
      prompt = `Create a 20-question multiple choice quiz based on the study material. Return ONLY a JSON object exactly matching this schema: {"questions": [{"question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": 0, "explanation": "string"}]} \n\nMaterial:\n${text.substring(0, 20000)}`;
    } else if (type === "plan") {
      const purpose = req.body.purpose || "General Study";
      const subject = req.body.subject || "All Subjects";
      const duration = req.body.duration || "7";
      prompt = `Create a ${duration}-day step-by-step study plan for ${subject}. The goal is: ${purpose}. Return ONLY a JSON object exactly matching this schema: {"days": [{"day": 1, "focus": "string", "tasks": ["string", "string"]}]} \n\nMaterial:\n${text.substring(0, 20000)}`;
    } else if (type === "flashcards") {
      prompt = `Create 10 key flashcards from the study material. Return ONLY a JSON object exactly matching this schema: {"flashcards": [{"front": "string", "back": "string"}]} \n\nMaterial:\n${text.substring(0, 20000)}`;
    } else {
      // Default to Chat logic
      const question = req.body.question || "Hello";
      prompt = `You are a brilliant, encouraging AI tutor named StudyBuddy. A student asks: "${question}". Answer it accurately using the following study material. Keep your response conversational, formatting it with bullet points if necessary. IMPORTANT: DO NOT OUTPUT JSON. OUTPUT PLAIN CONVERSATIONAL TEXT ONLY. \n\nMaterial:\n${text.substring(0, 20000)}`;
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
    let responseText = "";
    let retries = 3;
    while(retries > 0) {
      try {
        const isJsonMode = (type !== "chat" && type !== "text");
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are StudyBuddy, a helpful and intelligent AI tutor. Always respond in plain conversational text unless strictly asked for a JSON structure." },
            { role: "user", content: prompt }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.5,
          response_format: isJsonMode ? { type: "json_object" } : undefined
        });
        responseText = completion.choices[0]?.message?.content || "";
        break; // Success
      } catch (e) {
        if (e.status === 429 && retries > 1) {
          console.log(`Groq Rate Limit Hit (429). Retrying in 10 seconds... (${retries - 1} attempts left)`);
          await sleep(10000);
          retries--;
        } else {
          throw e; // Bubble up other errors or if out of retries
        }
      }
    }

    console.log("=> Groq Raw Response:", responseText.substring(0, 100) + "...");
    
    let result;
    if (type !== "chat") {
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON despite json_object mode.");
        result = { error: "Failed to generate valid response structure." };
      }
    } else {
      // For chat, just wrap it in the expected answer object
      result = { answer: responseText };
    }
    
    res.json({
      ...result,
      sourceText: text.substring(0, 20000)
    });
  } catch (error) {
    console.error("AI Processing Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { processDocument };
