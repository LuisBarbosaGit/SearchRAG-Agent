import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { searchChunks } from "../Search/Search";
import { PromptTemplate } from "@langchain/core/prompts";
import { SearchSchema } from "../models/search-schema";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const llmModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.3,
    maxRetries: 4,
});

export class mainServices {
    async manageSearch(answer: string): Promise<any> {

        const structuredllm = llmModel.withStructuredOutput(SearchSchema) as any;
        const contextChunks = await searchChunks(answer);
        const docs = contextChunks.map((doc) => { doc.pageCntent});
        // // Get the document content of metadata chunks
        //Prompt
        const templatePrompt = `Você é um assistente especialista que responde a perguntas com base em um contexto fornecido, utilize o contexto fornecido para responder a pergunta da melhor forma possivel, caso a pergunta não esteja inclusa no contexto, tente responder com algum padrão encontrado no contexto, caso ainda não tenha uma resposta significativa responda que não sabe, se tiver algum exemplo de codigo, envie na resposta com uma chave codigo:.
        Contexto:

        {context}

        Pergunta:
        {question}`;

        const prompt = ChatPromptTemplate.fromTemplate(templatePrompt);
        
        const chain = prompt.pipe(structuredllm);
        
        const response = await chain.invoke({
            context: docs.join("\n\n"),
            question: answer,
        })
        return response;
    }
}