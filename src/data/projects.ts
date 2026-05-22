export type { ProjectRecord as Project } from '../lib/site-data';
export {
  defaultSiteData,
  getProjectBySlug,
  getProjectCategories,
  normalizeProject,
  normalizeSiteData,
  slugify,
} from '../lib/site-data';

import { defaultSiteData, getProjectCategories } from '../lib/site-data';

export const projects = defaultSiteData.projects;
export const categories = getProjectCategories(projects);
export const services = defaultSiteData.services;
