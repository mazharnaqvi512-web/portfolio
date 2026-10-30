/** Single source of truth for site-wide personal/brand info — never duplicate these values in components. */
export const APP_CONFIG = {
  name: 'Syed Mazhar Hussain',
  role: 'Senior Angular Developer',
  tagline:
    'Building scalable, high-performance enterprise applications with Angular, TypeScript and modern web technologies.',
  /** Whole years since the first role in experience.data.ts (Dec 2020) — launch-readiness.spec.ts fails if this overstates it. */
  yearsOfExperience: 5,
  careerGoal: 'Become an Enterprise Full Stack Engineer using Angular, Spring Boot and AI.',
  currentFocus: 'Enterprise Frontend Development',
  futureFocus: ['Java', 'Spring Boot', 'Microservices', 'Cloud', 'AI'] as readonly string[],
  availabilityStatus: 'Available for Remote Opportunities',
} as const;
