import { parseContentSections } from './content-section-parser.util';

describe('parseContentSections', () => {
  it('treats content with no headings as a single untitled section', () => {
    const result = parseContentSections('Just a plain paragraph with no headings.');
    expect(result).toEqual([
      { id: 'section-0', title: null, body: 'Just a plain paragraph with no headings.' },
    ]);
  });

  it('splits on "## Heading" lines into titled sections', () => {
    const content = '## Introduction\nFirst paragraph.\n## Conclusion\nFinal paragraph.';
    const result = parseContentSections(content);
    expect(result).toEqual([
      { id: 'introduction', title: 'Introduction', body: 'First paragraph.' },
      { id: 'conclusion', title: 'Conclusion', body: 'Final paragraph.' },
    ]);
  });

  it('keeps content before the first heading as an untitled leading section', () => {
    const content = 'Intro text.\n## First Section\nBody text.';
    const result = parseContentSections(content);
    expect(result[0]).toEqual({ id: 'section-0', title: null, body: 'Intro text.' });
    expect(result[1]).toEqual({ id: 'first-section', title: 'First Section', body: 'Body text.' });
  });

  it('slugifies heading titles into ids, stripping non-alphanumeric characters', () => {
    const result = parseContentSections('## Angular & TypeScript: A Guide\nBody.');
    expect(result[0].id).toBe('angular-typescript-a-guide');
  });

  it('drops sections with neither a title nor a body', () => {
    const result = parseContentSections('');
    expect(result).toEqual([]);
  });
});
