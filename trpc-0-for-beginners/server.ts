// Example of integration with Express
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { z } from 'zod';

// setup the context
const createContext = ({ 
    req, 
    res 
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });
type Context = inferAsyncReturnType<typeof createContext>;

// initialize router and procedure
const t = initTRPC.context<Context>().create();
const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
    getUser: publicProcedure
        .query((opts) => {
            return { id: 1, name: 'Bilbo' };
    })
});

const app = express();

app.use(
    '/trpc', 
    trpcExpress.createExpressMiddleware({ 
        router: appRouter, 
        createContext 
    })
);

app.get('/', (_req, res) => res.send('hello world'));

app.listen(8080, () => {
    console.log('listening on port 8080');
});

export type AppRouter = typeof appRouter;;