
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import TelegramMiniApp from './frontend/src/pages/TelegramMiniApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Не удалось найти корневой элемент для монтирования");
}

// Detect if running in Telegram Mini App
const isTelegramMiniApp = window.Telegram?.WebApp !== undefined;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {isTelegramMiniApp ? <TelegramMiniApp /> : <App />}
  </React.StrictMode>
);