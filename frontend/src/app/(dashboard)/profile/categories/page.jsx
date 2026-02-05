import { Suspense } from "react";
import { redirect } from "next/navigation";
import CategoriesTable from "./_/components/CategoriesTable";
import Search from "@/ui/Search";
import { CreateCategory } from "./_/components/Buttons";
import Spinner from "@/ui/Spinner";
import { getCachedCategoriesApi } from "@/services/categoryServie";
import { getUserApi } from "@/services/authService";
import setCookieOnReq from "@/utils/setCookieOnReq";
import getCacheKeyFromCookies from "@/utils/getCacheKeyFromCookies";
import { cookies } from "next/headers";

async function Page() {
  try {
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    const { user } = await getUserApi(options).catch(() => ({ user: null }));
    if (!user || user.role !== "admin") {
      redirect("/profile");
    }
    const cacheKey = getCacheKeyFromCookies(cookieStore);
    const data = await getCachedCategoriesApi(options, cacheKey);
    const categories = data?.categories || [];

    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست دسته بندی ها</h1>
          <Search />
          <CreateCategory />
        </div>
        <Suspense fallback={<Spinner />}>
          <CategoriesTable categories={categories} />
        </Suspense>
      </div>
    );
  } catch (error) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    console.error("Error fetching categories:", error);
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست دسته بندی ها</h1>
          <Search />
          <CreateCategory />
        </div>
        <Suspense fallback={<Spinner />}>
          <CategoriesTable categories={[]} />
        </Suspense>
      </div>
    );
  }
}
export default Page;

