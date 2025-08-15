import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
    const userMessage = req.body.queryResult.queryText;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    res.json({
        fulfillmentText: botReply
    });
});

app.get("/", (req, res) => {
    res.send("ChatGPT Webhook is running 🚀");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
});