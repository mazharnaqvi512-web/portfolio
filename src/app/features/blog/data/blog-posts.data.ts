import type { BlogPost } from '../../../core/models/blog-post.model';

/**
 * Intentionally empty — no real articles exist yet (confirmed: same
 * empty-state pattern as projects/experience/case-studies, not fabricated).
 * Read only through blog.service.ts, never imported directly by UI, so the
 * source can move to an API/CMS later without touching any component.
 */
export const BLOG_POSTS: readonly BlogPost[] = [];
