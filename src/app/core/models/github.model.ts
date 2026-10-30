/** Fields actually available from GitHub's public REST API — nothing invented beyond what the API returns. */
export interface GithubProfile {
  readonly login: string;
  readonly name: string | null;
  readonly avatarUrl: string;
  readonly bio: string | null;
  readonly publicRepos: number;
  readonly followers: number;
  readonly following: number;
  readonly htmlUrl: string;
}

export interface GithubRepository {
  readonly name: string;
  readonly description: string | null;
  readonly htmlUrl: string;
  readonly language: string | null;
  readonly topics: readonly string[];
  readonly stargazersCount: number;
  readonly forksCount: number;
  readonly updatedAt: string;
}

/** Raw shapes as GitHub's API actually returns them (snake_case) — mapped to the camelCase models above in GithubService. */
export interface GithubProfileApiResponse {
  readonly login: string;
  readonly name: string | null;
  readonly avatar_url: string;
  readonly bio: string | null;
  readonly public_repos: number;
  readonly followers: number;
  readonly following: number;
  readonly html_url: string;
}

export interface GithubRepositoryApiResponse {
  readonly name: string;
  readonly description: string | null;
  readonly html_url: string;
  readonly language: string | null;
  readonly topics?: readonly string[];
  readonly stargazers_count: number;
  readonly forks_count: number;
  readonly updated_at: string;
  readonly fork: boolean;
}
