import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { type Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ContactForm } from './contact-form';
import { ContactService } from '../../services/contact.service';

function setInputValue(element: HTMLElement, id: string, value: string): void {
  const input = element.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)!;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('ContactForm', () => {
  let fixture: ComponentFixture<ContactForm>;
  let element: HTMLElement;
  let contactServiceSpy: {
    usesApi: boolean;
    submit: ReturnType<typeof vi.fn<() => Observable<void>>>;
    openMailClient: ReturnType<typeof vi.fn>;
  };

  async function create(
    options: { usesApi?: boolean; submitResult?: Observable<void> } = {},
  ): Promise<void> {
    contactServiceSpy = {
      usesApi: options.usesApi ?? false,
      submit: vi.fn(() => options.submitResult ?? of(undefined)),
      openMailClient: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [
        provideRouter([]),
        { provide: ContactService, useValue: contactServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({}) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  function fillAndSubmitValidForm(): void {
    setInputValue(element, 'name', 'Jane Doe');
    setInputValue(element, 'email', 'jane@example.com');
    setInputValue(element, 'subject', 'Project inquiry');
    setInputValue(element, 'message', 'a'.repeat(30));
    fixture.detectChanges();

    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('renders the empty form without a success message', async () => {
    await create();
    expect(element.querySelector('form')).toBeTruthy();
    expect(element.textContent).not.toContain('Almost there');
  });

  it('blocks submission and shows validation errors while required fields are empty', async () => {
    await create();
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(contactServiceSpy.submit).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Please fix the highlighted fields');
    expect(element.textContent).toContain('Please enter your name.');
  });

  it('rejects an invalid email address', async () => {
    await create();
    setInputValue(element, 'email', 'not-an-email');
    element.querySelector<HTMLInputElement>('#email')!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(element.textContent).toContain('Please enter a valid email address.');
  });

  it('submits via ContactService and shows the mail-client success copy in mailto mode', async () => {
    await create({ usesApi: false });
    fillAndSubmitValidForm();

    expect(contactServiceSpy.submit).toHaveBeenCalledTimes(1);
    expect(element.textContent).toContain('Almost there');
    expect(element.textContent).toContain('email app');
  });

  it('shows the "received" success copy in API mode', async () => {
    await create({ usesApi: true });
    fillAndSubmitValidForm();

    expect(element.textContent).toContain('Thank you!');
    expect(element.textContent).toContain('your message has been received');
    expect(element.textContent).not.toContain('Almost there');
    expect(element.textContent).not.toContain('email app should now be open');
  });

  it('includes the hidden honeypot field in the submitted value, empty for a real visitor', async () => {
    await create();
    expect(element.querySelector('#website')?.closest('[aria-hidden="true"]')).toBeTruthy();

    fillAndSubmitValidForm();

    const [submitted] = contactServiceSpy.submit.mock.calls[0] as unknown as [{ honeypot: string }];
    expect(submitted.honeypot).toBe('');
  });

  it('keeps the form editable and shows the server validation message when the API rejects the submission', async () => {
    const rejection = new HttpErrorResponse({
      status: 400,
      error: { errors: ['subject: Subject is required'] },
    });
    await create({ usesApi: true, submitResult: throwError(() => rejection) });
    fillAndSubmitValidForm();

    expect(element.querySelector('form')).toBeTruthy();
    expect(element.textContent).toContain('Subject is required');
    expect(element.textContent).not.toContain('your message has been received');
  });

  it('shows a connectivity message and offers the mail-client fallback when the server is unreachable', async () => {
    await create({
      usesApi: true,
      submitResult: throwError(() => new HttpErrorResponse({ status: 0 })),
    });
    fillAndSubmitValidForm();

    expect(element.textContent).toContain("Couldn't reach the server");

    const fallback = Array.from(element.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Send via my email app instead'),
    );
    expect(fallback).toBeTruthy();
    fallback!.click();
    fixture.detectChanges();

    expect(contactServiceSpy.openMailClient).toHaveBeenCalledTimes(1);
    expect(element.textContent).not.toContain("Couldn't reach the server");
  });
});
