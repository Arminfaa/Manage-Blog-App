import { Suspense } from "react";
import { redirect } from "next/navigation";
import UsersTable from "./_/components/UsersTable";
import Search from "@/ui/Search";
import Spinner from "@/ui/Spinner";
import { getCachedUsersApi, getUserApi } from "@/services/authService";
import setCookieOnReq from "@/utils/setCookieOnReq";
import getCacheKeyFromCookies from "@/utils/getCacheKeyFromCookies";
import { cookies } from "next/headers";

async function Page() {
  try {
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      return (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-secondary-700 mb-12 items-center">
            <h1 className="font-bold text-xl">لیست کاربران</h1>
            <Search />
          </div>
          <Suspense fallback={<Spinner />}>
            <UsersTable users={[]} />
          </Suspense>
        </div>
      );
    }

    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    const { user } = await getUserApi(options).catch(() => ({ user: null }));
    if (!user || user.role !== "admin") {
      redirect("/profile");
    }

    const cacheKey = getCacheKeyFromCookies(cookieStore);
    const data = await getCachedUsersApi(options, cacheKey);
    const users = data?.users || [];

    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست کاربران</h1>
          <Search />
        </div>
        <Suspense fallback={<Spinner />}>
          <UsersTable users={users} />
        </Suspense>
      </div>
    );
  } catch (error) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    console.error("Error fetching users:", error);
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-secondary-700 mb-12 items-center">
          <h1 className="font-bold text-xl">لیست کاربران</h1>
          <Search />
        </div>
        <Suspense fallback={<Spinner />}>
          <UsersTable users={[]} />
        </Suspense>
      </div>
    );
  }
}
export default Page;

