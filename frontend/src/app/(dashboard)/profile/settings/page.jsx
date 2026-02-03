import Breadcrumbs from "@/ui/BreadCrumbs";
import ProfileForm from "./_/ProfileForm";
import { cookies } from "next/headers";

async function Page() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.warn("NEXT_PUBLIC_BASE_URL is not set");
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
          <ProfileForm user={null} />
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

    const res = await fetch(`${baseUrl}/user/profile`, options);

    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format");
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
  } catch (error) {
    console.error("Error fetching user profile:", error);
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
        <ProfileForm user={null} />
      </div>
    );
  }
}

export default Page;

