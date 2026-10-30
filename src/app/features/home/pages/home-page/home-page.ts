import { Component } from '@angular/core';

import { AboutPreview } from '../../components/about-preview/about-preview';
import { FeaturedProjects } from '../../components/featured-projects/featured-projects';
import { Hero } from '../../components/hero/hero';
import { SkillsPreview } from '../../components/skills-preview/skills-preview';
import { Stats } from '../../components/stats/stats';

/**
 * Composed from reusable section components only (spec section 3) — order
 * matches Part 4 section 79's Phase B scope exactly. Availability Bar, Tech
 * Stack Preview, and every section depending on later phases' data stay out
 * until those phases exist.
 */
@Component({
  selector: 'app-home-page',
  imports: [Hero, Stats, AboutPreview, FeaturedProjects, SkillsPreview],
  template: `
    <app-hero />
    <app-stats />
    <app-about-preview />
    <app-featured-projects />
    <app-skills-preview />
  `,
})
export class HomePage {}
