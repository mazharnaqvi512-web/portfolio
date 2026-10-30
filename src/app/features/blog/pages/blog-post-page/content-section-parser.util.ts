export interface ContentSection {
  readonly id: string;
  readonly title: string | null;
  readonly body: string;
}

/**
 * Splits plain-text content on "## Heading" lines into sections — enough
 * for a real table of contents without installing a markdown renderer for
 * content that doesn't exist yet (see blog-post.model.ts).
 *
 * This is the seam where real markdown-readiness plugs in later (spec
 * section 35: Markdown → Parser → Sanitized HTML → Article Renderer): swap
 * this function for a real parser (e.g. `marked`) feeding a sanitizer (e.g.
 * `dompurify`) into an `[innerHTML]` renderer, once real long-form articles
 * with rich formatting exist. Not done now because (a) there's no real
 * content to justify it, and (b) the current template renders `body` via
 * plain `{{ }}` interpolation, which Angular auto-escapes — there is no
 * unsanitized-HTML surface today, so adding a sanitization dependency ahead
 * of the renderer that would need it is premature (spec section 64).
 */
export function parseContentSections(content: string): ContentSection[] {
  const parts = content.split(/\n(?=## )/);
  return parts
    .map((part, index) => {
      const match = /^## (.+)\n?([\s\S]*)$/.exec(part);
      if (!match) {
        return { id: `section-${index}`, title: null, body: part.trim() };
      }
      const title = match[1].trim();
      return {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        body: match[2].trim(),
      };
    })
    .filter((section) => section.title || section.body);
}
