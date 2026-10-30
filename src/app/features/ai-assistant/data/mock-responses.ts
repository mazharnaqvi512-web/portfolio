import { APP_CONFIG } from '../../../core/config/app-config';
import { SERVICES } from '../../../core/config/services-config';
import { TECHNOLOGIES } from '../../../core/config/technologies-config';
import type { Experience } from '../../../core/models/experience.model';
import type { Project } from '../../../core/models/project.model';
import type { SkillLevel, TechnologyCategory } from '../../../core/models/technology.model';

/** Injected by MockAiProvider from ProjectsService/ExperienceService — never imported from data files directly (spec section 30: repository abstraction, not raw data access). */
export interface KnowledgeContext {
  readonly projects: readonly Project[];
  readonly experiences: readonly Experience[];
}

interface ResponseRule {
  readonly keywords: readonly string[];
  readonly respond: (context: KnowledgeContext) => string;
}

const LEVEL_DESCRIPTIONS: Record<SkillLevel, string> = {
  primary: 'a primary',
  strong: 'a strong',
  'working-knowledge': 'a working-knowledge',
  learning: 'a developing',
};

const featuredTechnologyNames = TECHNOLOGIES.filter((technology) => technology.featured)
  .map((technology) => technology.name)
  .join(', ');

const serviceTitles = SERVICES.map((service) => service.title).join(', ');

/**
 * Clearly states when information is unavailable rather than guessing
 * (spec section 8, rule 12) — never expose more than this when nothing
 * verified matches the question.
 */
const FALLBACK_RESPONSE =
  "I don't have verified information about that yet. Please contact Mazhar directly for more details — or try one of the suggested questions.";

function describeTechnology(name: string): string {
  const technology = TECHNOLOGIES.find(
    (candidate) => candidate.name.toLowerCase() === name.toLowerCase(),
  );
  if (!technology) {
    return FALLBACK_RESPONSE;
  }
  return `${APP_CONFIG.name} has ${LEVEL_DESCRIPTIONS[technology.level]} level with ${technology.name}: ${technology.description}`;
}

function describeCategory(category: TechnologyCategory, label: string): string {
  const matches = TECHNOLOGIES.filter((technology) => technology.category === category);
  if (!matches.length) {
    return FALLBACK_RESPONSE;
  }
  const names = matches.map((technology) => technology.name).join(', ');
  return `In ${label}, ${APP_CONFIG.name} is working with: ${names}. You can see the full skills breakdown on the Skills page.`;
}

function describeProjects(projects: readonly Project[]): string {
  if (!projects.length) {
    return 'Project case studies are actively being added to this site. In the meantime, feel free to ask about his skills, services, or get in touch directly.';
  }
  const featured = projects.filter((project) => project.featured);
  const highlighted = featured.length ? featured : projects;
  return `He's worked on ${projects.length} project(s), including ${highlighted.map((project) => project.name).join(', ')} — take a look at the Projects page for details.`;
}

function describeExperience(experiences: readonly Experience[]): string {
  return experiences.length
    ? 'You can see his full work history on the Experience page.'
    : 'Detailed work history is being added to the Experience page soon. In the meantime, the About page covers his background and focus areas.';
}

/**
 * Ordered keyword matcher — first match wins, so more specific rules are
 * listed before broader ones (e.g. "angular experience" before the generic
 * "experience" catch-all). Every response is built from data that's already
 * real (APP_CONFIG/TECHNOLOGIES/SERVICES, plus the projects/experiences
 * passed in via KnowledgeContext), never invented. Where that data is
 * itself still empty or a placeholder, the response says so honestly
 * instead of making something up.
 */
const RESPONSE_RULES: readonly ResponseRule[] = [
  {
    keywords: ['who is', 'about mazhar', 'tell me about him', 'introduce'],
    respond: () =>
      `${APP_CONFIG.name} is a ${APP_CONFIG.role} with ${APP_CONFIG.yearsOfExperience}+ years of experience. ${APP_CONFIG.tagline}`,
  },
  {
    keywords: ['strongest technolog', 'specialize', 'tech stack', 'skills', 'technologies does he'],
    respond: () =>
      `His core technologies are ${featuredTechnologyNames}. You can see the full skills breakdown on the Skills page.`,
  },
  {
    keywords: ['angular experience', 'how much angular', 'angular skill'],
    respond: () => describeTechnology('Angular'),
  },
  {
    keywords: ['typescript experience', 'experience with typescript', 'typescript skill'],
    respond: () => describeTechnology('TypeScript'),
  },
  {
    keywords: ['ai experience', 'experience with ai', 'artificial intelligence', 'ai integration'],
    respond: () => describeCategory('ai', 'AI'),
  },
  {
    keywords: ['frontend architecture', 'architecture experience'],
    respond: () =>
      `${APP_CONFIG.name}'s current focus is ${APP_CONFIG.currentFocus.toLowerCase()}, applying enterprise frontend architecture patterns as a ${APP_CONFIG.role}.`,
  },
  {
    keywords: [
      'enterprise project',
      'projects has he',
      'what has he built',
      'portfolio',
      'best project',
      'show me his',
    ],
    respond: (context) => describeProjects(context.projects),
  },
  {
    keywords: ['available', 'remote work', 'open to work', 'freelance'],
    respond: () =>
      `${APP_CONFIG.availabilityStatus}. Head to the Contact page to start a conversation.`,
  },
  {
    keywords: ['services does he offer', 'what can he do', 'what does he do', 'help with'],
    respond: () =>
      `He offers: ${serviceTitles}. Check the Services page for what each one includes.`,
  },
  {
    keywords: ['contact', 'reach him', 'get in touch', 'email him'],
    respond: () =>
      `The best way to reach him is through the Contact page — the form there goes straight to his inbox.`,
  },
  {
    keywords: ['hire', 'work together', 'available for a project'],
    respond: () =>
      `Absolutely — the Contact page has a form where you can share a bit about your project and he'll follow up from there.`,
  },
  {
    keywords: ['experience', 'career', 'work history', 'employer'],
    respond: (context) => describeExperience(context.experiences),
  },
];

export function matchResponse(message: string, context: KnowledgeContext): string {
  const normalized = message.toLowerCase();
  const rule = RESPONSE_RULES.find((candidate) =>
    candidate.keywords.some((keyword) => normalized.includes(keyword)),
  );
  return rule ? rule.respond(context) : FALLBACK_RESPONSE;
}
