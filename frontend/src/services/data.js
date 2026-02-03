import setCookieOnReq from '@/utils/setCookieOnReq';
import getCacheKeyFromCookies from '@/utils/getCacheKeyFromCookies';
import { cookies } from 'next/headers';
import { getCachedUsersApi } from './authService';
import { getCachedCommentsApi } from './commentService';
import { getPosts } from './postServices';

export async function fetchCardData() {
  try {
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    const cacheKey = getCacheKeyFromCookies(cookieStore);

    const data = await Promise.all([getCachedUsersApi(options, cacheKey).catch(() => ({ users: [] })), getCachedCommentsApi(options, cacheKey).catch(() => ({ commentsCount: 0 })), getPosts('limit=1').catch(() => ({ posts: [], totalCount: 0 }))]);

    const numberOfUsers = Number(data[0]?.users?.length ?? 0);
    const numberOfPosts = Number(data[2]?.totalCount ?? 0);
    const numberOfComments = Number(data[1]?.commentsCount ?? 0);

    return {
      numberOfComments,
      numberOfPosts,
      numberOfUsers,
    };
  } catch (error) {
    console.error('Error fetching card data:', error);
    return {
      numberOfComments: 0,
      numberOfPosts: 0,
      numberOfUsers: 0,
    };
  }
}

export async function fetchLatestPosts() {
  try {
    const posts = await getPosts('sort=latest&limit=5');
    return posts;
  } catch (error) {
    throw new Error(error?.reponse?.data?.message);
  }
}
