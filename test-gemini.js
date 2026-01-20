import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("What is Ohm's Law?");
    console.log("✅ ANSWER:\n", result.response.text());
  } catch (err) {
    console.error("❌ GEMINI ERROR:", err);
  }
}

test();
