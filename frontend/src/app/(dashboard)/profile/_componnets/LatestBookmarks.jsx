import { cookies } from "next/headers";
import BookmarkedPostsTable from "../bookmarks/_/components/BookmarkedPostsTable";
import setCookieOnReq from "@/utils/setCookieOnReq";
import Link from "next/link";

async function LatestBookmarks() {
  const cookieStore = await cookies();
  const options = setCookieOnReq(cookieStore);
  const query = "scope=bookmarks&sort=latest&limit=5";
  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl text-secondary-700">آخرین پست های ذخیره شده</h2>
        <Link
          href="/profile/bookmarks"
          className="text-primary-900 hover:text-primary-700 text-sm font-medium underline transition-all"
        >
          مشاهده همه
        </Link>
      </div>
      <BookmarkedPostsTable query={query} options={options} />
    </div>
  );
}

export default LatestBookmarks;
