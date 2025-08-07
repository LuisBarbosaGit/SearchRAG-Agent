import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { searchChunks } from "../Search/Search";
import { SearchSchema } from "../models/search-schema";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

export const llmModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.3,
    maxRetries: 4,
});

export type SearchOutput =  z.infer <typeof SearchSchema>;

export class answerServices {
    async manageSearch(answer: string): Promise<SearchOutput> {
        const structuredllm = llmModel.withStructuredOutput<SearchOutput>(SearchSchema);;
        const contextChunks = await searchChunks(answer);

        const docs = contextChunks.map((doc: { pageContent: string; }) => doc.pageContent);
        //Prompt
        const templatePrompt = `Você é um assistente especialista que responde a perguntas com base em um contexto fornecido, utilize apenas o contexto fornecido para responder a pergunta da melhor forma possivel, caso exista, formule um pouco a resposta, caso não tenha uma resposta, responda que não sabe, adicione um exemplo de codigo se houver.
        Contexto:
        {context}

        Pergunta:
        {question}`;

        const prompt = ChatPromptTemplate.fromTemplate(templatePrompt);

        const chain = prompt.pipe(structuredllm);
        const response = await chain.invoke({
            context: docs.join("\n\n"),
            question: answer,
        });
        return response;
    }
}