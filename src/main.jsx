import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

async function bootstrap() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { startMockServer } = await import('@/api/mocks/browser');
    await startMockServer();
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
