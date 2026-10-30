import { Component } from '@angular/core';

import { APP_CONFIG } from '../../../../core/config/app-config';

@Component({
  selector: 'app-about-introduction',
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[2fr_1fr]">
        <div class="flex flex-col gap-4">
          <p class="text-caption font-semibold uppercase tracking-wide text-accent">About</p>
          <h1 class="text-h1 font-bold text-text-primary">{{ name }}</h1>
          <p class="text-body-lg text-text-secondary">{{ summary }}</p>
        </div>

        <div class="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
          <div>
            <p class="text-caption uppercase tracking-wide text-text-muted">Role</p>
            <p class="text-body font-medium text-text-primary">{{ role }}</p>
          </div>
          <div>
            <p class="text-caption uppercase tracking-wide text-text-muted">Experience</p>
            <p class="text-body font-medium text-text-primary">{{ yearsOfExperience }}+ years</p>
          </div>
          <div>
            <p class="text-caption uppercase tracking-wide text-text-muted">Current focus</p>
            <p class="text-body font-medium text-text-primary">{{ currentFocus }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Introduction {
  protected readonly name = APP_CONFIG.name;
  protected readonly role = APP_CONFIG.role;
  protected readonly yearsOfExperience = APP_CONFIG.yearsOfExperience;
  protected readonly currentFocus = APP_CONFIG.currentFocus;

  protected readonly summary = `I'm a ${APP_CONFIG.role} with ${APP_CONFIG.yearsOfExperience}+ years of experience designing and building enterprise-grade frontend applications. My work centers on Angular, TypeScript and modern web architecture — with a particular focus on component design, state management and performance at scale. I'm actively expanding into backend development with Java and Spring Boot, and exploring how AI can be integrated into everyday engineering workflows, with the goal of becoming an Enterprise Full Stack Engineer.`;
}
