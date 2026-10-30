export type ExperienceCategory = 'frontend' | 'angular' | 'enterprise' | 'ai' | 'full-stack';

export type EmploymentType = 'full-time' | 'contract' | 'freelance' | 'part-time';

export interface ExperienceLink {
  readonly label: string;
  readonly url: string;
}

export interface Experience {
  readonly company: string;
  readonly role: string;
  readonly employmentType: EmploymentType;
  readonly location: string;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly description: string;
  readonly responsibilities: readonly string[];
  readonly technologies: readonly string[];
  readonly keyContributions: readonly string[];
  readonly categories: readonly ExperienceCategory[];
  readonly companyWebsite?: string;
  readonly projectLinks?: readonly ExperienceLink[];
}
