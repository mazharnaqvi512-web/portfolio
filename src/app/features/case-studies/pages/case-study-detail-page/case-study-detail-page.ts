import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import type { CaseStudy } from '../../../../core/models/case-study.model';
import { SeoService } from '../../../../core/services/seo.service';
import { ProjectsService } from '../../../projects/services/projects.service';
import { CaseStudiesService } from '../../services/case-studies.service';

interface Section {
  readonly id: string;
  readonly title: string;
  readonly content?: string;
  readonly items?: readonly string[];
}

@Component({
  selector: 'app-case-study-detail-page',
  imports: [RouterLink],
  template: `
    @if (caseStudy(); as caseStudy) {
      <article class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
        <header class="mx-auto max-w-2xl text-center">
          <p class="text-caption font-semibold uppercase tracking-wide text-accent">Case Study</p>
          <h1 class="mt-2 text-h1 font-bold text-text-primary">{{ caseStudy.title }}</h1>
          <p class="mt-4 text-body-lg text-text-secondary">{{ caseStudy.summary }}</p>
        </header>

        <nav
          class="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2"
          aria-label="Table of contents"
        >
          @for (section of sections(); track section.id) {
            <a
              [href]="'#' + section.id"
              class="text-small font-medium text-accent hover:text-accent-hover"
              >{{ section.title }}</a
            >
          }
        </nav>

        <div class="mx-auto mt-16 flex max-w-2xl flex-col gap-12">
          @for (section of sections(); track section.id) {
            <section [id]="section.id">
              <h2 class="text-h4 font-semibold text-text-primary">{{ section.title }}</h2>
              @if (section.content) {
                <p class="mt-3 text-body text-text-secondary">{{ section.content }}</p>
              }
              @if (section.items?.length) {
                <ul class="mt-3 list-disc space-y-1 pl-5 text-body text-text-secondary">
                  @for (item of section.items; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              }
            </section>
          }

          @if (caseStudy.architecture.length) {
            <section id="architecture">
              <h2 class="text-h4 font-semibold text-text-primary">Architecture</h2>
              <div class="mt-4 flex flex-col items-stretch gap-2">
                @for (layer of caseStudy.architecture; track layer; let last = $last) {
                  <div
                    class="rounded-md border border-border bg-surface px-4 py-3 text-center text-small font-medium text-text-primary"
                  >
                    {{ layer }}
                  </div>
                  @if (!last) {
                    <i class="pi pi-arrow-down self-center text-text-muted" aria-hidden="true"></i>
                  }
                }
              </div>
            </section>
          }

          @if (relatedProject(); as relatedProject) {
            <section>
              <h2 class="text-h4 font-semibold text-text-primary">Related Project</h2>
              <a
                [routerLink]="['/projects', relatedProject.slug]"
                class="mt-3 inline-block text-body font-medium text-accent hover:text-accent-hover"
              >
                {{ relatedProject.name }} →
              </a>
            </section>
          }
        </div>

        <div
          class="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-4 rounded-card border border-border bg-surface p-10 text-center"
        >
          <p class="text-body-lg font-semibold text-text-primary">
            Interested in working together?
          </p>
          <a routerLink="/contact" class="text-body font-medium text-accent hover:text-accent-hover"
            >Let's talk →</a
          >
        </div>
      </article>
    } @else {
      <div class="mx-auto flex max-w-content flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 class="text-h2 font-semibold text-text-primary">Case study not found</h1>
        <a
          routerLink="/case-studies"
          class="text-body font-medium text-accent hover:text-accent-hover"
          >← Back to case studies</a
        >
      </div>
    }
  `,
})
export class CaseStudyDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly caseStudiesService = inject(CaseStudiesService);
  private readonly projectsService = inject(ProjectsService);
  private readonly seoService = inject(SeoService);

  /** Read inside computed() (not an RxJS map) so the page also updates when API data arrives after navigation. */
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    {
      initialValue: '',
    },
  );

  protected readonly caseStudy = computed<CaseStudy | null>(
    () => this.caseStudiesService.getBySlug(this.slug()) ?? null,
  );

  constructor() {
    effect(() => {
      const caseStudy = this.caseStudy();
      if (caseStudy) {
        this.seoService.updateForWork({ title: caseStudy.title, description: caseStudy.summary });
      }
    });
  }

  protected readonly relatedProject = computed(() => {
    const slug = this.caseStudy()?.relatedProjectSlug;
    return slug ? (this.projectsService.getBySlug(slug) ?? null) : null;
  });

  protected readonly sections = computed<readonly Section[]>(() => {
    const caseStudy = this.caseStudy();
    if (!caseStudy) {
      return [];
    }
    return [
      { id: 'challenge', title: 'Challenge', content: caseStudy.challenge },
      { id: 'context', title: 'Context', content: caseStudy.context },
      { id: 'role', title: 'My Role', content: caseStudy.role },
      { id: 'approach', title: 'Approach', content: caseStudy.approach },
      { id: 'implementation', title: 'Implementation', content: caseStudy.implementation },
      {
        id: 'technical-challenges',
        title: 'Technical Challenges',
        items: caseStudy.technicalChallenges,
      },
      { id: 'solution', title: 'Solution', content: caseStudy.solution },
      { id: 'performance', title: 'Performance', items: caseStudy.performance },
      { id: 'outcome', title: 'Outcome', content: caseStudy.outcome },
      { id: 'lessons-learned', title: 'Lessons Learned', items: caseStudy.lessonsLearned },
    ].filter((section) => section.content || section.items?.length);
  });
}
