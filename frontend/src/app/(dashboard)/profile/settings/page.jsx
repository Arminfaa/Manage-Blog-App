import Breadcrumbs from "@/ui/BreadCrumbs";
import ProfileForm from "./_/ProfileForm";
import { cookies } from "next/headers";

async function Page() {
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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`,
    options
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const { data } = await res.json();
  const user = data?.user;

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "پروفایل",
            href: "/profile",
          },
          {
            label: "تنظیمات پروفایل",
            href: "/profile/settings",
            active: true,
          },
        ]}
      />
      <ProfileForm user={user} />
    </div>
  );
}

export default Page;

