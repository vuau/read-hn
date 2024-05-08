import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import "@reach/dialog/styles.css";
import './water.css';
import { inject } from '@vercel/analytics';

inject();
const queryClient = new QueryClient()

ReactDOM.createRoot(document.querySelector('#app') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
