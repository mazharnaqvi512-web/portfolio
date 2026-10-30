import type { Project } from '../../../../core/models/project.model';
import { filterProjects } from './project-filter.util';

function makeProject(overrides: Partial<Project>): Project {
  return {
    name: 'Sample Project',
    slug: 'sample-project',
    shortDescription: 'A sample enterprise dashboard.',
    category: 'dashboards',
    technologyStack: ['Angular', 'TypeScript'],
    role: 'Lead Developer',
    projectType: 'Web App',
    businessDomain: 'Enterprise',
    featured: false,
    filterTags: ['angular', 'dashboard'],
    ...overrides,
  };
}

describe('filterProjects', () => {
  const projects: Project[] = [
    makeProject({
      slug: 'fleet-tracker',
      name: 'Fleet Tracker',
      filterTags: ['angular', 'enterprise'],
    }),
    makeProject({
      slug: 'health-portal',
      name: 'Health Portal',
      shortDescription: 'A patient scheduling system.',
      category: 'healthcare',
      filterTags: ['healthcare'],
      technologyStack: ['React'],
    }),
  ];

  it('returns every project when filter is "all" and query is empty', () => {
    expect(filterProjects(projects, 'all', '')).toEqual(projects);
  });

  it('filters by filter tag', () => {
    const result = filterProjects(projects, 'healthcare', '');
    expect(result).toEqual([projects[1]]);
  });

  it('filters by case-insensitive query against name', () => {
    const result = filterProjects(projects, 'all', 'fleet');
    expect(result).toEqual([projects[0]]);
  });

  it('filters by query against technology stack', () => {
    const result = filterProjects(projects, 'all', 'react');
    expect(result).toEqual([projects[1]]);
  });

  it('combines filter tag and query, requiring both to match', () => {
    const result = filterProjects(projects, 'healthcare', 'fleet');
    expect(result).toEqual([]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterProjects(projects, 'all', 'nonexistent')).toEqual([]);
  });
});
