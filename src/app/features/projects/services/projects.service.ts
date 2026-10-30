import { httpResource } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';

import { API_BASE_URL } from '../../../core/config/api-config';
import type { ApiResponse } from '../../../core/models/api-response.model';
import type { Project } from '../../../core/models/project.model';
import { StaticContentRepository } from '../../../core/repositories/content-repository';
import { PROJECTS } from '../data/projects.data';

/**
 * Demonstrates spec section 71's migration strategy end to end: Component
 * -> Feature Service -> [Static | API] Repository, with components staying
 * unchanged either way (they only ever read the `projects` signal). Static
 * by default — both environment files ship `apiBaseUrl: ''`. Point it at a
 * running portfolio-api instance (../../../../../portfolio-api) to switch
 * this service to live data with zero component changes.
 *
 * `projects` must be read reactively (never captured as a one-time
 * snapshot) — that's what lets a page update once the API response
 * actually arrives instead of freezing on the loading-state empty array.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly repository = new StaticContentRepository<Project>(
    PROJECTS,
    (project) => project.slug,
  );

  private readonly apiBaseUrl = inject(API_BASE_URL);

  private readonly apiResource = this.apiBaseUrl
    ? httpResource<ApiResponse<Project[]>>(() => `${this.apiBaseUrl}/api/projects`)
    : null;

  /**
   * hasValue() — not value() — because reading value() while the resource is
   * in an error state throws, which would take down every page showing
   * projects whenever the backend is unreachable. Loading and failed
   * requests both fall back to the static data instead.
   */
  readonly projects = computed<readonly Project[]>(() => {
    const apiResource = this.apiResource;
    return apiResource?.hasValue() ? apiResource.value().data : this.repository.getAll();
  });

  getBySlug(slug: string): Project | undefined {
    return this.projects().find((project) => project.slug === slug);
  }
}
