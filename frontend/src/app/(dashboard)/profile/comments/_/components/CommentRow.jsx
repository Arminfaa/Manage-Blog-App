import Table from "@/ui/Table";
import { toPersianDigits } from "@/utils/numberFormatter";
import truncateText from "@/utils/truncateText";
import { DeleteComment, UpdateCommentStatus } from "./Buttons";

const statusStyle = {
  0: {
    label: "در انتظار تایید",
    className: "badge--warning",
  },
  1: {
    label: "رد شده",
    className: "badge--error",
  },
  2: {
    label: "تایید شده",
    className: "badge--success",
  },
};

function CommentRow({ index, comment }) {
  const { user, content, status, isAnswer } = comment;
  const userName = user?.name || "-";
  const commentText = content?.text || "-";

  return (
    <Table.Row>
      <td>{toPersianDigits(index + 1)}</td>
      <td>{userName}</td>
      <td>
        <div className="flex items-center gap-x-2">
          {isAnswer && (
            <span className="text-xs text-secondary-400">پاسخ به:</span>
          )}
          {truncateText(commentText, 50)}
        </div>
      </td>
      <td>
        <span className={`badge ${statusStyle[status]?.className || ""}`}>
          {statusStyle[status]?.label || "-"}
        </span>
      </td>
      <td>{isAnswer ? "پاسخ" : "نظر اصلی"}</td>
      <td>
        <div className="flex items-center gap-x-3">
          <UpdateCommentStatus comment={comment} />
          <DeleteComment comment={comment} />
        </div>
      </td>
    </Table.Row>
  );
}
export default CommentRow;

