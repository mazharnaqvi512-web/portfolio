import { Component } from '@angular/core';

import { CareerJourney } from '../../components/career-journey/career-journey';
import { FocusAreas } from '../../components/focus-areas/focus-areas';
import { Introduction } from '../../components/introduction/introduction';
import { Philosophy } from '../../components/philosophy/philosophy';

@Component({
  selector: 'app-about-page',
  imports: [Introduction, Philosophy, CareerJourney, FocusAreas],
  template: `
    <app-about-introduction />
    <app-about-philosophy />
    <app-about-career-journey />
    <app-about-focus-areas />
  `,
})
export class AboutPage {}
