//const SERVER_IP = '172.18.224.1';
//const SERVER_PORT = '8080';

// Определяем окружение
const isTauriApp = !!(window as any).__TAURI__;
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('172.18.224.1') || // ваша текущая локальная сеть
                     window.location.hostname.includes('192.168.'); // локальная сеть в целом

// Критически важно: для GitHub Pages нужно другое поведение
const isGitHubPages = window.location.hostname.includes('github.io');

export const API_BASE_URL = 'http://localhost:8080/api'

export const IMAGE_BASE_URL = 'http://127.0.0.1:9000/test';

console.log('Environment:', { 
  isTauriApp, 
  isDevelopment,
  isGitHubPages,
  hostname: window.location.hostname,
  API_BASE_URL,
  IMAGE_BASE_URL 
});