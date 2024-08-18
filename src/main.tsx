import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './app/providers/StoreProvider';
import App from './app/App';
import './app/styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </StoreProvider>,
);
