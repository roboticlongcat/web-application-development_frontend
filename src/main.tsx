// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

// Регистрация Service Worker для всех хостов
// main.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Регистрируем для всех HTTPS и localhost/локальных IP
    const isSecure = window.location.protocol === 'https:' ||
                    window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.startsWith('192.168.') ||
                    window.location.hostname.startsWith('10.0.') ||
                    window.location.hostname.startsWith('172.16.');
    
    if (isSecure) {
      navigator.serviceWorker.register('/web-application-development_frontend/serviceWorker.js')
        .then(_registration => {
          console.log('✅ Service Worker registered for:', window.location.hostname);
        })
        .catch(error => {
          console.log('❌ Service Worker registration failed:', error);
        });
    }
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);