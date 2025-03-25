import pinecone from '../config/pinecone.js';

async function queryPinecone(embedding) {
    console.log(process.env.PINECONE_INDEX);
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    const queryResponse = await index.query({
        vector: embedding,
        topK: process.env.MAX_SEARCH_RESULTS_FOR_CONTEXT || 5,
        includeMetadata: true,
    });
    return queryResponse.matches;
}

async function upsertData(vectors) {
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    await index.upsert(vectors);
}

export { queryPinecone, upsertData };