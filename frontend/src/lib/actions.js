"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createCommentApi } from "@/services/commentService";
import setCookieOnReq from "@/utils/setCookieOnReq";
import { cookies } from "next/headers";

// export async function createComment(postId, parentId, formData) {

export async function createComment(prevState, { formData, postId, parentId, slug }) {
  const cookieStore = await cookies()
  const options = setCookieOnReq(cookieStore);

  const rawFormData = {
    postId,
    parentId,
    text: formData.get("text"),
  };

  try {
    const { message } = await createCommentApi(rawFormData, options);
    revalidatePath(`/blogs/${slug}`);
    return {
      message,
    };
  } catch (err) {
    const error = err?.response?.data?.message;
    return {
      error,
    };
  }
}

export async function revalidatePostsList() {
  revalidateTag("posts");
  revalidatePath("/blogs", "layout");
}

export async function revalidateBookmarks() {
  revalidatePostsList();
  revalidatePath("/profile");
  revalidatePath("/profile/bookmarks");
}
