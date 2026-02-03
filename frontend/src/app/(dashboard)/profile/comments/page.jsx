import { Suspense } from "react";
import CommentsTable from "./_/components/CommentsTable";
import Search from "@/ui/Search";
import Spinner from "@/ui/Spinner";
import { getCachedCommentsApi } from "@/services/commentService";
import setCookieOnReq from "@/utils/setCookieOnReq";
import getCacheKeyFromCookies from "@/utils/getCacheKeyFromCookies";
import { cookies } from "next/headers";

async function Page() {
  try {
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    const cacheKey = getCacheKeyFromCookies(cookieStore);
    const data = await getCachedCommentsApi(options, cacheKey);
    const comments = data?.comments || [];

    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست نظرات</h1>
          <Search />
        </div>
        <Suspense fallback={<Spinner />}>
          <CommentsTable comments={comments} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست نظرات</h1>
          <Search />
        </div>
        <Suspense fallback={<Spinner />}>
          <CommentsTable comments={[]} />
        </Suspense>
      </div>
    );
  }
}
export default Page;

