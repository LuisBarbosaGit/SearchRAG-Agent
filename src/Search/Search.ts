import 'dotenv/config';
import { loadDocuments } from '../loader/loader'
import { CohereRerank } from "@langchain/cohere";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const llmQueryTransformer = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.3,
});

export const reranker = new CohereRerank({
    apiKey: process.env.COHERE_API_KEY,
    model: "rerank-multilingual-v3.0",
    topN: 4,
});

export async function searchChunks(query: string): Promise<any> {
    //This aux llm will catch the user query and use to generate a more detailed prompt, which will be serach on vector store
    const preparePrompt = `Você é um agente auxiliar de um sistema rag em uma empresa de desenvolvimento de software, com base na pergunta ${query}, gere 4 versões alternativas e mais detalhadas visando melhorar a busca sem alterar o sentido, não adicione nada além das 4 versões alternativas.`;
    const improvedQuery = await llmQueryTransformer.invoke(preparePrompt);

    const finalQuery : string = improvedQuery.content as string;
    //Load documents and create vectorStore
    const vectorStore = await loadDocuments();
    const resultsnoFiltered = await vectorStore.similaritySearchWithScore(finalQuery, 15);
    const docs = resultsnoFiltered.map(([doc]) => doc);

    const rerankedDocs = await reranker.compressDocuments(docs, finalQuery);
    return rerankedDocs;
}