import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../../core/config/api-config';
import type { Experience } from '../../../core/models/experience.model';
import { EXPERIENCES } from '../data/experience.data';
import { ExperienceService } from './experience.service';

/** httpResource resolves asynchronously — wait for it to settle before asserting on its value. */
async function settle(): Promise<void> {
  TestBed.tick();
  await TestBed.inject(ApplicationRef).whenStable();
}

const SAMPLE_EXPERIENCE: Experience = {
  company: 'Acme',
  role: 'Senior Angular Developer',
  employmentType: 'full-time',
  location: 'Remote',
  startDate: '2021-01',
  endDate: null,
  description: 'Built enterprise dashboards.',
  responsibilities: ['Led the frontend'],
  technologies: ['Angular'],
  keyContributions: ['Cut load time'],
  categories: ['angular', 'enterprise'],
};

describe('ExperienceService (static mode — no backend configured)', () => {
  it('serves the static data when no API base URL is configured', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(TestBed.inject(ExperienceService).experiences()).toEqual(EXPERIENCES);
    expect(EXPERIENCES.length).toBeGreaterThan(0);
  });
});

describe('ExperienceService (API mode — backend configured)', () => {
  let service: ExperienceService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test' },
      ],
    });
    service = TestBed.inject(ExperienceService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('requests /api/experience and exposes the unwrapped data once it arrives', async () => {
    TestBed.tick();
    httpController
      .expectOne('http://api.test/api/experience')
      .flush({ data: [SAMPLE_EXPERIENCE], success: true, message: null, errors: null });
    await settle();

    expect(service.experiences()).toEqual([SAMPLE_EXPERIENCE]);
  });

  it('shows the static fallback while the request is still in flight', () => {
    TestBed.tick();
    httpController.expectOne('http://api.test/api/experience');

    expect(service.experiences()).toEqual(EXPERIENCES);
  });

  it('degrades to the static fallback instead of throwing when the backend is down', async () => {
    TestBed.tick();
    httpController
      .expectOne('http://api.test/api/experience')
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    await settle();

    expect(() => service.experiences()).not.toThrow();
    expect(service.experiences()).toEqual(EXPERIENCES);
  });

  it('degrades to the static fallback when the backend returns a server error', async () => {
    TestBed.tick();
    httpController
      .expectOne('http://api.test/api/experience')
      .flush('boom', { status: 500, statusText: 'Server Error' });
    await settle();

    expect(() => service.experiences()).not.toThrow();
    expect(service.experiences()).toEqual(EXPERIENCES);
  });
});
