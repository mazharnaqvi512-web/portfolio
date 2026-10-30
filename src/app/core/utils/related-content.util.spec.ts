import { findRelatedByTags } from './related-content.util';

interface Item {
  readonly id: string;
  readonly keys: readonly string[];
}

describe('findRelatedByTags', () => {
  const items: Item[] = [
    { id: 'a', keys: ['Angular', 'TypeScript'] },
    { id: 'b', keys: ['Angular', 'RxJS', 'TypeScript'] },
    { id: 'c', keys: ['Java', 'Spring Boot'] },
    { id: 'd', keys: [] },
  ];

  it('orders candidates by number of shared keys, strongest match first', () => {
    const result = findRelatedByTags(
      items,
      ['angular', 'typescript', 'rxjs'],
      (item) => item.keys,
      3,
    );
    expect(result.map((item) => item.id)).toEqual(['b', 'a']);
  });

  it('excludes candidates with zero shared keys rather than padding the result', () => {
    const result = findRelatedByTags(items, ['angular'], (item) => item.keys, 10);
    expect(result.map((item) => item.id)).toEqual(['a', 'b']);
    expect(result.find((item) => item.id === 'c')).toBeUndefined();
  });

  it('matches case-insensitively', () => {
    const result = findRelatedByTags(items, ['ANGULAR'], (item) => item.keys, 10);
    expect(result.map((item) => item.id)).toContain('a');
  });

  it('respects the limit', () => {
    const result = findRelatedByTags(
      items,
      ['angular', 'typescript', 'rxjs'],
      (item) => item.keys,
      1,
    );
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('b');
  });

  it('returns an empty array when the current item has no keys', () => {
    expect(findRelatedByTags(items, [], (item) => item.keys, 10)).toEqual([]);
  });

  it('returns an empty array when nothing shares a key', () => {
    const result = findRelatedByTags(items, ['python'], (item) => item.keys, 10);
    expect(result).toEqual([]);
  });
});
