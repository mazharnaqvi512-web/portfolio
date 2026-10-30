import { StaticContentRepository } from './content-repository';

interface Item {
  readonly slug: string;
  readonly name: string;
}

describe('StaticContentRepository', () => {
  const items: readonly Item[] = [
    { slug: 'a', name: 'Alpha' },
    { slug: 'b', name: 'Beta' },
  ];

  it('getAll returns every item', () => {
    const repository = new StaticContentRepository<Item>(items, (item) => item.slug);
    expect(repository.getAll()).toEqual(items);
  });

  it('getBySlug finds an item by its selected slug', () => {
    const repository = new StaticContentRepository<Item>(items, (item) => item.slug);
    expect(repository.getBySlug('b')).toEqual({ slug: 'b', name: 'Beta' });
  });

  it('getBySlug returns undefined for an unknown slug', () => {
    const repository = new StaticContentRepository<Item>(items, (item) => item.slug);
    expect(repository.getBySlug('missing')).toBeUndefined();
  });

  it('getBySlug returns undefined when no slugSelector is provided', () => {
    const repository = new StaticContentRepository<Item>(items);
    expect(repository.getBySlug('a')).toBeUndefined();
  });
});
