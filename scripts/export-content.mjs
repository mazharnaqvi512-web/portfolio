/**
 * Exports the site's content (the typed data files the Angular app renders from)
 * as JSON for the Spring Boot API in ../portfolio-api, so the API serves exactly
 * what the site shows and the two can never drift through a hand-copy.
 *
 *   npm run export:content [outDir]
 *
 * outDir defaults to ../portfolio-api/src/main/resources/content. Node strips the
 * TypeScript types on import, which works because the data files only use
 * `import type`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(process.argv[2] ?? join(root, '..', 'portfolio-api', 'src', 'main', 'resources', 'content'));

const load = (relativePath) => import(pathToFileURL(join(root, 'src', 'app', relativePath)).href);

const [
  { APP_CONFIG },
  { PROJECTS },
  { EXPERIENCES },
  { CASE_STUDIES },
  { BLOG_POSTS },
  { TECHNOLOGIES },
  { EDUCATION },
] = await Promise.all([
  load('core/config/app-config.ts'),
  load('features/projects/data/projects.data.ts'),
  load('features/experience/data/experience.data.ts'),
  load('features/case-studies/data/case-studies.data.ts'),
  load('features/blog/data/blog-posts.data.ts'),
  load('core/config/technologies-config.ts'),
  load('core/config/education-config.ts'),
]);

const files = {
  'profile.json': APP_CONFIG,
  'projects.json': PROJECTS,
  'experience.json': EXPERIENCES,
  'case-studies.json': CASE_STUDIES,
  'blog-posts.json': BLOG_POSTS,
  'technologies.json': TECHNOLOGIES,
  'education.json': EDUCATION,
};

mkdirSync(outDir, { recursive: true });
for (const [name, data] of Object.entries(files)) {
  writeFileSync(join(outDir, name), `${JSON.stringify(data, null, 2)}\n`);
}

console.log(
  `export-content: wrote ${Object.keys(files).length} files to ${outDir} ` +
    `(${PROJECTS.length} projects, ${EXPERIENCES.length} experiences, ` +
    `${CASE_STUDIES.length} case studies, ${BLOG_POSTS.length} posts, ` +
    `${TECHNOLOGIES.length} technologies, ${EDUCATION.length} education entries)`,
);
