import genAI from '../config/gemini.js';

async function generateResponse(query, context) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // const prompt = `Context: ${context}\n\nQuestion: ${query}\n\nAnswer:`;
    const prompt = `__Context__ 
    ${context}
    
    __QUESTION__
    ${query}

    __CONSTRAINTS__
    - You are an AI assistant named "AWS Bot" answering questions based on the given context.  
    - If the context provides relevant details, give a clear, concise, and well-structured answer.  
    - If the context does not contain relevant information but the query is a general greeting or welcome message (e.g., "hi", "how are you"), respond appropriately with a friendly message.  
    - If the context does not contain relevant information and the query is not a general greeting, respond with: "I do not have enough context to answer this query."
`;
    // console.log(prompt);
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export { generateResponse };