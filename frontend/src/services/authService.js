import { unstable_cache } from 'next/cache';
const { default: http } = require('./httpService');

export async function signupApi(data) {
  const response = await http.post('/user/signup', data);
  return {
    ...response.data.data,
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  };
}

export async function singinApi(data) {
  const response = await http.post('/user/signin', data);
  return {
    ...response.data.data,
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  };
}

export async function getUserApi(options) {
  const request = options ? http.get('/user/profile', options) : http.get('/user/profile');
  return request.then(({ data }) => data.data);
}

export async function getAllUsersApi(options) {
  return http.get('/user/list', options).then(({ data }) => data.data);
}

export function getCachedUsersApi(options, cacheKey = 'default') {
  return unstable_cache(async () => getAllUsersApi(options), ['users', cacheKey], { revalidate: 60, tags: ['users'] })();
}

export async function logoutApi() {
  return http.post('/user/logout').then(({ data }) => data);
}

export async function updateProfileApi(data) {
  return http.patch('/user/update', data).then(({ data }) => data.data);
}

export async function updateUserByAdminApi(userId, data) {
  return http.patch(`/user/${userId}`, data).then(({ data: res }) => res.data);
}

export async function deleteUserByAdminApi(userId) {
  return http.delete(`/user/${userId}`).then(({ data }) => data.data);
}

export async function uploadAvatarApi(data) {
  return http.post('/user/upload-avatar', data).then(({ data }) => data.data);
}
