import { Suspense } from "react";
import UsersTable from "./_/components/UsersTable";
import Search from "@/ui/Search";
import Spinner from "@/ui/Spinner";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

async function Page() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.warn("NEXT_PUBLIC_BASE_URL is not set");
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
    const accessToken = cookieStore.get("accessToken");
    const refreshToken = cookieStore.get("refreshToken");

    const options = {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `${accessToken?.name}=${accessToken?.value}; ${refreshToken?.name}=${refreshToken?.value}`,
      },
    };

    const res = await fetch(`${baseUrl}/user/list`, options);

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format");
    }

    const { data } = await res.json();
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

