const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const {  OpenAI } = require('openai');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});


app.post("/api/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("🔹 Received prompt:", prompt);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("✅ AI Response:", chatCompletion.choices[0].message.content);

    res.json({ result: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("❌ AI error:", error);
    res.status(500).json({ result: "AI error: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
