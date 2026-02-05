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

    const data = await Promise.all([
      getCachedUsersApi(options, cacheKey).catch((err) => ({
        users: [],
        forbidden: err?.response?.status === 403,
      })),
      getCachedCommentsApi(options, cacheKey).catch(() => ({ commentsCount: 0 })),
      getPosts('limit=1&scope=dashboard', options).catch(() => ({ posts: [], totalCount: 0 })),
    ]);

    const usersData = data[0];
    const numberOfUsers = usersData?.forbidden ? null : Number(usersData?.users?.length ?? 0);
    const numberOfPosts = Number(data[2]?.totalCount ?? 0);
    const numberOfComments = Number(data[1]?.commentsCount ?? 0);
    const showUsersCard = !usersData?.forbidden;

    return {
      numberOfComments,
      numberOfPosts,
      numberOfUsers,
      showUsersCard,
    };
  } catch (error) {
    console.error('Error fetching card data:', error);
    return {
      numberOfComments: 0,
      numberOfPosts: 0,
      numberOfUsers: 0,
      showUsersCard: false,
    };
  }
}

export async function fetchLatestPosts(options) {
  try {
    const posts = await getPosts('sort=latest&limit=5&scope=dashboard', options);
    return posts;
  } catch (error) {
    throw new Error(error?.reponse?.data?.message);
  }
}
