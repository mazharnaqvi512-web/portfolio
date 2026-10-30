import { httpResource } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';

import { API_BASE_URL } from '../../../core/config/api-config';
import type { ApiResponse } from '../../../core/models/api-response.model';
import type { Experience } from '../../../core/models/experience.model';
import { StaticContentRepository } from '../../../core/repositories/content-repository';
import { EXPERIENCES } from '../data/experience.data';

/**
 * Same migration pattern as ProjectsService (spec section 71): static by
 * default, switching to portfolio-api's /api/experience when API_BASE_URL is
 * set, with components unchanged either way. No getBySlug — Experience has
 * no slug/id and nothing looks one up individually.
 *
 * `experiences` must be read reactively (never captured as a one-time
 * snapshot) so pages update once the API response arrives.
 */
@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private readonly repository = new StaticContentRepository<Experience>(EXPERIENCES);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private readonly apiResource = this.apiBaseUrl
    ? httpResource<ApiResponse<Experience[]>>(() => `${this.apiBaseUrl}/api/experience`)
    : null;

  /** hasValue(), not value(): reading value() in an error state throws — loading and failed requests fall back to the static data instead. */
  readonly experiences = computed<readonly Experience[]>(() => {
    const apiResource = this.apiResource;
    return apiResource?.hasValue() ? apiResource.value().data : this.repository.getAll();
  });
}
