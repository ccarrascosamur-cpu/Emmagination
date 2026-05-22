// Re-export from site-data for backward compatibility
export type {
  ServiceFaq,
  ServiceRecord as ServicePageData,
} from '../lib/site-data';

export {
  defaultServices,
  getServiceBySlug as getServiceBySlugFromData,
} from '../lib/site-data';

import { defaultSiteData, getServiceBySlug as getService } from '../lib/site-data';

// Backward-compatible re-exports
export const servicePages = defaultSiteData.services;
export function getServiceBySlug(slug: string) {
  return getService(defaultSiteData.services, slug);
}
