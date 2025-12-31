// backend/check_models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_TO_TEST = [
  "gemini-1.5-flash",
  "gemini-pro",
  "gemini-1.0-pro",
  "gemini-1.5-pro-latest",
];

async function testModels() {
  console.log("🔍 Testing available AI models...");
  console.log("-----------------------------------");

  for (const modelName of MODELS_TO_TEST) {
    try {
      process.stdout.write(`Testing '${modelName}'... `);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      console.log("✅ SUCCESS!");
    } catch (error) {
      // Check if it's a 404 (Not Found) or something else
      if (error.message.includes("404")) {
        console.log("❌ Not Found (404)");
      } else {
        console.log(`❌ Error: ${error.message.split("[")[0]}`); // Print short error
      }
    }
  }
  console.log("-----------------------------------");
}

testModels();
