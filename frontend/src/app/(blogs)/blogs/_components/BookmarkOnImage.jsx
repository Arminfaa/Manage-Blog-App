"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bookmarkPostApi } from "@/services/postServices";
import { revalidateBookmarks, revalidatePostsList, revalidatePostBySlug } from "@/lib/actions";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as SolidBookmarkIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

function BookmarkOnImage({ post }) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(post?.isBookmarked ?? false);

  useEffect(() => {
    setIsBookmarked(post?.isBookmarked ?? false);
  }, [post?._id, post?.isBookmarked]);

  const bookmarkHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = await bookmarkPostApi(post._id);
      toast.success(data.message);
      setIsBookmarked(data.isBookmarked);
      if (post?.slug) await revalidatePostBySlug(post.slug);
      await revalidateBookmarks();
      await revalidatePostsList();
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <button
      type="button"
      onClick={bookmarkHandler}
      aria-label={isBookmarked ? "حذف از ذخیره" : "ذخیره"}
      className="absolute top-1 left-1 z-[1] flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-xl ring-2 ring-white/30 backdrop-blur-sm transition-all hover:bg-primary-700 hover:shadow-2xl hover:scale-105 active:scale-95 min-[440px]:h-11 min-[440px]:w-11 [&>svg]:h-5 [&>svg]:w-5 min-[440px]:[&>svg]:h-6 min-[440px]:[&>svg]:w-6"
    >
      {isBookmarked ? (
        <SolidBookmarkIcon className="text-white" />
      ) : (
        <BookmarkIcon className="text-white" strokeWidth={2} />
      )}
    </button>
  );
}

export default BookmarkOnImage;
