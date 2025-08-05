import 'dotenv/config';
import { loadDocuments} from '../loader/loader'

export async function searchChunks(query : string) {

    
    console.log("Modelo de re-ranking carregado")

    const vectorStore = await loadDocuments();
    //Find the first 20 similar chunks
    const resultsnoFiltered =  await vectorStore.similaritySearchWithScore(query, 20);
    return resultsnoFiltered;
    
}