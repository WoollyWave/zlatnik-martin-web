/// <reference types="astro/client" />

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __gaLoaded?: boolean;
    /** Spustí (jednorázové) načtení gtag.js — volá se až PO udělení souhlasu. */
    __loadGA?: () => void;
  }
}

export {};
