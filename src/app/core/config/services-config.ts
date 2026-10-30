import type { Service } from '../models/service.model';

/** The 9 real services from spec section 29 — generic professional-services copy, not client claims. */
export const SERVICES: readonly Service[] = [
  {
    slug: 'angular-development',
    title: 'Angular Development',
    description:
      'End-to-end Angular application development, from architecture through delivery, using standalone components, signals and modern control flow.',
    deliverables: [
      'New Angular application setup and architecture',
      'Feature development with reusable, typed components',
      'Migration from legacy Angular versions',
      'Code review and best-practice guidance',
    ],
    technologies: ['Angular', 'TypeScript', 'RxJS', 'PrimeNG'],
    idealClient:
      'Teams building or maintaining an Angular product who need senior frontend expertise.',
  },
  {
    slug: 'enterprise-frontend-development',
    title: 'Enterprise Frontend Development',
    description:
      'Frontend development for enterprise-scale applications, with an emphasis on maintainability, performance and long-term architecture.',
    deliverables: [
      'Feature-oriented Angular architecture',
      'State management strategy',
      'Design-system-driven component libraries',
      'Cross-team collaboration on frontend standards',
    ],
    technologies: ['Angular', 'TypeScript', 'NgRx', 'Tailwind CSS'],
    idealClient: 'Enterprises with complex, multi-team frontend codebases.',
  },
  {
    slug: 'frontend-architecture',
    title: 'Frontend Architecture',
    description:
      'Designing scalable frontend architecture — folder structure, state management, routing and build strategy — that holds up as an application and team grow.',
    deliverables: [
      'Architecture assessment and recommendations',
      'Core/shared/feature folder structure design',
      'State management and data-flow strategy',
      'Build and lazy-loading strategy',
    ],
    technologies: ['Angular', 'TypeScript', 'RxJS', 'Signals'],
    idealClient: 'Teams starting a new product or restructuring a growing codebase.',
  },
  {
    slug: 'ui-implementation',
    title: 'UI Implementation',
    description:
      'Translating design files into pixel-accurate, responsive, accessible interfaces using a themeable component library and utility-first styling.',
    deliverables: [
      'Design-to-code implementation from Figma',
      'Responsive layouts across breakpoints',
      'Themeable, design-token-driven styling',
      'Accessible markup and interaction states',
    ],
    technologies: ['Angular', 'PrimeNG', 'Tailwind CSS', 'Figma'],
    idealClient: 'Teams with finished designs that need precise, production-ready implementation.',
  },
  {
    slug: 'api-integration',
    title: 'API Integration',
    description:
      'Connecting Angular applications to REST APIs with clean data-access layers, proper error handling and typed models.',
    deliverables: [
      'Typed API client and data-access services',
      'Error handling and loading/empty states',
      'Authentication and interceptor setup',
      'API contract collaboration with backend teams',
    ],
    technologies: ['Angular', 'RxJS', 'TypeScript', 'REST APIs'],
    idealClient: 'Teams integrating a frontend with an existing or in-progress backend.',
  },
  {
    slug: 'performance-optimization',
    title: 'Performance Optimization',
    description:
      'Auditing and improving Angular application performance — bundle size, load time and runtime rendering — without sacrificing functionality.',
    deliverables: [
      'Bundle size and lazy-loading audit',
      'Change detection and rendering optimization',
      'Core Web Vitals improvements',
      'Deferred, below-the-fold loading strategy',
    ],
    technologies: ['Angular', 'Signals', 'Deferrable Views'],
    idealClient:
      'Teams with an existing Angular app experiencing slow load times or sluggish interactions.',
  },
  {
    slug: 'code-review',
    title: 'Code Review',
    description:
      'Structured code review focused on architecture, maintainability, performance and Angular best practices — not just style.',
    deliverables: [
      'Pull request review with actionable feedback',
      'Architecture and pattern consistency checks',
      'Performance and accessibility review',
      'Mentorship-oriented explanations, not just fixes',
    ],
    technologies: ['Angular', 'TypeScript', 'RxJS'],
    idealClient: 'Teams wanting a senior second opinion on their Angular codebase.',
  },
  {
    slug: 'ai-integration',
    title: 'AI Integration',
    description:
      'Exploring practical ways to integrate AI capabilities into Angular applications, from AI-assisted development workflows to in-product AI features.',
    deliverables: [
      'AI-assisted development workflow setup',
      'Prompt-driven feature prototyping',
      'Provider-agnostic AI integration architecture',
      'Guidance on where AI genuinely adds product value',
    ],
    technologies: ['AI Integration', 'Prompt Engineering', 'Angular'],
    idealClient:
      'Teams exploring AI features who want a frontend-first, pragmatic approach — this is an active, ongoing learning area for me, not a decade of specialist experience.',
  },
  {
    slug: 'technical-consulting',
    title: 'Technical Consulting',
    description:
      'Advisory support on frontend technology decisions, team practices and Angular ecosystem choices.',
    deliverables: [
      'Technology and library evaluation',
      'Frontend team process recommendations',
      'Technical debt assessment',
      'One-off architecture or planning sessions',
    ],
    technologies: ['Angular', 'TypeScript', 'Frontend Architecture'],
    idealClient:
      'Teams and founders who need an outside senior perspective before committing to a direction.',
  },
];
