/**
 * Google Analytics 4 tracking utilities
 * Replace G-XXXXXXXXXX with your actual GA4 Measurement ID
 */

const GA4_MEASUREMENT_ID = 'G-DWXR0QWQSR';
const GOOGLE_ADS_CONVERSION_ID = 'AW-18186928399';

interface GA4EventParams {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown> | GA4EventParams,
    ) => void;
    dataLayer?: unknown[];
  }
}

function gtag(command: string, targetId: string, config?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(command, targetId, config);
  }
}

/**
 * Track a custom GA4 event
 */
export function trackEvent(
  eventName: string,
  params: GA4EventParams = {},
) {
  gtag('event', eventName, {
    send_to: GA4_MEASUREMENT_ID,
    ...params,
  });
}

/**
 * Track page view manually (useful for SPA navigation)
 */
export function trackPageView(path: string, title?: string) {
  gtag('config', GA4_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
    page_location: `https://emmagination.cl${path}`,
  });
}

/**
 * Track a lead generation event (form submission, WhatsApp click, etc.)
 * Also sends Google Ads conversion event
 */
export function trackGenerateLead(
  value?: number,
  currency: string = 'CLP',
  source?: string,
) {
  trackEvent('generate_lead', {
    currency,
    value: value ?? 1,
    lead_source: source ?? 'website',
  });
  
  // Send Google Ads conversion event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_CONVERSION_ID}/generate_lead`,
      value: value ?? 1,
      currency,
    });
  }
}

/**
 * Track contact event
 */
export function trackContact(method: string) {
  trackEvent('contact', {
    contact_method: method,
  });
}

/**
 * Track CTA button click
 */
export function trackCTAClick(buttonText: string, location: string) {
  trackEvent('cta_click', {
    button_text: buttonText,
    location,
  });
}

/**
 * Track service page view
 */
export function trackServiceView(serviceName: string) {
  trackEvent('view_service', {
    service_name: serviceName,
  });
}

/**
 * Track project case study view
 */
export function trackProjectView(projectName: string) {
  trackEvent('view_project', {
    project_name: projectName,
  });
}

/**
 * Track outbound link click
 */
export function trackOutboundLink(url: string, label?: string) {
  trackEvent('outbound_click', {
    url,
    label: label ?? url,
  });
}

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(depth: number) {
  trackEvent('scroll_depth', {
    depth_percent: depth,
  });
}

/**
 * Check if GA4 is initialized
 */
export function isGA4Initialized(): boolean {
  return typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    typeof window.dataLayer !== 'undefined';
}
