const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim() ?? '';

type FbqParameter = string | number | boolean | null | Record<string, unknown>;

interface FbqFunction {
  (...args: FbqParameter[]): void;
  callMethod?: (...args: FbqParameter[]) => void;
  queue?: FbqParameter[][];
  loaded?: boolean;
  version?: string;
  push?: FbqFunction;
}

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

function hasDocument() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function getMetaPixelId() {
  return META_PIXEL_ID;
}

export function initMetaPixel() {
  if (!hasDocument() || !META_PIXEL_ID) {
    return false;
  }

  return typeof window.fbq === 'function';
}

export function trackMetaPageView(path?: string) {
  if (!hasDocument() || !META_PIXEL_ID) {
    return;
  }

  const fbq = window.fbq;
  if (!fbq) {
    return;
  }

  if (path) {
    fbq('track', 'PageView', {
      page_path: path,
      page_location: window.location.href,
    });
    return;
  }

  fbq('track', 'PageView');
}
