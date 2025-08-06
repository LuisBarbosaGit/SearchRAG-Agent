import {z} from 'zod';

export const SearchSchema = z.object({
    response: z.string(),
    code : z.string().describe("Exemplo de codigo, caso tenha algum na resposta"),
})