import { createTRPCReact, httpLink } from '@trpc/react-query';

import type { AppRouter } from '../../server/src/index';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
    links: [
        httpLink({
            url: 'http://localhost:8080/trpc',
            fetch(url, options) {
                return fetch(url, {
                  ...options,
                  credentials: 'include',
                });
            },
        }),
    ],
});