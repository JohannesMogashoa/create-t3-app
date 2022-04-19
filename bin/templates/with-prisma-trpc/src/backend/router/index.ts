import { createRouter } from '@/backend/utils/createRouter';
import superjson from "superjson"
import { z } from 'zod';

export const appRouter = createRouter()
    .transformer(superjson)
    .query("hello", {
        input: {
            name: z.string()
        },
        async resolve({ ctx, input }) {
            return {
                message: `Hello ${input.name}`
            }
        }
    })

// export type definition of API
export type AppRouter = typeof appRouter;