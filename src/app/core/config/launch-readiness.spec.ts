import { EXPERIENCES } from '../../features/experience/data/experience.data';
import { PROJECTS } from '../../features/projects/data/projects.data';
import { environment } from '../../../environments/environment';
import { APP_CONFIG } from './app-config';
import { EDUCATION } from './education-config';
import { GITHUB_CONFIG } from './github-config';
import { SITE_CONFIG } from './site-config';
import { SOCIAL_LINKS } from './social-config';
import { TECHNOLOGIES } from './technologies-config';

/** Guards against shipping the site with placeholder values or inconsistent content. */
describe('launch readiness', () => {
  it('has no TODO placeholders left in the public configuration', () => {
    const values = [
      SITE_CONFIG.baseUrl,
      SITE_CONFIG.defaultOgImage,
      GITHUB_CONFIG.username,
      ...SOCIAL_LINKS.map((link) => link.url),
    ];
    for (const value of values) {
      expect(value).not.toContain('TODO_');
      expect(value).not.toContain('example.com');
    }
    expect(GITHUB_CONFIG.enabled).toBe(true);
  });

  it('serves the site and share image over https from the same origin', () => {
    expect(SITE_CONFIG.baseUrl.startsWith('https://')).toBe(true);
    expect(SITE_CONFIG.baseUrl.endsWith('/')).toBe(false);
    expect(SITE_CONFIG.defaultOgImage.startsWith(`${SITE_CONFIG.baseUrl}/`)).toBe(true);
  });

  it('keeps the mock AI assistant off in the shipped environment', () => {
    expect(environment.featureFlags.aiAssistant).toBe(false);
  });

  it('has unique, well-formed projects', () => {
    const slugs = PROJECTS.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const project of PROJECTS) {
      expect(project.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(project.filterTags.length).toBeGreaterThan(0);
      expect(project.technologyStack.length).toBeGreaterThan(0);
    }
  });

  it('lists experience newest first with valid, ordered dates and exactly one current role', () => {
    const monthFormat = /^\d{4}-(0[1-9]|1[0-2])$/;
    for (const experience of EXPERIENCES) {
      expect(experience.startDate).toMatch(monthFormat);
      if (experience.endDate !== null) {
        expect(experience.endDate).toMatch(monthFormat);
        expect(experience.endDate >= experience.startDate).toBe(true);
      }
    }
    const starts = EXPERIENCES.map((experience) => experience.startDate);
    expect(starts).toEqual([...starts].sort().reverse());
    expect(EXPERIENCES.filter((experience) => experience.endDate === null)).toHaveLength(1);
  });

  it('claims no more experience than the career history supports', () => {
    const earliestStart = [...EXPERIENCES].map((experience) => experience.startDate).sort()[0];
    const [year, month] = earliestStart.split('-').map(Number);
    const now = new Date();
    const yearsWorked = now.getFullYear() - year + (now.getMonth() + 1 - month) / 12;
    expect(APP_CONFIG.yearsOfExperience).toBeLessThanOrEqual(Math.floor(yearsWorked));
  });

  it('has education and unique skill names', () => {
    expect(EDUCATION.length).toBeGreaterThan(0);
    const names = TECHNOLOGIES.map((technology) => technology.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
