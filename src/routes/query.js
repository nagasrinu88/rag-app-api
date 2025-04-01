import express from 'express';
import { generateEmbeddings } from '../services/embeddings.js';
import { queryPinecone, upsertData } from '../services/pinecone.js';
import { generateResponse } from '../services/gemini.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const logObj = {
        req: {},
        res: {},
        meta: {},
    };
    const { query } = req.body;
    logObj.req.query = query;
    logObj.meta.ip = req.headers['x-forwarded-for'] || req.ip;
    try {
        // console.log("User Query is", query);
        const embedding = await generateEmbeddings(query);
        const matches = await queryPinecone(embedding);
        const matchIds = matches.map(match => match.id);
        console.log(`Found ${matches.length} matches with ids ${matchIds}`);
        const context = matches.map(match => match.metadata.text).join("\n");
        // Remove extra white spaces from the context string
        const cleanedContext = context.replace(/\s+/g, ' ').trim();

        const response = await generateResponse(query, cleanedContext);
        // Limiting the response to 100 characters for logging purposes
        logObj.res.response = response.slice(0, 100);

        res.json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your query." });
    } finally {
        // Log the request and response details
        console.log("Request Log:", logObj);
    }
});

router.post('/upsert', async (req, res) => {
    const { products } = req.body;
    try {
        const vectors = [];
        for (const product of products) {
            const embeddingText = `${product.name}. ${product.description}. ${product.category}. ${product.brand}.`;
            const embedding = await generateEmbeddings(embeddingText);
            vectors.push({
                id: product.id,
                values: embedding,
                metadata: {
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    price: product.price,
                    brand: product.brand
                }
            });
        }
        // console.log(vectors);
        await upsertData(vectors);
        res.json({ message: `${vectors.length} Data upserted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while upserting data." });
    }
});

export default router;