import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { GITHUB_SETTINGS } from '../../../core/config/github-config';
import { GithubService } from './github.service';

const PROFILE_URL = 'https://api.github.com/users/octocat';
const REPOS_URL = 'https://api.github.com/users/octocat/repos?sort=updated&per_page=12';

async function settle(): Promise<void> {
  TestBed.tick();
  await TestBed.inject(ApplicationRef).whenStable();
}

function rawRepo(name: string, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name,
    description: null,
    html_url: `https://github.com/octocat/${name}`,
    language: 'TypeScript',
    topics: ['angular'],
    stargazers_count: 3,
    forks_count: 1,
    updated_at: '2026-01-01T00:00:00Z',
    fork: false,
    ...overrides,
  };
}

describe('GithubService', () => {
  let service: GithubService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    // The real config is a TODO placeholder (integration disabled); these tests need it switched on.
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: GITHUB_SETTINGS,
          useValue: { username: 'octocat', enabled: true, repositoryLimit: 12 },
        },
      ],
    });
    service = TestBed.inject(GithubService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('maps the API payloads and leaves forks out', async () => {
    TestBed.tick();
    httpController.expectOne(PROFILE_URL).flush({
      login: 'octocat',
      name: 'The Octocat',
      avatar_url: 'https://avatars.test/1',
      bio: null,
      public_repos: 2,
      followers: 10,
      following: 1,
      html_url: 'https://github.com/octocat',
    });
    httpController.expectOne(REPOS_URL).flush([rawRepo('mine'), rawRepo('forked', { fork: true })]);
    await settle();

    expect(service.profile()?.login).toBe('octocat');
    expect(service.repositories().map((repo) => repo.name)).toEqual(['mine']);
    expect(service.availableLanguages()).toEqual(['TypeScript']);
  });

  it('reads as empty — without throwing — when both requests fail', async () => {
    TestBed.tick();
    httpController
      .expectOne(PROFILE_URL)
      .error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
    httpController
      .expectOne(REPOS_URL)
      .error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
    await settle();

    expect(() => service.profile()).not.toThrow();
    expect(() => service.repositories()).not.toThrow();
    expect(service.profile()).toBeUndefined();
    expect(service.repositories()).toEqual([]);
    expect(service.availableLanguages()).toEqual([]);
    expect(service.hasError()).toBe(true);
    expect(service.isRateLimited()).toBe(false);
  });

  it('reports a 403 as rate limiting rather than a generic error', async () => {
    TestBed.tick();
    httpController
      .expectOne(PROFILE_URL)
      .error(new ProgressEvent('error'), { status: 403, statusText: 'Forbidden' });
    httpController
      .expectOne(REPOS_URL)
      .error(new ProgressEvent('error'), { status: 403, statusText: 'Forbidden' });
    await settle();

    expect(service.isRateLimited()).toBe(true);
    expect(service.hasError()).toBe(false);
  });

  it('keeps the profile when only the repositories request fails', async () => {
    TestBed.tick();
    httpController.expectOne(PROFILE_URL).flush({
      login: 'octocat',
      name: null,
      avatar_url: 'https://avatars.test/1',
      bio: null,
      public_repos: 0,
      followers: 0,
      following: 0,
      html_url: 'https://github.com/octocat',
    });
    httpController
      .expectOne(REPOS_URL)
      .error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
    await settle();

    expect(service.profile()?.login).toBe('octocat');
    expect(service.repositories()).toEqual([]);
    expect(service.hasError()).toBe(true);
  });
});
