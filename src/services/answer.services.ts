import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { searchChunks } from "../Search/Search";
import { SearchSchema } from "../models/search-schema";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { IterableReadableStream } from "@langchain/core/dist/utils/stream";

export const llmModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.3,
    maxRetries: 4,
});

export type SearchOutput =  z.infer <typeof SearchSchema>;

export class answerServices {

    async manageSearch(answer: string): Promise<IterableReadableStream<any>> {
        const structuredllm = llmModel.withStructuredOutput<SearchOutput>(SearchSchema);;
        const contextChunks = await searchChunks(answer);

        const docs = contextChunks.map((doc: { pageContent: string; }) => doc.pageContent);
        //Prompt
        const templatePrompt = `Você é um assistente especialista que responde a perguntas com base em um contexto fornecido, utilize apenas o contexto fornecido para responder a pergunta da melhor forma possivel, considere o formato de resposta a partir das regras abaixo:
        1.Formule a explicação, se for pertinente inclua um passo a passo.
        2.Caso o questionamento não esteja nos assuntos: hpro, delphi, dbisam, hproelements, rpserver, ws e regras de negocio tente primeiro responder com base no contexto, se não conseguir tente responder com seu proprio conhecimento.
        3.Se a pergunta estiver em um dos temas mencionados acima e a resposta não estiver no contexto, responda que não sabe.
        4.Caso um exemplo de codigo não venha no contexto, tente gerar um com base nos seus conhecimentos sobre delphi rio, mas tentando seguir as regras do contexto fornecido.
        
        Contexto:
        {context}

        Pergunta:
        {question}`;

        const prompt = ChatPromptTemplate.fromTemplate(templatePrompt);

        const chain = prompt.pipe(structuredllm);
        const response = await chain.stream({
            context: docs.join("\n\n"),
            question: answer,
        });
        return response
    }
}