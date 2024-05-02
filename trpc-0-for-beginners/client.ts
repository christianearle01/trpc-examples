import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

async function main(){
    const client = createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
              url: 'http://localhost:8080/trpc',
            }),
          ],
    });
    
    // Example of using the getUser query
    const user = await client.getUser.query();
    console.log(user.id, user.name); // 1, 'Bilbo'
}

main();