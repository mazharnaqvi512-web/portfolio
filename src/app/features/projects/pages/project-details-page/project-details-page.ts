import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PrimeTemplate } from 'primeng/api';
import { GalleriaModule } from 'primeng/galleria';

import type { BlogPost } from '../../../../core/models/blog-post.model';
import type { CaseStudy } from '../../../../core/models/case-study.model';
import type { Project, ProjectScreenshot } from '../../../../core/models/project.model';
import { SeoService } from '../../../../core/services/seo.service';
import { findRelatedByTags } from '../../../../core/utils/related-content.util';
import { CaseStudiesService } from '../../../case-studies/services/case-studies.service';
import { BlogService } from '../../../blog/services/blog.service';
import { ProjectsService } from '../../services/projects.service';

const RELATED_BLOG_POSTS_LIMIT = 3;

interface TextSection {
  readonly title: string;
  readonly content: string;
}

interface ListSection {
  readonly title: string;
  readonly items: readonly string[];
}

@Component({
  selector: 'app-project-details-page',
  imports: [RouterLink, GalleriaModule, PrimeTemplate],
  template: `
    @if (project(); as project) {
      <article class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
        <header class="mx-auto max-w-2xl text-center">
          <p class="text-caption font-semibold uppercase tracking-wide text-accent">
            {{ project.businessDomain }}
          </p>
          <h1 class="mt-2 text-h1 font-bold text-text-primary">{{ project.name }}</h1>
          <p class="mt-4 text-body-lg text-text-secondary">{{ project.shortDescription }}</p>

          <div class="mt-6 flex flex-wrap justify-center gap-2">
            @for (technology of project.technologyStack; track technology) {
              <span
                class="rounded-pill border border-border px-3 py-1 text-caption text-text-secondary"
                >{{ technology }}</span
              >
            }
          </div>

          <div class="mt-6 flex flex-wrap justify-center gap-4 text-small font-medium">
            @if (project.liveDemoUrl) {
              <a
                [href]="project.liveDemoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent hover:text-accent-hover"
                >Live demo</a
              >
            }
            @if (project.githubUrl) {
              <a
                [href]="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent hover:text-accent-hover"
                >GitHub</a
              >
            }
            @if (project.caseStudySlug) {
              <a
                [routerLink]="['/case-studies', project.caseStudySlug]"
                class="text-accent hover:text-accent-hover"
                >Read the case study</a
              >
            }
          </div>
        </header>

        <div class="mx-auto mt-16 flex max-w-2xl flex-col gap-12">
          @for (section of textSections(); track section.title) {
            <section>
              <h2 class="text-h4 font-semibold text-text-primary">{{ section.title }}</h2>
              <p class="mt-3 text-body text-text-secondary">{{ section.content }}</p>
            </section>
          }

          @if (project.architecture?.length) {
            <section>
              <h2 class="text-h4 font-semibold text-text-primary">Architecture</h2>
              <div class="mt-4 flex flex-col items-stretch gap-2">
                @for (layer of project.architecture; track layer; let last = $last) {
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

          @for (section of listSections(); track section.title) {
            <section>
              <h2 class="text-h4 font-semibold text-text-primary">{{ section.title }}</h2>
              <ul class="mt-3 list-disc space-y-1 pl-5 text-body text-text-secondary">
                @for (item of section.items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </section>
          }
        </div>

        @if (screenshots().length) {
          <div class="mx-auto mt-16 max-w-2xl">
            <h2 class="text-h4 font-semibold text-text-primary">Screenshots</h2>
            <p-galleria
              class="mt-4 block"
              [value]="screenshots()"
              [showThumbnails]="true"
              [showIndicators]="true"
            >
              <ng-template pTemplate="item" let-screenshot>
                <img [src]="screenshot.url" [alt]="screenshot.alt" class="w-full rounded-md" />
              </ng-template>
              <ng-template pTemplate="thumbnail" let-screenshot>
                <img
                  [src]="screenshot.url"
                  [alt]="screenshot.alt"
                  class="h-16 w-24 rounded-sm object-cover"
                />
              </ng-template>
              <ng-template pTemplate="caption" let-screenshot>
                @if (screenshot.caption) {
                  <p class="text-small text-white">{{ screenshot.caption }}</p>
                }
              </ng-template>
            </p-galleria>
          </div>
        }

        @if (relatedSkills().length) {
          <div class="mx-auto mt-16 max-w-2xl">
            <h2 class="text-h4 font-semibold text-text-primary">Related Skills</h2>
            <div class="mt-4 flex flex-wrap gap-2">
              @for (skill of relatedSkills(); track skill) {
                <span
                  class="rounded-pill border border-border bg-surface px-3 py-1 text-caption text-text-secondary"
                  >{{ skill }}</span
                >
              }
            </div>
            <a
              routerLink="/skills"
              class="mt-4 inline-block text-small font-medium text-accent hover:text-accent-hover"
            >
              View full skills dashboard →
            </a>
          </div>
        }

        @if (relatedCaseStudies().length) {
          <div class="mx-auto mt-10 max-w-2xl">
            <h2 class="text-h4 font-semibold text-text-primary">Related Case Studies</h2>
            <div class="mt-4 flex flex-col gap-2">
              @for (related of relatedCaseStudies(); track related.slug) {
                <a
                  [routerLink]="['/case-studies', related.slug]"
                  class="text-body font-medium text-accent hover:text-accent-hover"
                >
                  {{ related.title }} →
                </a>
              }
            </div>
          </div>
        }

        @if (relatedBlogPosts().length) {
          <div class="mx-auto mt-10 max-w-2xl">
            <h2 class="text-h4 font-semibold text-text-primary">Related Blog Posts</h2>
            <div class="mt-4 flex flex-col gap-2">
              @for (related of relatedBlogPosts(); track related.slug) {
                <a
                  [routerLink]="['/blog', related.slug]"
                  class="text-body font-medium text-accent hover:text-accent-hover"
                >
                  {{ related.title }} →
                </a>
              }
            </div>
          </div>
        }
      </article>
    } @else {
      <div class="mx-auto flex max-w-content flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 class="text-h2 font-semibold text-text-primary">Project not found</h1>
        <a routerLink="/projects" class="text-body font-medium text-accent hover:text-accent-hover"
          >← Back to projects</a
        >
      </div>
    }
  `,
})
export class ProjectDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly projectsService = inject(ProjectsService);
  private readonly caseStudiesService = inject(CaseStudiesService);
  private readonly blogService = inject(BlogService);
  private readonly seoService = inject(SeoService);

  /** A plain RxJS map() here would only re-run when the route param changes — it wouldn't pick up API data that arrives after navigation. Reading projectsService.getBySlug() inside a computed() instead means Angular re-runs this whenever either the slug or the (reactive) projects list changes. */
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    {
      initialValue: '',
    },
  );

  protected readonly project = computed<Project | null>(
    () => this.projectsService.getBySlug(this.slug()) ?? null,
  );

  constructor() {
    effect(() => {
      const project = this.project();
      if (project) {
        this.seoService.updateForWork({
          title: project.name,
          description: project.shortDescription,
          ogImage: project.thumbnail,
        });
      }
    });
  }

  protected readonly textSections = computed<readonly TextSection[]>(() => {
    const project = this.project();
    if (!project) {
      return [];
    }
    const sections: TextSection[] = [{ title: 'My Role', content: project.role }];
    if (project.overview) sections.push({ title: 'Overview', content: project.overview });
    if (project.problem) sections.push({ title: 'The Problem', content: project.problem });
    if (project.solution) sections.push({ title: 'The Solution', content: project.solution });
    return sections;
  });

  protected readonly screenshots = computed<ProjectScreenshot[]>(() => [
    ...(this.project()?.screenshots ?? []),
  ]);

  protected readonly listSections = computed<readonly ListSection[]>(() => {
    const project = this.project();
    if (!project) {
      return [];
    }
    const sections: ListSection[] = [];
    if (project.keyFeatures?.length)
      sections.push({ title: 'Key Features', items: project.keyFeatures });
    if (project.technicalChallenges?.length)
      sections.push({ title: 'Technical Challenges', items: project.technicalChallenges });
    if (project.performanceNotes?.length)
      sections.push({ title: 'Performance', items: project.performanceNotes });
    if (project.results?.length)
      sections.push({ title: 'Results & Impact', items: project.results });
    if (project.lessonsLearned?.length)
      sections.push({ title: 'Lessons Learned', items: project.lessonsLearned });
    return sections;
  });

  protected readonly relatedSkills = computed<readonly string[]>(
    () => this.project()?.technologyStack ?? [],
  );

  /** relatedProjectSlug is an explicit, editor-set link from case study → project — the reverse lookup here is exact, not fuzzy-matched. */
  protected readonly relatedCaseStudies = computed<readonly CaseStudy[]>(() => {
    const project = this.project();
    if (!project) {
      return [];
    }
    return this.caseStudiesService
      .caseStudies()
      .filter((caseStudy) => caseStudy.relatedProjectSlug === project.slug);
  });

  protected readonly relatedBlogPosts = computed<readonly BlogPost[]>(() => {
    const project = this.project();
    if (!project) {
      return [];
    }
    return findRelatedByTags(
      this.blogService.posts(),
      project.technologyStack,
      (post) => post.tags,
      RELATED_BLOG_POSTS_LIMIT,
    );
  });
}
