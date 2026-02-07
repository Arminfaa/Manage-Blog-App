import { getPosts } from "@/services/postServices";
import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import BookmarkedPostRow from "./BookmarkedPostRow";
import queryString from "query-string";

async function BookmarkedPostsTable({ query = "", options }) {
  const { posts } = await getPosts(query, options);

  if (!posts.length) return <Empty resourceName="پست ذخیره شده" />;

  const params = queryString.parse(query);
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 10);
  const startIndex = (page - 1) * limit;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>عنوان</th>
        <th>دسته بندی</th>
        <th>نویسنده</th>
        <th>تاریخ ایجاد</th>
        <th>عملیات</th>
      </Table.Header>
      <Table.Body>
        {posts.map((post, index) => (
          <BookmarkedPostRow key={post._id} post={post} index={startIndex + index} />
        ))}
      </Table.Body>
    </Table>
  );
}

export default BookmarkedPostsTable;
