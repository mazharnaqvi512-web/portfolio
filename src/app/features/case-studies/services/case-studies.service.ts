import { httpResource } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';

import { API_BASE_URL } from '../../../core/config/api-config';
import type { ApiResponse } from '../../../core/models/api-response.model';
import type { CaseStudy } from '../../../core/models/case-study.model';
import { StaticContentRepository } from '../../../core/repositories/content-repository';
import { CASE_STUDIES } from '../data/case-studies.data';

/**
 * Same migration pattern as ProjectsService (spec section 71): static by
 * default, switching to portfolio-api's /api/case-studies when API_BASE_URL
 * is set, with components unchanged either way.
 *
 * `caseStudies` must be read reactively (never captured as a one-time
 * snapshot) so pages update once the API response arrives.
 */
@Injectable({ providedIn: 'root' })
export class CaseStudiesService {
  private readonly repository = new StaticContentRepository<CaseStudy>(
    CASE_STUDIES,
    (caseStudy) => caseStudy.slug,
  );
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private readonly apiResource = this.apiBaseUrl
    ? httpResource<ApiResponse<CaseStudy[]>>(() => `${this.apiBaseUrl}/api/case-studies`)
    : null;

  /** hasValue(), not value(): reading value() in an error state throws — loading and failed requests fall back to the static data instead. */
  readonly caseStudies = computed<readonly CaseStudy[]>(() => {
    const apiResource = this.apiResource;
    return apiResource?.hasValue() ? apiResource.value().data : this.repository.getAll();
  });

  getBySlug(slug: string): CaseStudy | undefined {
    return this.caseStudies().find((caseStudy) => caseStudy.slug === slug);
  }
}
