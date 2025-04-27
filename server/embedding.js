import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});
let vectorStore

async function createVectorStore() {
    const loader = new PDFLoader("./files/battles.pdf");
    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 250 });
    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log(`Document split into ${splitDocs.length} chunks. Now saving into vector store`);
    vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
    await vectorStore.save("vectordatabase");
}

createVectorStore()