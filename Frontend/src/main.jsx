import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

const OLD_HOST =
  "grind-next-63fikb3ex-lost-supras-projects.vercel.app";

const NEW_HOST = "grind-next.vercel.app";

if (window.location.hostname === OLD_HOST) {
  window.location.replace(
    `https://${NEW_HOST}${window.location.pathname}${window.location.search}${window.location.hash}`
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
