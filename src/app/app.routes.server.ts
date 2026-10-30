import { RenderMode, ServerRoute } from '@angular/ssr';

import { ROUTE_PATHS } from './core/constants/route.constants';
import { BLOG_POSTS } from './features/blog/data/blog-posts.data';
import { CASE_STUDIES } from './features/case-studies/data/case-studies.data';
import { PROJECTS } from './features/projects/data/projects.data';

/**
 * The site ships as a fully static build (angular.json `outputMode: "static"`),
 * so it can be hosted on any free static host. Every page is therefore
 * prerendered at build time; there is no render-on-request mode.
 */
const STATIC_ROUTES = [
  ROUTE_PATHS.home,
  ROUTE_PATHS.about,
  ROUTE_PATHS.experience,
  ROUTE_PATHS.projects,
  ROUTE_PATHS.caseStudies,
  ROUTE_PATHS.skills,
  ROUTE_PATHS.services,
  ROUTE_PATHS.blog,
  ROUTE_PATHS.resume,
  ROUTE_PATHS.contact,
];

export const serverRoutes: ServerRoute[] = [
  ...STATIC_ROUTES.map((path): ServerRoute => ({ path, renderMode: RenderMode.Prerender })),
  // One prerendered page per known slug, read from the same static data the
  // pages render from. Add a project/post to its data file and the next build
  // prerenders it. (Unknown slugs fall through to the host's 404 page.)
  {
    path: ROUTE_PATHS.projectDetails,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map((project) => ({ slug: project.slug })),
  },
  {
    path: ROUTE_PATHS.caseStudyDetails,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => CASE_STUDIES.map((caseStudy) => ({ slug: caseStudy.slug })),
  },
  {
    path: ROUTE_PATHS.blogPost,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      BLOG_POSTS.filter((post) => post.status === 'published').map((post) => ({ slug: post.slug })),
  },
  // Depends on a live external API (GitHub), so it renders in the browser;
  // the host serves index.csr.html for it (see public/_redirects).
  { path: ROUTE_PATHS.github, renderMode: RenderMode.Client },
  // Not-found page, emitted as 404.html for the host to serve on unknown URLs.
  { path: '**', renderMode: RenderMode.Prerender },
];
