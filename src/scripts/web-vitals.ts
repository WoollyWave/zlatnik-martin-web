/**
 * Core Web Vitals → GA4 (Reports → Engagement → Events).
 *
 * Měřené metriky (web-vitals v5):
 * - LCP (Largest Contentful Paint)  · good ≤ 2.5s
 * - INP (Interaction to Next Paint)  · good ≤ 200ms  (nahradilo FID od 2024-03)
 * - CLS (Cumulative Layout Shift)    · good ≤ 0.1
 * - FCP (First Contentful Paint)     · good ≤ 1.8s
 * - TTFB (Time to First Byte)        · good ≤ 0.8s
 *
 * Hodnoty se v GA4 zaokrouhlují na integer (CLS × 1000, ostatní v ms).
 * Eventy respektují Consent Mode v2 — bez `analytics_storage: granted` se neodešlou.
 *
 * V GA4: Reports → Engagement → Events → klik na metriku (LCP/INP/CLS…)
 *   → Add comparison: `metric_rating` = poor   → vidíš % uživatelů s problémem
 *   → Custom dimension: vytvoř z `metric_rating` pro segmentaci v Explore reportech
 */
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

function sendToGA(metric: Metric): void {
  // GA4 chce integer. CLS je float ~0.05 → ×1000 = 50ms-ekvivalent pro grafy.
  const value = metric.name === 'CLS'
    ? Math.round(metric.delta * 1000)
    : Math.round(metric.delta);

  window.gtag?.('event', metric.name, {
    value,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    metric_navigation_type: metric.navigationType,
    non_interaction: true,
  });
}

onLCP(sendToGA);
onINP(sendToGA);
onCLS(sendToGA);
onFCP(sendToGA);
onTTFB(sendToGA);
