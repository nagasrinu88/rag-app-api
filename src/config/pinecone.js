import { Pinecone } from "@pinecone-database/pinecone";
import { config } from 'dotenv';
config();

console.log(process.env.PINECONE_API_KEY);

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    // environment: process.env.PINECONE_ENVIRONMENT,
});

export default pinecone;