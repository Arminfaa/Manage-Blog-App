import { unstable_cache } from 'next/cache';
import http from './httpService';

export async function getCategoriesApi(options) {
  return http.get('/category/list', options).then(({ data }) => data.data);
}

export function getCachedCategoriesApi(options, cacheKey = 'default') {
  return unstable_cache(async () => getCategoriesApi(options), ['categories', cacheKey], { revalidate: 60, tags: ['categories'] })();
}

export async function createCategoryApi(data) {
  return http.post('/category/add', data).then(({ data }) => data.data);
}

export async function updateCategoryApi({ id, data }) {
  return http.patch(`/category/update/${id}`, data).then(({ data }) => data.data);
}

export async function deleteCategoryApi({ id }) {
  return http.delete(`/category/remove/${id}`).then(({ data }) => data.data);
}
