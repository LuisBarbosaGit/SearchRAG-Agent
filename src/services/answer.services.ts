import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { searchChunks } from "../Search/Search";
import { PromptTemplate } from "@langchain/core/prompts";

export const llmModel = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.2,
});

export class mainServices{

    async manageSearch(answer : string): Promise<any>{
        const context =  await searchChunks(answer);
        const contextDocumentArray = context.map(doc => {
            const documentContent = doc[0]
            return documentContent.pageContent
        })
        
        const contextDocument = contextDocumentArray.join(" ")
        //Prompt
        const templatePrompt = `Você é um assistente especialista que responde a perguntas com base em um contexto fornecido. Use APENAS as seguintes informações do contexto para formular e responder à pergunta do usuário. Se a resposta não estiver no contexto, responda não sei.
        Contexto:

        ${contextDocument}

        Pergunta:
        ${answer}`

        const prompt =  new PromptTemplate({
            template : templatePrompt,
            inputVariables: ["context", "question"]
        });
        const chain = prompt.pipe(llmModel);

        const response = await chain.invoke({
            context: contextDocument,
            question: answer,
        })
        console.log(prompt)
        return response.content
            
    }
}