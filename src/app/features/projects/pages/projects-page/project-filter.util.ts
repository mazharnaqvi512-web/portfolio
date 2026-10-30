import type { Project } from '../../../../core/models/project.model';
import type { ProjectFilterValue } from '../../components/project-filter/project-filter';

/** Extracted from ProjectsPage's `filteredProjects` computed so it's testable against real Project fixtures. */
export function filterProjects(
  projects: readonly Project[],
  filter: ProjectFilterValue,
  query: string,
): Project[] {
  const normalizedQuery = query.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesFilter = filter === 'all' || project.filterTags.includes(filter);
    const matchesQuery =
      !normalizedQuery ||
      project.name.toLowerCase().includes(normalizedQuery) ||
      project.shortDescription.toLowerCase().includes(normalizedQuery) ||
      project.category.toLowerCase().includes(normalizedQuery) ||
      project.technologyStack.some((technology) =>
        technology.toLowerCase().includes(normalizedQuery),
      );
    return matchesFilter && matchesQuery;
  });
}
