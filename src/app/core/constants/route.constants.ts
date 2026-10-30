/** Route path segments, relative to their parent — no magic strings scattered across routes/nav config. */
export const ROUTE_PATHS = {
  home: '',
  about: 'about',
  experience: 'experience',
  projects: 'projects',
  projectDetails: 'projects/:slug',
  caseStudies: 'case-studies',
  caseStudyDetails: 'case-studies/:slug',
  skills: 'skills',
  services: 'services',
  blog: 'blog',
  blogPost: 'blog/:slug',
  github: 'github',
  resume: 'resume',
  contact: 'contact',
} as const;

export type RouteSection = Exclude<
  keyof typeof ROUTE_PATHS,
  'projectDetails' | 'caseStudyDetails' | 'blogPost'
>;
