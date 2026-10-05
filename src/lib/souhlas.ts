// Souhlas s měřením (GA4 + PostHog) v localStorage.
// Klíč `cookie-consent-2` od 5. 10. 2026: přibyl PostHog, tedy nový dodavatel.
// Starý souhlas (`cookie-consent`) platil jen pro GA4, proto se maže a lišta se zeptá znovu.
export const SOUHLAS_KLIC = 'cookie-consent-2';
export const STARY_SOUHLAS_KLIC = 'cookie-consent';

/** `true` jen při výslovném souhlasu; bez localStorage (privátní režim) = bez souhlasu. */
export function maSouhlas(): boolean {
  try {
    return localStorage.getItem(SOUHLAS_KLIC) === 'granted';
  } catch {
    return false;
  }
}
