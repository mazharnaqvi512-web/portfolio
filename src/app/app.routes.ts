import { Routes } from '@angular/router';

import { APP_CONFIG } from './core/config/app-config';
import { ROUTE_PATHS } from './core/constants/route.constants';
import { HomePage } from './features/home/pages/home-page/home-page';
import { MainLayout } from './layout/main-layout/main-layout';

const TITLE_SUFFIX = ` | ${APP_CONFIG.name}`;

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: ROUTE_PATHS.home,
        component: HomePage,
        title: `${APP_CONFIG.name} — ${APP_CONFIG.role}`,
        data: {
          section: 'Home',
          seo: {
            description: `${APP_CONFIG.name} is a ${APP_CONFIG.role} with ${APP_CONFIG.yearsOfExperience}+ years of experience building scalable, high-performance enterprise applications with Angular and modern web technologies.`,
            structuredDataType: 'person',
          },
        },
      },
      {
        path: ROUTE_PATHS.about,
        loadComponent: () =>
          import('./features/about/pages/about-page/about-page').then((c) => c.AboutPage),
        title: `About${TITLE_SUFFIX}`,
        data: {
          section: 'About',
          seo: {
            description: `Background, career goals and current focus areas for ${APP_CONFIG.name}, a ${APP_CONFIG.role} working toward becoming an Enterprise Full Stack Engineer.`,
            structuredDataType: 'person',
          },
        },
      },
      {
        path: ROUTE_PATHS.experience,
        loadComponent: () =>
          import('./features/experience/pages/experience-page/experience-page').then(
            (c) => c.ExperiencePage,
          ),
        title: `Experience${TITLE_SUFFIX}`,
        data: {
          section: 'Experience',
          seo: {
            description: `Professional experience and employment history for ${APP_CONFIG.name}.`,
          },
        },
      },
      {
        path: ROUTE_PATHS.projects,
        loadComponent: () =>
          import('./features/projects/pages/projects-page/projects-page').then(
            (c) => c.ProjectsPage,
          ),
        title: `Projects${TITLE_SUFFIX}`,
        data: {
          section: 'Projects',
          seo: {
            description: `A selection of Angular and enterprise web development projects built by ${APP_CONFIG.name}.`,
          },
        },
      },
      {
        path: ROUTE_PATHS.projectDetails,
        loadComponent: () =>
          import('./features/projects/pages/project-details-page/project-details-page').then(
            (c) => c.ProjectDetailsPage,
          ),
        title: `Project${TITLE_SUFFIX}`,
        data: {
          section: 'Projects',
          seo: {
            description: `Project details, technical approach and outcomes from ${APP_CONFIG.name}'s portfolio.`,
            structuredDataType: 'creative-work',
          },
        },
      },
      {
        path: ROUTE_PATHS.caseStudies,
        loadComponent: () =>
          import('./features/case-studies/pages/case-studies-page/case-studies-page').then(
            (c) => c.CaseStudiesPage,
          ),
        title: `Case Studies${TITLE_SUFFIX}`,
        data: {
          section: 'Case Studies',
          seo: {
            description: `In-depth case studies covering problems solved and impact delivered by ${APP_CONFIG.name}.`,
          },
        },
      },
      {
        path: ROUTE_PATHS.caseStudyDetails,
        loadComponent: () =>
          import('./features/case-studies/pages/case-study-detail-page/case-study-detail-page').then(
            (c) => c.CaseStudyDetailPage,
          ),
        title: `Case Study${TITLE_SUFFIX}`,
        data: {
          section: 'Case Studies',
          seo: {
            description: `A detailed case study of a real engineering problem and its solution, from ${APP_CONFIG.name}'s work.`,
            structuredDataType: 'creative-work',
          },
        },
      },
      {
        path: ROUTE_PATHS.skills,
        loadComponent: () =>
          import('./features/skills/pages/skills-page/skills-page').then((c) => c.SkillsPage),
        title: `Skills${TITLE_SUFFIX}`,
        data: {
          section: 'Skills',
          seo: {
            description: `Technical skills and technologies ${APP_CONFIG.name} works with, organized by category and proficiency.`,
          },
        },
      },
      {
        path: ROUTE_PATHS.services,
        loadComponent: () =>
          import('./features/services/pages/services-page/services-page').then(
            (c) => c.ServicesPage,
          ),
        title: `Services${TITLE_SUFFIX}`,
        data: {
          section: 'Services',
          seo: {
            description: `Enterprise Angular development services offered by ${APP_CONFIG.name}, from architecture to delivery.`,
          },
        },
      },
      {
        path: ROUTE_PATHS.blog,
        loadComponent: () =>
          import('./features/blog/pages/blog-page/blog-page').then((c) => c.BlogPage),
        title: `Blog${TITLE_SUFFIX}`,
        data: {
          section: 'Blog',
          seo: {
            description: `Articles and technical writing by ${APP_CONFIG.name} on Angular, enterprise frontend development and software engineering.`,
          },
        },
      },
      {
        path: ROUTE_PATHS.blogPost,
        loadComponent: () =>
          import('./features/blog/pages/blog-post-page/blog-post-page').then((c) => c.BlogPostPage),
        title: `Blog${TITLE_SUFFIX}`,
        data: {
          section: 'Blog',
          seo: {
            description: `An article by ${APP_CONFIG.name} on Angular, enterprise frontend development and software engineering.`,
            structuredDataType: 'article',
          },
        },
      },
      {
        path: ROUTE_PATHS.github,
        loadComponent: () =>
          import('./features/github/pages/github-page/github-page').then((c) => c.GithubPage),
        title: `GitHub${TITLE_SUFFIX}`,
        data: {
          section: 'GitHub',
          seo: {
            description: `Live GitHub activity, repositories and open-source contributions from ${APP_CONFIG.name}.`,
          },
        },
      },
      {
        path: ROUTE_PATHS.resume,
        loadComponent: () =>
          import('./features/resume/pages/resume-page/resume-page').then((c) => c.ResumePage),
        title: `Resume${TITLE_SUFFIX}`,
        data: {
          section: 'Resume',
          seo: {
            description: `View or download the resume of ${APP_CONFIG.name}, ${APP_CONFIG.role}.`,
          },
        },
      },
      {
        path: ROUTE_PATHS.contact,
        loadComponent: () =>
          import('./features/contact/pages/contact-page/contact-page').then((c) => c.ContactPage),
        title: `Contact${TITLE_SUFFIX}`,
        data: {
          section: 'Contact',
          seo: {
            description: `Get in touch with ${APP_CONFIG.name} about Angular development work and opportunities.`,
          },
        },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/not-found-page/not-found-page').then(
            (component) => component.NotFoundPage,
          ),
        title: `Page not found${TITLE_SUFFIX}`,
        data: { seo: { robots: 'noindex' } },
      },
    ],
  },
];
