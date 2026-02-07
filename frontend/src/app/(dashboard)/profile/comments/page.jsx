import { Suspense } from "react";
import CommentsTable from "./_/components/CommentsTable";
import CommentStatusFilter from "./_/components/CommentStatusFilter";
import Search from "@/ui/Search";
import Spinner from "@/ui/Spinner";
import Pagination from "@/ui/Pagination";
import { getComments } from "@/services/commentService";
import setCookieOnReq from "@/utils/setCookieOnReq";
import queryString from "query-string";
import { cookies } from "next/headers";

async function Page({ searchParams }) {
  try {
    const params = await searchParams;
    const query = queryString.stringify({ ...params, limit: params.limit ?? "10" });

    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    const { totalPages } = await getComments(query, options);

    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست نظرات</h1>
          <Search />
          <CommentStatusFilter />
        </div>
        <Suspense fallback={<Spinner />} key={query}>
          <CommentsTable query={query} options={options} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages || 0} defaultLimit={10} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست نظرات</h1>
          <Search />
          <CommentStatusFilter />
        </div>
        <Suspense fallback={<Spinner />}>
          <CommentsTable query="limit=10" options={options} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={0} defaultLimit={10} />
        </div>
      </div>
    );
  }
}
export default Page;

