import ReactDOM from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { trpc, trpcClient } from './trpc';
import App from './App';
import Wall from './Wall';

const queryClient = new QueryClient();

/* React Router to change page */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/wall",
    element: <Wall />,
  },
]);

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </trpc.Provider>
);