import { Injectable, inject } from '@angular/core';
import { type Observable, delay, of } from 'rxjs';

import type { AiProvider } from '../../../core/models/ai-provider.model';
import { ExperienceService } from '../../experience/services/experience.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { matchResponse } from '../data/mock-responses';

const MOCK_RESPONSE_DELAY_MS = 700;

@Injectable()
export class MockAiProvider implements AiProvider {
  private readonly projectsService = inject(ProjectsService);
  private readonly experienceService = inject(ExperienceService);

  sendMessage(message: string): Observable<string> {
    const response = matchResponse(message, {
      projects: this.projectsService.projects(),
      experiences: this.experienceService.experiences(),
    });
    return of(response).pipe(delay(MOCK_RESPONSE_DELAY_MS));
  }
}
