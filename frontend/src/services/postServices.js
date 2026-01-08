import http from "./httpService";

export async function getPostBySlug(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/post/slug/${slug}`
    );
    
    if (!res.ok) {
      return null;
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }
    
    const json = await res.json();
    const { data } = json || {};
    const { post } = data || {};
    return post;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

export async function getPosts(queries = "", options) {
  try {
    // ARTIFICIALLY DELAY A REPONSE FOR DEMO PURPOSES
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const url = queries 
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/post/list?${queries}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/post/list`;
    
    const res = await fetch(url, options);
    
    if (!res.ok) {
      return { posts: [], totalPages: 0 };
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { posts: [], totalPages: 0 };
    }
    
    const json = await res.json();
    const { data } = json || {};
    const { posts, totalPages } = data || {};
    return { posts: posts || [], totalPages: totalPages || 0 };
  } catch (error) {
    console.error("Error fetching posts:", error);
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
  return http
    .delete(`/post/remove/${id}`, options)
    .then(({ data }) => data.data);
}
