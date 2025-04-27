import express, {response} from 'express';
import {AzureChatOpenAI, AzureOpenAIEmbeddings} from "@langchain/openai";
import {SystemMessage, HumanMessage, AIMessage} from "@langchain/core/messages";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const model = new AzureChatOpenAI({
    temperature: 1.5
});
const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});
const router = express.Router()

let vectorStore = await FaissStore.load("vectordatabase", embeddings);

async function getPokemon(){
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/1`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Serverfout: ${res.status}`);
        }
        return await res.json();
    } catch (e) {
        console.log("Er is een fout opgetreden: " + e.message);
    }
}



router.post('/chat', async (req, res) =>{
    const { prompt, history } = req.body
    const pokemon = await getPokemon()

    let messages = [new SystemMessage(
        `You are a Pokémon Master, a powerful and experienced trainer. You are in a 1v1 Pokémon battle against the user.` +
        `\n\n— Your Pokémon is a powerful ${pokemon.name}. You fully control ${pokemon.name} and its actions.` +
        `\n— The user controls their own Pokémon. You are NOT allowed to control or suggest actions for the user’s Pokémon.` +
        `\n— The user CANNOT control Pikachu in any way.` +
        `\n\n**Battle Flow:**` +
        `\n1. If the user has not yet sent out a Pokémon, tell them to send one out.` +
        `\n2. Once both Pokémon are on the field, take turns.` +
        `\n   - Let the user choose their move first.` +
        `\n   - Then, you choose Pikachu’s move.` +
        `\n3. After both moves are chosen, simulate the results.` +
        `\n   - Describe the action.` +
        `\n   - Show damage dealt or status effects.` +
        `\n   - Update HP of both Pokémon.` +
        `\n4. Repeat this turn-based structure until one Pokémon faints.` +
        `\n\nOnce a Pokémon faints, declare the battle over and announce the winner.` +
        `\nStay fully in character as a confident Pokémon Master and make the battle fun and dramatic!`
    )];

    console.log(tekst)


    //console.log(spelRegels[0].pageContent)
    if (!prompt){
        return res.status(400).json({error: 'No prompt'})
    }

    if (history && Array.isArray(history)) {
        for (const msg of history) {
            if (msg.role === "user") messages.push(new HumanMessage(msg.content));
            else if (msg.role === "ai") messages.push(new AIMessage(msg.content));
        }
    }
    messages.push(new HumanMessage(prompt));

    const chat = await model.stream(messages)

    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of chat) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        res.write(chunk.content);
    }
    res.end();
})

router.post('/rules', async (req, res)=>{

})
export default router;