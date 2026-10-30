import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';

import { SERVICES } from '../../../../core/config/services-config';
import type { ContactFormState } from '../../../../core/models/contact-form.model';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { describeContactError } from '../../services/contact-error.util';
import { ContactService } from '../../services/contact.service';

const MESSAGE_MIN_LENGTH = 20;
const MESSAGE_MAX_LENGTH = 2000;

interface ContactFormControls {
  name: FormControl<string>;
  email: FormControl<string>;
  company: FormControl<string>;
  subject: FormControl<string>;
  message: FormControl<string>;
  projectType: FormControl<string>;
  budget: FormControl<string>;
  timeline: FormControl<string>;
  honeypot: FormControl<string>;
}

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, ButtonDirective],
  template: `
    @if (state() === 'success') {
      <div class="rounded-card border border-border bg-surface p-8 text-center">
        <i class="pi pi-check-circle text-h1 text-accent" aria-hidden="true"></i>
        <p class="mt-4 text-body-lg font-semibold text-text-primary">
          {{ usesApi ? 'Thank you!' : 'Almost there!' }}
        </p>
        <p class="mt-2 text-body text-text-secondary">
          @if (usesApi) {
            Thanks — your message has been received.
          } @else {
            Your email app should now be open with your message ready — just hit send to reach me
            directly.
          }
        </p>
        <button
          type="button"
          class="mt-4 text-small font-medium text-accent hover:text-accent-hover"
          (click)="state.set('idle')"
        >
          Send another message
        </button>
      </div>
    } @else {
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        (focusin)="trackStart()"
        novalidate
        class="flex flex-col gap-5"
      >
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label for="name" class="text-small font-medium text-text-primary">Name *</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-text-primary focus:border-accent focus:outline-none"
            />
            @if (isInvalid('name')) {
              <p class="mt-1 text-caption text-red-600">Please enter your name.</p>
            }
          </div>

          <div>
            <label for="email" class="text-small font-medium text-text-primary">Email *</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-text-primary focus:border-accent focus:outline-none"
            />
            @if (isInvalid('email')) {
              <p class="mt-1 text-caption text-red-600">Please enter a valid email address.</p>
            }
          </div>
        </div>

        <div>
          <label for="company" class="text-small font-medium text-text-primary">Company</label>
          <input
            id="company"
            type="text"
            formControlName="company"
            class="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-text-primary focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label for="subject" class="text-small font-medium text-text-primary">Subject *</label>
          <input
            id="subject"
            type="text"
            formControlName="subject"
            class="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-text-primary focus:border-accent focus:outline-none"
          />
          @if (isInvalid('subject')) {
            <p class="mt-1 text-caption text-red-600">Please enter a subject.</p>
          }
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label for="projectType" class="text-small font-medium text-text-primary"
              >Project Type</label
            >
            <input
              id="projectType"
              type="text"
              formControlName="projectType"
              class="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label for="budget" class="text-small font-medium text-text-primary">Budget</label>
            <input
              id="budget"
              type="text"
              formControlName="budget"
              class="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label for="timeline" class="text-small font-medium text-text-primary">Timeline</label>
            <input
              id="timeline"
              type="text"
              formControlName="timeline"
              class="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label for="message" class="text-small font-medium text-text-primary">Message *</label>
          <textarea
            id="message"
            formControlName="message"
            rows="5"
            class="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-text-primary focus:border-accent focus:outline-none"
          ></textarea>
          @if (isInvalid('message')) {
            <p class="mt-1 text-caption text-red-600">
              Message must be between {{ minLength }} and {{ maxLength }} characters.
            </p>
          }
        </div>

        <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label for="website">Website</label>
          <input
            id="website"
            type="text"
            formControlName="honeypot"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        @if (state() === 'error') {
          <p class="text-small text-red-600">Please fix the highlighted fields before sending.</p>
        }

        @if (submitError(); as errorMessage) {
          <div class="flex flex-col items-start gap-2 text-small text-red-600" role="alert">
            <p>{{ errorMessage }}</p>
            <button
              type="button"
              class="font-medium text-accent hover:text-accent-hover"
              (click)="sendViaEmailInstead()"
            >
              Send via my email app instead
            </button>
          </div>
        }

        <button pButton type="submit" [loading]="state() === 'submitting'" class="self-start">
          Send Message
        </button>
      </form>
    }
  `,
})
export class ContactForm {
  private readonly contactService = inject(ContactService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly route = inject(ActivatedRoute);

  private hasTrackedStart = false;

  protected readonly minLength = MESSAGE_MIN_LENGTH;
  protected readonly maxLength = MESSAGE_MAX_LENGTH;
  protected readonly state = signal<ContactFormState>('idle');
  protected readonly submitError = signal<string | null>(null);
  protected readonly usesApi = this.contactService.usesApi;

  protected readonly form = new FormGroup<ContactFormControls>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    company: new FormControl('', { nonNullable: true }),
    subject: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(MESSAGE_MIN_LENGTH),
        Validators.maxLength(MESSAGE_MAX_LENGTH),
      ],
    }),
    projectType: new FormControl(this.resolveProjectTypeFromQuery(), { nonNullable: true }),
    budget: new FormControl('', { nonNullable: true }),
    timeline: new FormControl('', { nonNullable: true }),
    honeypot: new FormControl('', { nonNullable: true }),
  });

  protected isInvalid(controlName: keyof ContactFormControls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.state.set('error');
      return;
    }

    this.submitError.set(null);
    this.state.set('submitting');
    this.contactService.submit(this.form.getRawValue()).subscribe({
      next: () => {
        this.analyticsService.trackContactSubmit();
        this.state.set('success');
      },
      error: (error: unknown) => {
        this.submitError.set(describeContactError(error));
        this.state.set('idle');
      },
    });
  }

  protected sendViaEmailInstead(): void {
    this.submitError.set(null);
    this.contactService.openMailClient(this.form.getRawValue());
  }

  protected trackStart(): void {
    if (this.hasTrackedStart) {
      return;
    }
    this.hasTrackedStart = true;
    this.analyticsService.trackContactStart();
  }

  private resolveProjectTypeFromQuery(): string {
    const slug = this.route.snapshot.queryParamMap.get('service');
    if (!slug) {
      return '';
    }
    return SERVICES.find((service) => service.slug === slug)?.title ?? '';
  }
}
