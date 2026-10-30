/**
 * Generic related-content matching (spec section 37): scores candidates by
 * how many of the given keys (tags/categories/technologies) they share with
 * the current item, and returns the top `limit` matches, strongest first.
 * Zero shared keys means zero relevance — this never falls back to
 * arbitrary items just to fill a slot ("do not create random hard-coded
 * recommendations"). The caller is responsible for excluding the current
 * item itself from `candidates` first — what counts as "self" differs per
 * use case (e.g. by slug for same-type matches, not needed for cross-type
 * matches like project → blog post).
 */
export function findRelatedByTags<T>(
  candidates: readonly T[],
  currentKeys: readonly string[],
  getKeys: (candidate: T) => readonly string[],
  limit: number,
): T[] {
  const normalizedCurrentKeys = new Set(currentKeys.map((key) => key.toLowerCase()));
  if (normalizedCurrentKeys.size === 0) {
    return [];
  }

  return candidates
    .map((candidate) => ({
      candidate,
      sharedCount: getKeys(candidate).filter((key) => normalizedCurrentKeys.has(key.toLowerCase()))
        .length,
    }))
    .filter(({ sharedCount }) => sharedCount > 0)
    .sort((a, b) => b.sharedCount - a.sharedCount)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
