/// <reference types="astro/client" />

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __gaLoaded?: boolean;
    /** Spustí (jednorázové) načtení gtag.js — volá se až PO udělení souhlasu. */
    __loadGA?: () => void;
    /** Odvolání souhlasu v běžícím dokumentu: GA4 přestane posílat. */
    __stopGA?: () => void;
    /** PostHog (PostHog.astro): start po souhlasu, stop při odvolání, vlastní události. */
    __zlPostHog?: {
      start: () => void;
      stop: () => void;
      udalost: (nazev: string, vlastnosti?: Record<string, unknown>) => void;
    };
  }
}

export {};
