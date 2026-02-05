import { Suspense } from "react";
import { cookies } from "next/headers";
import PostsTable from "./_/components/PostsTable";
import Search from "@/ui/Search";
import { CreatePost } from "./_/components/Buttons";
import Spinner from "@/ui/Spinner";
import queryString from "query-string";
import { getPosts } from "@/services/postServices";
import Pagination from "@/ui/Pagination";
import setCookieOnReq from "@/utils/setCookieOnReq";

async function Page({ searchParams }) {
  try {
    const search = await searchParams;
    const query = queryString.stringify({ ...search, scope: "dashboard" });
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    const { totalPages } = await getPosts(query, options);

    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست پست ها</h1>
          <Search />
          <CreatePost />
        </div>
        <Suspense fallback={<Spinner />} key={query}>
          <PostsTable query={query} options={options} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages || 0} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست پست ها</h1>
          <Search />
          <CreatePost />
        </div>
        <Suspense fallback={<Spinner />}>
          <PostsTable query="scope=dashboard" options={options} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={0} />
        </div>
      </div>
    );
  }
}
export default Page;
