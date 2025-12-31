const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.HF_API_KEY;
// We will test with a known working model first, then yours
const WORKING_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";
const YOUR_MODEL =
  process.env.HF_MODEL_REPO || "jimutha/interview-assistant-v2-4bit";

async function testConnection(modelName) {
  console.log(`\n🔎 Testing Model: ${modelName}...`);
  const url = `https://api-inference.huggingface.co/models/${modelName}`;

  try {
    const response = await axios.post(
      url,
      { inputs: "Say hello!" },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    console.log(
      "✅ SUCCESS! Response:",
      response.data[0]?.generated_text || "OK"
    );
  } catch (error) {
    console.error(
      "❌ FAILED:",
      error.response ? error.response.data : error.message
    );
  }
}

(async () => {
  console.log("🔑 Using Token:", API_KEY ? "Loaded (Hidden)" : "MISSING ❌");
  await testConnection(WORKING_MODEL); // 1. Test Generic Model
  await testConnection(YOUR_MODEL); // 2. Test Your Model
})();
