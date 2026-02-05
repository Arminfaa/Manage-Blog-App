import { Suspense } from "react";
import { redirect } from "next/navigation";
import UsersListWithSearch from "./_/components/UsersListWithSearch";
import Spinner from "@/ui/Spinner";
import { getCachedUsersApi, getUserApi } from "@/services/authService";
import setCookieOnReq from "@/utils/setCookieOnReq";
import getCacheKeyFromCookies from "@/utils/getCacheKeyFromCookies";
import { cookies } from "next/headers";

async function Page() {
  try {
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      return (
        <Suspense fallback={<Spinner />}>
          <UsersListWithSearch users={[]} />
        </Suspense>
      );
    }

    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    const { user } = await getUserApi(options).catch(() => ({ user: null }));
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      redirect("/profile");
    }

    const cacheKey = getCacheKeyFromCookies(cookieStore);
    const data = await getCachedUsersApi(options, cacheKey);
    const users = data?.users || [];

    return (
      <Suspense fallback={<Spinner />}>
        <UsersListWithSearch users={users} currentUserRole={user.role} />
      </Suspense>
    );
  } catch (error) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    console.error("Error fetching users:", error);
    return (
      <Suspense fallback={<Spinner />}>
        <UsersListWithSearch users={[]} />
      </Suspense>
    );
  }
}
export default Page;

