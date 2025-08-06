import 'dotenv/config';
import { loadDocuments } from '../loader/loader'
import { CohereRerank } from "@langchain/cohere";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const llmQueryTransformer = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.3,

})
export async function searchChunks(query: string): Promise<any> {
    //This aux llm will catch the user query and use to generate a more detailed prompt, which will be serach on vector store
    const preparePrompt = `Com base na pergunta ${query}, gere 3 versões alternativas e mais detalhadas para melhorar a busca em um sistema rag.`;
    const improvedQuery = await llmQueryTransformer.invoke(preparePrompt);
    console.log("Usage:", improvedQuery.response_metadata);
    const finalQuery : string = improvedQuery.content as string;

    const vectorStore = await loadDocuments();
    const resultsnoFiltered = await vectorStore.similaritySearchWithScore(finalQuery, 15);
    const docs = resultsnoFiltered.map(([doc]) => doc);

    const reranker = new CohereRerank({
        apiKey: process.env.COHERE_API_KEY,
        model: "rerank-multilingual-v3.0",
        topN: 4,
    });
    const rerankedDocs = await reranker.compressDocuments(docs, finalQuery);
    console.log("Reranked Documents:", rerankedDocs);

    return rerankedDocs.map((doc) => doc.pageContent);

}