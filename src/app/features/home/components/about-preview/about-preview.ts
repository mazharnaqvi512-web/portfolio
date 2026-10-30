import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_CONFIG } from '../../../../core/config/app-config';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-about-preview',
  imports: [SectionHeader, RouterLink],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="About" title="Engineering enterprise-grade frontends" />

      <div class="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-6 text-center">
        <p class="text-body text-text-secondary">{{ summary }}</p>
        <a routerLink="/about" class="text-body font-medium text-accent hover:text-accent-hover">
          Read more about me →
        </a>
      </div>
    </section>
  `,
})
export class AboutPreview {
  protected readonly summary = `With ${APP_CONFIG.yearsOfExperience}+ years of experience as a ${APP_CONFIG.role}, I specialize in building scalable, enterprise-grade frontend applications with Angular, TypeScript and modern web architecture. My focus is shifting toward becoming an Enterprise Full Stack Engineer — combining Angular expertise with Spring Boot and AI-assisted development.`;
}
