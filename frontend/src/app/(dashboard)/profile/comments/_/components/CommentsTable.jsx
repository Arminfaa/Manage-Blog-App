import { getComments } from "@/services/commentService";
import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import CommentRow from "./CommentRow";
import queryString from "query-string";

async function CommentsTable({ query = "", options }) {
  const { comments = [] } = await getComments(query, options);
  // Flatten comments and answers into a single array
  const allComments = [];
  comments.forEach((comment) => {
    // Add main comment
    allComments.push({ ...comment, isAnswer: false });
    // Add answers
    if (comment.answers && comment.answers.length > 0) {
      comment.answers.forEach((answer) => {
        allComments.push({ ...answer, isAnswer: true, parentId: comment._id });
      });
    }
  });

  if (!allComments.length) return <Empty resourceName="نظری" />;

  const params = queryString.parse(query);
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 10);
  const startIndex = (page - 1) * limit;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>کاربر</th>
        <th>متن نظر</th>
        <th>وضعیت</th>
        <th>نوع</th>
        <th>عملیات</th>
      </Table.Header>
      <Table.Body>
        {allComments.map((comment, index) => (
          <CommentRow key={comment._id} comment={comment} index={startIndex + index} />
        ))}
      </Table.Body>
    </Table>
  );
}
export default CommentsTable;

