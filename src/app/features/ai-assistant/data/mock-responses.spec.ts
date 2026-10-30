import type { Project } from '../../../core/models/project.model';
import { type KnowledgeContext, matchResponse } from './mock-responses';

const EMPTY_CONTEXT: KnowledgeContext = { projects: [], experiences: [] };

function makeProject(overrides: Partial<Project>): Project {
  return {
    name: 'Sample Project',
    slug: 'sample-project',
    shortDescription: 'A sample project.',
    category: 'dashboards',
    technologyStack: ['Angular'],
    role: 'Lead Developer',
    projectType: 'Web App',
    businessDomain: 'Enterprise',
    featured: false,
    filterTags: ['angular'],
    ...overrides,
  };
}

describe('matchResponse', () => {
  it('answers a technology-stack question using real config data', () => {
    const response = matchResponse('What technologies does Mazhar specialize in?', EMPTY_CONTEXT);
    expect(response).toContain('Angular');
  });

  it('answers an Angular-specific question using the real Technology entry', () => {
    const response = matchResponse('Tell me about his Angular experience.', EMPTY_CONTEXT);
    expect(response).toContain('Angular');
  });

  it('answers a TypeScript-specific question using the real Technology entry', () => {
    const response = matchResponse('What is his experience with TypeScript?', EMPTY_CONTEXT);
    expect(response).toContain('TypeScript');
  });

  it('answers an AI-experience question by listing the AI-category technologies', () => {
    const response = matchResponse('Tell me about his AI experience.', EMPTY_CONTEXT);
    expect(response).toContain('AI Integration');
  });

  it('answers a frontend-architecture question using APP_CONFIG data', () => {
    const response = matchResponse(
      'Tell me about his frontend architecture experience.',
      EMPTY_CONTEXT,
    );
    expect(response.length).toBeGreaterThan(0);
  });

  it('honestly states projects are still being added when the projects array is empty', () => {
    const response = matchResponse('What enterprise projects has he worked on?', EMPTY_CONTEXT);
    expect(response).toContain('actively being added');
  });

  it('names real projects, preferring featured ones, once real project data exists', () => {
    const context: KnowledgeContext = {
      projects: [
        makeProject({ name: 'Fleet Tracker', featured: true }),
        makeProject({ name: 'Invoice Portal', slug: 'invoice-portal', featured: false }),
      ],
      experiences: [],
    };
    const response = matchResponse('Show me his best projects.', context);
    expect(response).toContain('Fleet Tracker');
    expect(response).not.toContain('Invoice Portal');
  });

  it('honestly states work history is still being added when experiences is empty', () => {
    const response = matchResponse('Tell me about his career.', EMPTY_CONTEXT);
    expect(response).toContain('being added');
  });

  it('falls back to the honest "no verified information" response for an unmatched question', () => {
    const response = matchResponse('What is the capital of France?', EMPTY_CONTEXT);
    expect(response).toContain("don't have verified information");
  });
});
