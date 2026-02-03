/**
 * Generates a cache key from cookies for user-specific caching.
 * Same user = same key, different users = different keys.
 */
export default function getCacheKeyFromCookies(cookieStore) {
  const accessToken = cookieStore.get('accessToken');
  return accessToken?.value || 'guest';
}
