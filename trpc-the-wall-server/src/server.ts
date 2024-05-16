import cors from 'cors';
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import Session from 'express-session';
import { createContext } from './utils/context';
import { appRouter } from './routes';
import { CONSTANT } from './config/constants';

const app = express();
app.use(Session({
    secret: CONSTANT.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false, maxAge: Number(CONSTANT.SESSION_EXPIRE) }
}));

app.use(cors());

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    })
);

app.listen(CONSTANT.PORT, () => {
    console.log(`Server is running on http://localhost:${CONSTANT.PORT}`);
});

export type AppRouter = typeof appRouter;