"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonIcon from "@/ui/ButtonIcon";
import { BookmarkIcon as SolidBookmarkIcon } from "@heroicons/react/24/solid";
import { bookmarkPostApi } from "@/services/postServices";
import { revalidateBookmarks } from "@/lib/actions";
import toast from "react-hot-toast";

function RemoveFromBookmarks({ postId }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await bookmarkPostApi(postId);
      toast.success("پست از ذخیره‌ها حذف شد");
      await revalidateBookmarks();
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "خطا در حذف از ذخیره‌ها");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <ButtonIcon
      variant="outline"
      onClick={handleRemove}
      disabled={isRemoving}
      title="حذف از ذخیره‌ها"
    >
      <SolidBookmarkIcon className="w-5 text-primary-900" />
    </ButtonIcon>
  );
}

export default RemoveFromBookmarks;
