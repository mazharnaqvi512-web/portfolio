import type { GithubRepository } from '../../../../core/models/github.model';
import { sortAndFilterRepositories } from './repository-sort-filter.util';

function makeRepo(overrides: Partial<GithubRepository>): GithubRepository {
  return {
    name: 'repo',
    description: null,
    htmlUrl: 'https://github.com/user/repo',
    language: null,
    topics: [],
    stargazersCount: 0,
    forksCount: 0,
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('sortAndFilterRepositories', () => {
  const repos: GithubRepository[] = [
    makeRepo({
      name: 'zeta',
      language: 'TypeScript',
      stargazersCount: 5,
      updatedAt: '2024-01-01T00:00:00Z',
    }),
    makeRepo({
      name: 'alpha',
      language: 'JavaScript',
      stargazersCount: 20,
      updatedAt: '2024-03-01T00:00:00Z',
    }),
    makeRepo({
      name: 'mid',
      language: 'TypeScript',
      stargazersCount: 10,
      updatedAt: '2024-02-01T00:00:00Z',
    }),
  ];

  it('sorts by most recently updated by default', () => {
    const result = sortAndFilterRepositories(repos, 'updated', 'all');
    expect(result.map((r) => r.name)).toEqual(['alpha', 'mid', 'zeta']);
  });

  it('sorts by star count descending', () => {
    const result = sortAndFilterRepositories(repos, 'stars', 'all');
    expect(result.map((r) => r.name)).toEqual(['alpha', 'mid', 'zeta']);
  });

  it('sorts by name alphabetically', () => {
    const result = sortAndFilterRepositories(repos, 'name', 'all');
    expect(result.map((r) => r.name)).toEqual(['alpha', 'mid', 'zeta']);
  });

  it('filters by exact language match', () => {
    const result = sortAndFilterRepositories(repos, 'updated', 'TypeScript');
    expect(result.map((r) => r.name)).toEqual(['mid', 'zeta']);
  });

  it('returns everything when the filter is "all"', () => {
    expect(sortAndFilterRepositories(repos, 'updated', 'all').length).toBe(3);
  });

  it('does not mutate the input array', () => {
    const original = [...repos];
    sortAndFilterRepositories(repos, 'name', 'all');
    expect(repos).toEqual(original);
  });
});
