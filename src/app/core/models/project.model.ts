/** Business-domain categories from spec section 20. */
export type ProjectCategory =
  | 'enterprise-applications'
  | 'fintech'
  | 'healthcare'
  | 'fleet-management'
  | 'expense-management'
  | 'dashboards'
  | 'ai-ocr'
  | 'saas'
  | 'ui-engineering';

/** Filter chip values from spec section 21 (`all` is UI-only, not stored per-project). */
export type ProjectFilterTag =
  'angular' | 'enterprise' | 'dashboard' | 'ai' | 'healthcare' | 'fintech' | 'other';

export interface ProjectScreenshot {
  readonly url: string;
  readonly alt: string;
  readonly caption?: string;
}

export interface Project {
  readonly name: string;
  readonly slug: string;
  readonly shortDescription: string;
  readonly category: ProjectCategory;
  readonly technologyStack: readonly string[];
  readonly role: string;
  readonly projectType: string;
  readonly businessDomain: string;
  readonly thumbnail?: string;
  readonly featured: boolean;
  readonly filterTags: readonly ProjectFilterTag[];
  readonly liveDemoUrl?: string;
  readonly githubUrl?: string;
  readonly caseStudySlug?: string;
  readonly videoUrl?: string;

  // Project Details-only content — optional since not every project needs full case-study depth immediately.
  readonly overview?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly keyFeatures?: readonly string[];
  /** Ordered layer labels for the generic architecture flow diagram, e.g. ['Frontend', 'State Management', 'Services', 'REST APIs', 'Backend', 'Database']. */
  readonly architecture?: readonly string[];
  readonly technicalChallenges?: readonly string[];
  readonly performanceNotes?: readonly string[];
  readonly results?: readonly string[];
  readonly lessonsLearned?: readonly string[];
  readonly screenshots?: readonly ProjectScreenshot[];
}
