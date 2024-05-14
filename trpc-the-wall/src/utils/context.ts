import * as trpcExpress from '@trpc/server/adapters/express';
import { APIContext } from '../config/types';

export const createContext = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions): APIContext => {
    return { 
        req, 
        res 
    };
};