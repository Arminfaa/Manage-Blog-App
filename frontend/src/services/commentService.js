import { unstable_cache } from 'next/cache';
import http from './httpService';

export async function createCommentApi(data, options) {
  return http.post('/comment/add', data, options).then(({ data }) => data.data);
}

export async function getAllCommentsApi(options = {}) {
  return http.get('/comment/list', options).then(({ data }) => data.data);
}

export async function getComments(queries = '', options) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) return { comments: [], totalPages: 0, totalCount: 0 };

    const url = queries ? `${baseUrl}/comment/list?${queries}` : `${baseUrl}/comment/list`;
    const res = await fetch(url, { ...options, next: { revalidate: 0, tags: ['comments'] } });

    if (!res.ok) return { comments: [], totalPages: 0, totalCount: 0 };

    const json = await res.json();
    const { data } = json || {};
    const { comments, totalPages, totalCount } = data || {};
    return { comments: comments || [], totalPages: totalPages || 0, totalCount: totalCount ?? 0 };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { comments: [], totalPages: 0, totalCount: 0 };
  }
}

export function getCachedCommentsApi(options = {}, cacheKey = 'default') {
  return unstable_cache(async () => getAllCommentsApi(options), ['comments', cacheKey], { revalidate: 60, tags: ['comments'] })();
}

export async function updateCommentApi({ id, data }) {
  return http.patch(`/comment/update/${id}`, data).then(({ data }) => data.data);
}

export async function deleteCommentApi({ id }) {
  return http.delete(`/comment/remove/${id}`).then(({ data }) => data.data);
}
