import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../../core/config/api-config';
import { AI_PROVIDER } from '../../../core/models/ai-provider.model';
import { ApiAiProvider } from './api-ai-provider';
import { MockAiProvider } from './mock-ai-provider';
import { selectAiProvider } from './select-ai-provider';

function configure(apiBaseUrl: string): void {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: apiBaseUrl },
      ApiAiProvider,
      MockAiProvider,
      { provide: AI_PROVIDER, useFactory: selectAiProvider },
    ],
  });
}

describe('selectAiProvider', () => {
  it('uses the canned-answer mock when no backend is configured', () => {
    configure('');

    expect(TestBed.inject(AI_PROVIDER)).toBeInstanceOf(MockAiProvider);
  });

  it('uses the backend assistant once a backend is configured', () => {
    configure('http://api.test');

    expect(TestBed.inject(AI_PROVIDER)).toBeInstanceOf(ApiAiProvider);
  });
});
