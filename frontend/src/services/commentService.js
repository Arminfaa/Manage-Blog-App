import { unstable_cache } from 'next/cache';
import http from './httpService';

export async function createCommentApi(data, options) {
  return http.post('/comment/add', data, options).then(({ data }) => data.data);
}

export async function getAllCommentsApi(options = {}) {
  return http.get('/comment/list', options).then(({ data }) => data.data);
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
