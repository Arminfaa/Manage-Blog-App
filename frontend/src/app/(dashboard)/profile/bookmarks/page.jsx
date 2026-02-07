import { Suspense } from "react";
import { cookies } from "next/headers";
import BookmarkedPostsTable from "./_/components/BookmarkedPostsTable";
import Spinner from "@/ui/Spinner";
import queryString from "query-string";
import { getPosts } from "@/services/postServices";
import Pagination from "@/ui/Pagination";
import setCookieOnReq from "@/utils/setCookieOnReq";

async function Page({ searchParams }) {
  try {
    const search = await searchParams;
    const query = queryString.stringify({
      ...search,
      scope: "bookmarks",
      limit: search.limit ?? "10",
    });
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    const { totalPages } = await getPosts(query, options);

    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">پست های ذخیره شده</h1>
        </div>
        <Suspense fallback={<Spinner />} key={query}>
          <BookmarkedPostsTable query={query} options={options} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages || 0} defaultLimit={10} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error);
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">پست های ذخیره شده</h1>
        </div>
        <Suspense fallback={<Spinner />}>
          <BookmarkedPostsTable query="scope=bookmarks&limit=10" options={options} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={0} defaultLimit={10} />
        </div>
      </div>
    );
  }
}

export default Page;
