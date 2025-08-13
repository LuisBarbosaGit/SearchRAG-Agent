import {z} from 'zod';

export const SearchSchema = z.object({
    message: z.string().describe("Resposta gerada")
})