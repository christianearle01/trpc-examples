import { initTRPC, TRPCError } from '@trpc/server';
import { createContext } from './context'; 

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

/* Create middleware to check if a user is login each time request to function that are required a login user */
const isLogin = t.middleware((opts) => {
    if (!opts.ctx.req.session?.user){
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You are not authorized, Login Required.',
        });
    }

    return opts.next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isLogin);