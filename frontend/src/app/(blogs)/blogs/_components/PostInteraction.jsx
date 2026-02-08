"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bookmarkPostApi, likePostApi } from "@/services/postServices";
import { revalidateBookmarks, revalidatePostsList } from "@/lib/actions";
import ButtonIcon from "@/ui/ButtonIcon";
import { toPersianDigits } from "@/utils/numberFormatter";

import {
  BookmarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

import {
  HeartIcon as SolidHeartIcon,
  BookmarkIcon as SolidBookmarkIcon,
} from "@heroicons/react/24/solid";

import toast from "react-hot-toast";

function PostInteraction({ post, showBookmarkInRow = false }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post?.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post?.likesCount ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(post?.isBookmarked ?? false);

  useEffect(() => {
    setIsLiked(post?.isLiked ?? false);
    setLikesCount(post?.likesCount ?? 0);
    setIsBookmarked(post?.isBookmarked ?? false);
  }, [post?._id, post?.isLiked, post?.likesCount, post?.isBookmarked]);

  const likeHandler = async (postId) => {
    try {
      const data = await likePostApi(postId);
      toast.success(data.message);
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
      await revalidatePostsList();
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const bookmarkHandler = async (postId) => {
    try {
      const data = await bookmarkPostApi(postId);
      toast.success(data.message);
      setIsBookmarked(data.isBookmarked);
      await revalidateBookmarks();
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center gap-x-2 sm:gap-x-4">
      <ButtonIcon variant="secondary" size="touch">
        <ChatBubbleOvalLeftEllipsisIcon />
        <span>{toPersianDigits(post.commentsCount)}</span>
      </ButtonIcon>
      <ButtonIcon
        variant="red"
        size="touch"
        onClick={() => likeHandler(post._id)}
        aria-label={isLiked ? "لغو لایک" : "لایک"}
      >
        {isLiked ? <SolidHeartIcon /> : <HeartIcon />}
        <span>{toPersianDigits(likesCount)}</span>
      </ButtonIcon>
      {showBookmarkInRow && (
        <ButtonIcon
          variant="primary"
          size="touch"
          onClick={() => bookmarkHandler(post._id)}
          aria-label={isBookmarked ? "حذف از ذخیره" : "ذخیره"}
        >
          {isBookmarked ? <SolidBookmarkIcon /> : <BookmarkIcon />}
        </ButtonIcon>
      )}
    </div>
  );
}
export default PostInteraction;
