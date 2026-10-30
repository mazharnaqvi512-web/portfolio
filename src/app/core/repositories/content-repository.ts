/**
 * Minimal in-memory content abstraction. Feature services build on
 * StaticContentRepository instead of hand-rolling `.find()` over a data
 * array, so that swapping static data for a real API/CMS later only means
 * changing this file's shape (e.g. to return Observable<T>) and each
 * feature service's implementation — components, which only ever inject
 * the feature service, stay untouched.
 */
export interface ContentRepository<T> {
  getAll(): readonly T[];
  getBySlug(slug: string): T | undefined;
}

export class StaticContentRepository<T> implements ContentRepository<T> {
  constructor(
    private readonly items: readonly T[],
    private readonly slugSelector?: (item: T) => string,
  ) {}

  getAll(): readonly T[] {
    return this.items;
  }

  getBySlug(slug: string): T | undefined {
    return this.slugSelector
      ? this.items.find((item) => this.slugSelector!(item) === slug)
      : undefined;
  }
}
