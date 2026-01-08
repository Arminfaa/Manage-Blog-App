import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import CommentRow from "./CommentRow";

function CommentsTable({ comments = [] }) {
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
          <CommentRow key={comment._id} comment={comment} index={index} />
        ))}
      </Table.Body>
    </Table>
  );
}
export default CommentsTable;

