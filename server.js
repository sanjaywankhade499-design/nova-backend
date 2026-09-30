const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// तुझी Gemini API Key (Value मध्ये टाकलेली खरी की इथे चालणार)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_ACTUAL_GEMINI_API_KEY";

app.post('/api/nova-chat', async (req, res) => {
    try {
        const { userMessage } = req.body;
        if (!userMessage) return res.status(400).json({ error: "Message is required" });

        // कोणत्याही लायब्ररीशिवाय थेट सुरक्षित API Fetch कॉल (Render वर कधीच फेल होणार नाही)
        const url = `https://googleapis.com{GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `System Instruction: You are Nova AI on the NOVA platform, created by Arvit. Expert in tech, education, and safety. Reply politely.\n\nUser: ${userMessage}` }]
                }]
            })
        });

        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to connect with Gemini AI" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
