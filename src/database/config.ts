import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { type Document } from "@langchain/core/documents";
import fs from "fs/promises";
import path from "path";
export const faissPath = path.resolve(process.cwd(), "faiss_index")

//Para rodar localmente
// export const embeddings = new HuggingFaceTransformersEmbeddings({
//   modelName: "Xenova/all-MiniLM-L6-v2",
// });

export const ebbeddings = new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    apiKey: process.env.HUGGING_FACE_HUB_TOKEN,
    provider:"hf-inference",
});

export async function getVectorStore(docs?: Document[]): Promise<FaissStore> {
  try {
    console.log("Loading VectorStore....");
    await fs.access(faissPath)
    const vectorstore = await FaissStore.load(faissPath, ebbeddings)
    return vectorstore;

  } catch (error) {
    if (!docs) {
      throw new Error('Error, document invalid!')
    }
    //Create New VectorStore
    console.log("Creating VectorStore....");
    const vectorstore = await FaissStore.fromDocuments(docs, ebbeddings)
    await vectorstore.save(faissPath);
    
    return vectorstore;
  }  
}