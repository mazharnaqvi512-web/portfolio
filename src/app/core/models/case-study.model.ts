export interface CaseStudy {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly relatedProjectSlug?: string;
  readonly challenge: string;
  readonly context: string;
  readonly role: string;
  readonly approach: string;
  readonly architecture: readonly string[];
  readonly implementation: string;
  readonly technicalChallenges: readonly string[];
  readonly solution: string;
  readonly performance: readonly string[];
  readonly outcome: string;
  readonly lessonsLearned: readonly string[];
}
