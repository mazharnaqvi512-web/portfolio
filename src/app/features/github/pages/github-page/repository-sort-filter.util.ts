import type { GithubRepository } from '../../../../core/models/github.model';

export type RepositorySortValue = 'updated' | 'stars' | 'name';
export type RepositoryLanguageFilterValue = string | 'all';

export function sortAndFilterRepositories(
  repositories: readonly GithubRepository[],
  sortBy: RepositorySortValue,
  language: RepositoryLanguageFilterValue,
): GithubRepository[] {
  const filtered =
    language === 'all'
      ? repositories
      : repositories.filter((repository) => repository.language === language);

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'stars':
        return b.stargazersCount - a.stargazersCount;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updated':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });
}
