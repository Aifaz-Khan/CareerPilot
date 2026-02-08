const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const keyMatch = env.match(/GEMINI_API_KEY=(.*)/);
const key = keyMatch ? keyMatch[1] : '';
process.env.GEMINI_API_KEY = key;

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // dummy
        // Actually there isn't a direct listModels on genAI client in some versions, 
        // but looking at docs/errors, usually proper client usage involves knowing the model.
        // However, we can try to use the REST API via fetch if the SDK doesn't expose it easily or just try a standard one.
        // Wait, the SDK doesn't expose listModels directly in the main class easily in all versions.
        // Let's use a simple fetch to the API endpoint.

        const key = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available models:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("Error listing models:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
