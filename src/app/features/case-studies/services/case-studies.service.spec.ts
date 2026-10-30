import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../../core/config/api-config';
import type { CaseStudy } from '../../../core/models/case-study.model';
import { CaseStudiesService } from './case-studies.service';

/** httpResource resolves asynchronously — wait for it to settle before asserting on its value. */
async function settle(): Promise<void> {
  TestBed.tick();
  await TestBed.inject(ApplicationRef).whenStable();
}

const SAMPLE_CASE_STUDY: CaseStudy = {
  slug: 'dashboard-migration',
  title: 'Dashboard migration',
  summary: 'Moved a legacy dashboard to Angular.',
  relatedProjectSlug: 'fleet-tracker',
  challenge: 'Slow legacy UI.',
  context: 'Enterprise client.',
  role: 'Lead developer',
  approach: 'Incremental migration.',
  architecture: ['Frontend', 'API'],
  implementation: 'Standalone components.',
  technicalChallenges: ['State sync'],
  solution: 'Signals.',
  performance: ['Faster first paint'],
  outcome: 'Shipped.',
  lessonsLearned: ['Migrate early'],
};

describe('CaseStudiesService (static mode — no backend configured)', () => {
  it('falls back to the static (empty) source when no API base URL is configured', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(CaseStudiesService);

    expect(service.caseStudies()).toEqual([]);
    expect(service.getBySlug('anything')).toBeUndefined();
  });
});

describe('CaseStudiesService (API mode — backend configured)', () => {
  let service: CaseStudiesService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test' },
      ],
    });
    service = TestBed.inject(CaseStudiesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('requests /api/case-studies and exposes the unwrapped data once it arrives', async () => {
    TestBed.tick();
    httpController
      .expectOne('http://api.test/api/case-studies')
      .flush({ data: [SAMPLE_CASE_STUDY], success: true, message: null, errors: null });
    await settle();

    expect(service.caseStudies()).toEqual([SAMPLE_CASE_STUDY]);
    expect(service.getBySlug('dashboard-migration')).toEqual(SAMPLE_CASE_STUDY);
  });

  it('degrades to the static fallback instead of throwing when the backend is down', async () => {
    TestBed.tick();
    httpController
      .expectOne('http://api.test/api/case-studies')
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    await settle();

    expect(() => service.caseStudies()).not.toThrow();
    expect(service.caseStudies()).toEqual([]);
  });
});
