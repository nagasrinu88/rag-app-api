import { Pinecone } from "@pinecone-database/pinecone";
import { config } from 'dotenv';
config();

console.log("Pinecone API Key", process.env.PINECONE_API_KEY && process.env.PINECONE_API_KEY.substring(0, 5));

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    // environment: process.env.PINECONE_ENVIRONMENT,
});

export default pinecone;