import 'dotenv/config';
import { load} from './loader'
import fs from 'fs/promises'
import { faissPath } from './database/config';

export async function search(query : string) {
    const shouldRecreate = process.argv.includes('--recreate');

    if (shouldRecreate) {
        console.log('Tag --recursive encontrada, recriando banco de dados')
        fs.rm(faissPath,  {recursive: true, force: true})
    }

    const SearchStore = await load();
    const results =  await SearchStore.similaritySearchWithScore(query, 5);
    return results;
}