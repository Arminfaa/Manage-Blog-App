import PostList from "../_components/PostList";
import { cookies } from "next/headers";
import setCookieOnReq from "@/utils/setCookieOnReq";
import { getPosts } from "@/services/postServices";
import Pagination from "@/ui/Pagination";
import BlogLimit from "../_components/BlogLimit";
import { toPersianDigits } from "@/utils/numberFormatter";

// export const experimental_ppr = true; // STATIC + DYNAMIC => PPR

async function BlogPage({ searchParams }) {
  const params = new URLSearchParams(await searchParams);
  if (!params.has("limit")) params.set("limit", "9");
  const queries = params.toString();
  const cookieStore = await cookies();
  const options = setCookieOnReq(cookieStore);
  const { posts, totalPages, totalCount } = await getPosts(queries, options);

  const search = params.get("search");

  return (
    <>
      <div className="mb-4 flex justify-end lg:hidden">
        <BlogLimit totalCount={totalCount} />
      </div>
      {search ? (
        <p className="mb-4 text-secondary-700">
          {posts.length === 0
            ? " هیچ پستی با این مشخصات پیدا نشد "
            : `نشان دادن ${toPersianDigits(posts.length)} نتیجه برای`}
          <span className="font-bold">&quot;{search}&quot;</span>
        </p>
      ) : null}
      <PostList posts={posts} />
      <div className="flex w-full justify-center my-8">
        <Pagination totalPages={totalPages} defaultLimit={9} />
      </div>
    </>
  );
}
export default BlogPage;

//? FOR ENGLISH TEXT:
//  showing 3 results for "folan"
//   const resultText = posts.length > 1 ? "results" : "result";
// ` showing ${posts.length} ${resultText} for`}
