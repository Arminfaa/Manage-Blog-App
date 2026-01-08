import setCookieOnReq from "@/utils/setCookieOnReq";
import { cookies } from "next/headers";
import { getAllUsersApi } from "./authService";
import { getAllCommentsApi } from "./commentService";
import { getPosts } from "./postServices";

export async function fetchCardData() {
  try {
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);

    // ARTIFICIALLY DELAY A REPONSE FOR DEMO PURPOSES
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await Promise.all([
      getAllUsersApi(options).catch(() => ({ users: [] })),
      getAllCommentsApi(options).catch(() => ({ commentsCount: 0 })),
      getPosts().catch(() => ({ posts: [] })),
    ]);

    const numberOfUsers = Number(data[0]?.users?.length ?? 0);
    const numberOfPosts = Number(data[2]?.posts?.length ?? 0);
    const numberOfComments = Number(data[1]?.commentsCount ?? 0);

    return {
      numberOfComments,
      numberOfPosts,
      numberOfUsers,
    };
  } catch (error) {
    console.error("Error fetching card data:", error);
    return {
      numberOfComments: 0,
      numberOfPosts: 0,
      numberOfUsers: 0,
    };
  }
}

export async function fetchLatestPosts() {
  try {
    const posts = await getPosts("sort=latest&limit=5");
    return posts;
  } catch (error) {
    throw new Error(error?.reponse?.data?.message);
  }
}
