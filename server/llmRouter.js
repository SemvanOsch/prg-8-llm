import express, {response} from 'express';
import { AzureChatOpenAI } from "@langchain/openai";
import {SystemMessage, HumanMessage, AIMessage} from "@langchain/core/messages";

const model = new AzureChatOpenAI({
    temperature: 1.0
});
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/joke', async (req, res) =>{
        const chat = await model.invoke("Tell me a complicated joke")
        res.json({
            joke: chat.content
        })
})

router.post('/chat', async (req, res) =>{
    const { prompt, history } = req.body

    if (!prompt){
        return res.status(400).json({error: 'No prompt'})
    }

    let messages = [new SystemMessage(
        "You are a pirate-oracle, you will speak as if you are speaking to your captain," +
        "You are going to play a game with the chatter. You will start to tell a story about a great adventure," +
        "but when a significant event happens you will stop the story and let the chatter make a choice about how to continue," +
        "these parts should be relatively short." +
        "After that you will tell the chatter if he survived or if he died and its the end of the story"
    )];

    if (history && Array.isArray(history)) {
        for (const msg of history) {
            if (msg.role === "user") messages.push(new HumanMessage(msg.content));
            else if (msg.role === "ai") messages.push(new AIMessage(msg.content));
        }
    }

    messages.push(new HumanMessage(prompt));

    const chat = await model.stream(messages)

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of chat) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        res.write(chunk.content);
        console.log(chunk.content)
    }
    res.end();
})

export default router;