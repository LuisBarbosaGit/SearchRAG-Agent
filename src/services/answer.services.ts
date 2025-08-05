import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { searchChunks } from "../Search/Search";
// import { PromptTemplate } from "@langchain/core/prompts";
import { pipeline } from "@xenova/transformers";

export const llmModel = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.3,
    maxRetries: 3,
});

export class mainServices {
    async manageSearch(answer: string): Promise<any> {
        const crossEncoder = await pipeline('text-classification', 'Xenova/cross-encoder-ms-marco-MiniLM-L-6-v2');
        const contextChunks = await searchChunks(answer);
        // Get the document content of metadata chunks
        const documentsContent = contextChunks.map(doc => doc[0].pageContent);
        const questions = contextChunks.map(() =>  answer)
        console.log("Questions:", questions);
        console.log("Documents content;", documentsContent);
        // Classify the document chunks
        const contextResultsAfterScore = await crossEncoder(questions, { text_pair : documentsContent} as any);

        console.log(contextResultsAfterScore);
        
        //Prompt
        // const templatePrompt = `Você é um assistente especialista que responde a perguntas com base em um contexto fornecido, utilize o contexto fornecido para responder a pergunta da melhor forma possivel, caso a pergunta não esteja inclusa no contexto, tente responder com base em algum padrão ou exemplo fornecido pelo contexto, caso ainda não exista responda que não sabe.
        // Contexto:

        // {context}

        // Pergunta:
        // {question}`;

        // const prompt = new PromptTemplate({
        //     template: templatePrompt,
        //     inputVariables: ["context", "question"]
        // });

        // const chain = prompt.pipe(llmModel);
        // const response = await chain.invoke({
        //     context: context,
        //     question: answer,
        // })
        // return response.content
    }
}