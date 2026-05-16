require("dotenv").config();

async function list() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    const models = data.models.map(m => m.name).filter(n => n.includes('flash') || n.includes('pro'));
    console.log("AVAILABLE MODELS:", models);
  } catch(e) {
    console.error(e);
  }
}
list();
