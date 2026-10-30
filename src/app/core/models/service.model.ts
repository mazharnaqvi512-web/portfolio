export interface Service {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly deliverables: readonly string[];
  readonly technologies: readonly string[];
  readonly idealClient: string;
}
