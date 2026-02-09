import http from './httpService';

export async function getPostBySlug(slug, options) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.warn('NEXT_PUBLIC_BASE_URL is not set');
      return null;
    }

    const fetchOptions = {
      ...options,
      next: { revalidate: 60, tags: [`post-${slug}`] },
    };

    const res = await fetch(`${baseUrl}/post/slug/${slug}`, fetchOptions);

    if (!res.ok) {
      return null;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }

    const json = await res.json();
    const { data } = json || {};
    const { post } = data || {};
    return post;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

export async function getPosts(queries = '', options) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.warn('NEXT_PUBLIC_BASE_URL is not set');
      return { posts: [], totalPages: 0 };
    }

    const url = queries ? `${baseUrl}/post/list?${queries}` : `${baseUrl}/post/list`;

    const fetchOptions = {
      ...options,
      next: { revalidate: 60, tags: ['posts'] },
    };

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      return { posts: [], totalPages: 0 };
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { posts: [], totalPages: 0 };
    }

    const json = await res.json();
    const { data } = json || {};
    const { posts, totalPages, totalCount } = data || {};
    return { posts: posts || [], totalPages: totalPages || 0, totalCount: totalCount ?? 0 };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], totalPages: 0 };
  }
}

export async function likePostApi(postId) {
  return http.post(`/post/like/${postId}`).then(({ data }) => data.data);
}

export async function bookmarkPostApi(postId) {
  return http.post(`/post/bookmark/${postId}`).then(({ data }) => data.data);
}

export async function createPostApi(data) {
  return http.post(`/post/create`, data).then(({ data }) => data.data);
}

export async function editPostApi({ id, data }) {
  return http.patch(`/post/update/${id}`, data).then(({ data }) => data.data);
}

export async function getPostById(id) {
  return http.get(`/post/${id}`).then(({ data }) => data.data);
}

export async function deletePostApi({ id, options }) {
  return http.delete(`/post/remove/${id}`, options).then(({ data }) => data.data);
}
