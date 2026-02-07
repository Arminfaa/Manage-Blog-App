import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import truncateText from "@/utils/truncateText";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";
import ButtonIcon from "@/ui/ButtonIcon";
import { toPersianDigits } from "@/utils/numberFormatter";
import RemoveFromBookmarks from "./RemoveFromBookmarks";

function BookmarkedPostRow({ index, post }) {
  const { _id, title, slug, category, author, createdAt } = post;
  return (
    <Table.Row>
      <td>{toPersianDigits(index + 1)}</td>
      <td>{truncateText(title, 30)}</td>
      <td>{category?.title || "دسته‌بندی نامشخص"}</td>
      <td>{author?.name || "نویسنده نامشخص"}</td>
      <td>{toLocalDateShort(createdAt)}</td>
      <td>
        <div className="flex items-center gap-x-3">
          <Link href={`/blogs/${slug}`} target="_blank" rel="noopener noreferrer">
            <ButtonIcon variant="outline" title="مشاهده پست">
              <EyeIcon className="w-5" />
            </ButtonIcon>
          </Link>
          <RemoveFromBookmarks postId={_id} />
        </div>
      </td>
    </Table.Row>
  );
}

export default BookmarkedPostRow;
