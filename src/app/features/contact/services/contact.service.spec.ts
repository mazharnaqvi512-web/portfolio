import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../../core/config/api-config';
import type { ContactFormValue } from '../../../core/models/contact-form.model';
import { ContactService } from './contact.service';

const SAMPLE_VALUE: ContactFormValue = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: '',
  subject: 'Project inquiry',
  message: 'A message that is definitely long enough to pass validation.',
  projectType: '',
  budget: '',
  timeline: '',
};

describe('ContactService (mailto mode — no backend configured)', () => {
  let service: ContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContactService);
  });

  it('does not use the API when no base URL is configured', () => {
    expect(service.usesApi).toBe(false);
  });

  it('builds a mailto: URL addressed to the configured contact email', () => {
    const url = service.buildMailtoUrl({ ...SAMPLE_VALUE, message: 'Hello there' });

    expect(url.startsWith('mailto:')).toBe(true);
    expect(url).toContain(`subject=${encodeURIComponent('Project inquiry')}`);
  });

  it('encodes the subject and body with encodeURIComponent, preserving spaces (not "+")', () => {
    const url = service.buildMailtoUrl({
      ...SAMPLE_VALUE,
      subject: 'Hello there',
      message: 'A message with spaces',
    });

    expect(url).toContain(encodeURIComponent('Hello there'));
    expect(url).not.toContain('Hello+there');
    expect(url).toContain(encodeURIComponent('A message with spaces'));
  });

  it('includes optional fields in the body only when present', () => {
    const withCompany: ContactFormValue = {
      ...SAMPLE_VALUE,
      company: 'Acme Inc',
      message: 'Message body',
    };
    const withoutCompany: ContactFormValue = { ...withCompany, company: '' };

    expect(service.buildMailtoUrl(withCompany)).toContain(encodeURIComponent('Company: Acme Inc'));
    expect(service.buildMailtoUrl(withoutCompany)).not.toContain('Company%3A');
  });
});

describe('ContactService (API mode — backend configured)', () => {
  let service: ContactService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test' },
      ],
    });
    service = TestBed.inject(ContactService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('uses the API when a base URL is configured', () => {
    expect(service.usesApi).toBe(true);
  });

  it('POSTs the form value to /api/contact and completes on success', () => {
    let completed = false;
    service.submit(SAMPLE_VALUE).subscribe({ complete: () => (completed = true) });

    const request = httpController.expectOne('http://api.test/api/contact');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(SAMPLE_VALUE);
    request.flush({ data: null, success: true, message: null, errors: null });

    expect(completed).toBe(true);
  });

  it('propagates HTTP errors to the subscriber', () => {
    let status: number | undefined;
    service
      .submit(SAMPLE_VALUE)
      .subscribe({ error: (error: { status: number }) => (status = error.status) });

    httpController
      .expectOne('http://api.test/api/contact')
      .flush(
        {
          data: null,
          success: false,
          message: 'Validation failed',
          errors: ['name: Name is required'],
        },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(status).toBe(400);
  });
});
