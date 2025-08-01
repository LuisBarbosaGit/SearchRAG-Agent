import path from "node:path";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { TokenTextSplitter } from "langchain/text_splitter";
import { getVectorStore } from "./database/config";

const loader = new DirectoryLoader(
    path.resolve(__dirname, '../documents'),
    {
        '.pdf': (filePath) => new PDFLoader(filePath),
        '.txt': (filePath) => new TextLoader(filePath)
    }
)

export async function load() {
    const docs = await loader.load()
    const splitter = new TokenTextSplitter({
        encodingName: "cl100k_base",
        chunkSize: 600,
        chunkOverlap: 0,
    })
    
    //Chunk Documents
    const chunks = await splitter.splitDocuments(docs);
    //Create or receive vectorStore
    const vectorStore = await getVectorStore(chunks);

    return vectorStore   
}

