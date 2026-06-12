/// <reference types="astro/client" />

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __gaLoaded?: boolean;
  }
}

export {};
