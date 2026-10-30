import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { APP_CONFIG } from '../../../../core/config/app-config';
import { RESUME_CONFIG } from '../../../../core/config/resume-config';
import { EDUCATION } from '../../../../core/config/education-config';
import { TECHNOLOGIES } from '../../../../core/config/technologies-config';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { ExperienceTimeline } from '../../../experience/components/experience-timeline/experience-timeline';
import { ExperienceService } from '../../../experience/services/experience.service';
import { ProjectCard } from '../../../projects/components/project-card/project-card';
import { ProjectsService } from '../../../projects/services/projects.service';

/** The resume is a summary — it shows the featured work, the Projects page has the rest. */
const MAX_RESUME_PROJECTS = 3;

@Component({
  selector: 'app-resume-page',
  imports: [
    RouterLink,
    ButtonDirective,
    SectionHeader,
    EmptyState,
    ExperienceTimeline,
    ProjectCard,
  ],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Resume" title="Professional summary" [level]="1" />

      <div class="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-6 text-center">
        <p class="text-body text-text-secondary">{{ summary }}</p>

        @if (pdfUrl) {
          <a
            pButton
            [href]="pdfUrl"
            target="_blank"
            rel="noopener noreferrer"
            icon="pi pi-download"
            (click)="analyticsService.trackResumeDownload()"
          >
            Download PDF
          </a>
        }
      </div>

      <div class="mx-auto mt-16 max-w-2xl">
        <h2 class="text-h4 font-semibold text-text-primary">Experience</h2>
        <div class="mt-6">
          @if (hasExperience()) {
            <app-experience-timeline [experiences]="experiences()" />
          } @else {
            <app-empty-state
              icon="pi pi-briefcase"
              message="Detailed work experience is being added here soon."
              actionLabel="See the full Experience page"
              actionRoute="/experience"
            />
          }
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-2xl">
        <h2 class="text-h4 font-semibold text-text-primary">Skills</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          @for (technology of featuredTechnologies; track technology.name) {
            <span
              class="rounded-pill border border-border bg-surface px-4 py-2 text-small font-medium text-text-secondary"
            >
              {{ technology.name }}
            </span>
          }
        </div>
        <a
          routerLink="/skills"
          class="mt-4 inline-block text-small font-medium text-accent hover:text-accent-hover"
        >
          View full skills dashboard →
        </a>
      </div>

      <div class="mx-auto mt-16 max-w-2xl">
        <h2 class="text-h4 font-semibold text-text-primary">Projects</h2>
        <div class="mt-6">
          @if (hasProjects()) {
            <div class="grid grid-cols-1 gap-5">
              @for (project of projects(); track project.slug) {
                <app-project-card [project]="project" />
              }
            </div>
            <a
              routerLink="/projects"
              class="mt-4 inline-block text-small font-medium text-accent hover:text-accent-hover"
            >
              View all projects →
            </a>
          } @else {
            <app-empty-state
              icon="pi pi-folder-open"
              message="Projects are being published here soon."
              actionLabel="View all projects"
              actionRoute="/projects"
            />
          }
        </div>
      </div>

      @if (education.length) {
        <div class="mx-auto mt-16 max-w-2xl">
          <h2 class="text-h4 font-semibold text-text-primary">Education</h2>
          <ul class="mt-6 flex flex-col gap-4">
            @for (item of education; track item.degree) {
              <li class="rounded-card border border-border bg-surface p-6">
                <p class="text-body-lg font-semibold text-text-primary">{{ item.degree }}</p>
                <p class="mt-1 text-small text-text-secondary">
                  {{ item.institution }}, {{ item.location }}
                </p>
              </li>
            }
          </ul>
        </div>
      }

      <div
        class="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-4 rounded-card border border-border bg-surface p-10 text-center"
      >
        <p class="text-body-lg font-semibold text-text-primary">Want the full picture?</p>
        <a routerLink="/contact" class="text-body font-medium text-accent hover:text-accent-hover"
          >Get in touch →</a
        >
      </div>
    </section>
  `,
})
export class ResumePage {
  protected readonly analyticsService = inject(AnalyticsService);
  private readonly experienceService = inject(ExperienceService);
  private readonly projectsService = inject(ProjectsService);

  protected readonly pdfUrl = RESUME_CONFIG.pdfUrl;
  protected readonly education = EDUCATION;
  protected readonly experiences = this.experienceService.experiences;
  protected readonly hasExperience = computed(() => this.experiences().length > 0);
  protected readonly projects = computed(() =>
    this.projectsService
      .projects()
      .filter((project) => project.featured)
      .slice(0, MAX_RESUME_PROJECTS),
  );
  protected readonly hasProjects = computed(() => this.projects().length > 0);
  protected readonly featuredTechnologies = TECHNOLOGIES.filter(
    (technology) => technology.featured,
  );

  protected readonly summary = `${APP_CONFIG.role} with ${APP_CONFIG.yearsOfExperience}+ years of experience building enterprise-grade Angular applications, currently focused on ${APP_CONFIG.currentFocus.toLowerCase()} and expanding into full-stack and AI-assisted development.`;
}
