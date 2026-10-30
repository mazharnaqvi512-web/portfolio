/**
 * 7 real categories — matches spec section 17's 8-category taxonomy minus
 * "Databases," which has no real entries anywhere in the spec and is
 * omitted rather than invented.
 */
export type TechnologyCategory =
  | 'frontend-engineering'
  | 'state-management'
  | 'ui-frameworks'
  | 'backend'
  | 'ai'
  | 'cloud-devops'
  | 'development-tools';

export type SkillLevel = 'primary' | 'strong' | 'working-knowledge' | 'learning';

export interface Technology {
  readonly name: string;
  readonly category: TechnologyCategory;
  readonly level: SkillLevel;
  readonly description: string;
  readonly icon?: string;
  readonly featured: boolean;
}
