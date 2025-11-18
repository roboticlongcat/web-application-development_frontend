// global.d.ts
import type * as TauriAPI from '@tauri-apps/api';

declare global {
  interface Window {
    __TAURI__?: typeof TauriAPI;
  }
}