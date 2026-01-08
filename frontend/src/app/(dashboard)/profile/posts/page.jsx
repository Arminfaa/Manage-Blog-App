import { Suspense } from "react";
import PostsTable from "./_/components/PostsTable";
import Search from "@/ui/Search";
import { CreatePost } from "./_/components/Buttons";
import Spinner from "@/ui/Spinner";
import queryString from "query-string";
import { getPosts } from "@/services/postServices";
import Pagination from "@/ui/Pagination";

export const dynamic = 'force-dynamic';

async function Page({ searchParams }) {
  try {
    const query = queryString.stringify(await searchParams);
    const { totalPages } = await getPosts(query);

    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست پست ها</h1>
          <Search />
          <CreatePost />
        </div>
        <Suspense fallback={<Spinner />} key={query}>
          <PostsTable query={query} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages || 0} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست پست ها</h1>
          <Search />
          <CreatePost />
        </div>
        <Suspense fallback={<Spinner />}>
          <PostsTable query="" />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={0} />
        </div>
      </div>
    );
  }
}
export default Page;
