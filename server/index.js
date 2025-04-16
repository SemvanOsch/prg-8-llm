import express from "express";
import cors from 'cors'
import router from "./llmRouter.js"

const app = express();

app.use(cors())
app.use(express.json())
app.use('/', router);


app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
    console.log(process.env.AZURE_OPENAI_API_KEY)
});