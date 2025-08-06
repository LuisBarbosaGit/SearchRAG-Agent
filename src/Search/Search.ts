import 'dotenv/config';
import { loadDocuments} from '../loader/loader'
import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";

export const minillmModel = new ChatOllama({
    model: "qwen2:1.5b",
    temperature: 0.2,

});

export async function searchChunks(query : string): Promise<any> {
    const templatePrepareDocument = `Você é um especialista em processamento e filtragem de informações. Sua tarefa é extrair e reter APENAS os trechos de um CONTEXTO fornecido que são diretamente relevantes para responder à PERGUNTA do usuário.
    Siga estas regras rigorosamente:
    1.Leia a question para entender qual informação específica é necessária.
    2.Leia o contexto e identifique todas as frases ou parágrafos que contêm a informação necessária para responder à question.
    3.Filtre e descarte qualquer informação, frase ou parágrafo que seja ruído ou que não ajude a responder diretamente à pergunta.
    4.Retorne APENAS os trechos relevantes que você extraiu.
    5.Mantenha a linguagem original dos trechos extraídos, sem reescrevê-los.
    6.Se nenhum trecho do contexto for relevante para a pergunta, retorne o contexto original"

    contexto:
    {context}
    question:
    {question}`;

    const promptPrepare = new PromptTemplate({
        template: templatePrepareDocument,
        inputVariables: ["context", "question"]
    });
    const chain = promptPrepare.pipe(minillmModel);

    const vectorStore = await loadDocuments();
    //Find the first 20 similar chunks
    const resultsnoFiltered =  await vectorStore.similaritySearchWithScore(query, 15);

    const response = await chain.invoke({
        context: resultsnoFiltered.map(doc =>  doc[0].pageContent).join("/n"),
        question: query,
    });

    return response.content;
    
}