import { MiniKit } from '@worldcoin/minikit-js';

declare global {
  interface Window {
    MiniKit?: typeof MiniKit;
  }
}

export {};

