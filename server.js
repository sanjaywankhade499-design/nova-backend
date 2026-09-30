const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// तुझी Gemini API Key इथे सुरक्षित राहील (Environment Variable मध्ये ठेवा)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_ACTUAL_GEMINI_API_KEY";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.post('/api/nova-chat', async (req, res) => {
    try {
        const { userMessage } = req.body;

        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `System Instruction: You are Nova AI on the NOVA platform, created by Arvit. You are an expert in AI education, tech, and safety. Always reply politely.\n\nUser Question: ${userMessage}`,
        });

        const replyText = response.text || "Sorry, I couldn't process that.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Failed to connect with Gemini AI" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Nova Backend running on port ${PORT} 🚀`));
