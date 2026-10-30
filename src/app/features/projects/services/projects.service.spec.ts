import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../../core/config/api-config';
import type { Project } from '../../../core/models/project.model';
import { PROJECTS } from '../data/projects.data';
import { ProjectsService } from './projects.service';

/** httpResource resolves asynchronously — wait for it to settle before asserting on its value. */
async function settle(): Promise<void> {
  TestBed.tick();
  await TestBed.inject(ApplicationRef).whenStable();
}

function makeProject(overrides: Partial<Project>): Project {
  return {
    name: 'Fleet Tracker',
    slug: 'fleet-tracker',
    shortDescription: 'Tracks fleets.',
    category: 'fleet-management',
    technologyStack: ['Angular'],
    role: 'Lead Developer',
    projectType: 'Web App',
    businessDomain: 'Logistics',
    featured: true,
    filterTags: ['angular'],
    ...overrides,
  };
}

describe('ProjectsService (static mode — no backend configured)', () => {
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectsService);
  });

  it('serves the static data when no API base URL is configured', () => {
    expect(service.projects()).toEqual(PROJECTS);
    expect(service.projects().length).toBeGreaterThan(0);
  });

  it('getBySlug finds a known project and returns undefined when nothing matches', () => {
    const [first] = PROJECTS;
    expect(service.getBySlug(first.slug)).toEqual(first);
    expect(service.getBySlug('does-not-exist')).toBeUndefined();
  });
});

describe('ProjectsService (API mode — backend configured)', () => {
  let service: ProjectsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test' },
      ],
    });
    service = TestBed.inject(ProjectsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('requests /api/projects and exposes the unwrapped data once it arrives', async () => {
    TestBed.tick();
    const project = makeProject({});
    httpController
      .expectOne('http://api.test/api/projects')
      .flush({ data: [project], success: true, message: null, errors: null });
    await settle();

    expect(service.projects()).toEqual([project]);
    expect(service.getBySlug('fleet-tracker')).toEqual(project);
  });

  it('shows the static fallback (not an error) while the request is still in flight', () => {
    TestBed.tick();
    httpController.expectOne('http://api.test/api/projects');

    expect(service.projects()).toEqual(PROJECTS);
  });

  it('degrades to the static fallback instead of throwing when the backend is down', async () => {
    TestBed.tick();
    httpController
      .expectOne('http://api.test/api/projects')
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    await settle();

    expect(() => service.projects()).not.toThrow();
    expect(service.projects()).toEqual(PROJECTS);
  });

  it('degrades to the static fallback when the backend returns a server error', async () => {
    TestBed.tick();
    httpController
      .expectOne('http://api.test/api/projects')
      .flush('boom', { status: 500, statusText: 'Server Error' });
    await settle();

    expect(() => service.projects()).not.toThrow();
    expect(service.projects()).toEqual(PROJECTS);
  });
});
