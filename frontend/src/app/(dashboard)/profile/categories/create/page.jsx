import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Breadcrumbs from "@/ui/BreadCrumbs";
import CreateCategoryForm from "./_/CreateCategoryForm";
import { getUserApi } from "@/services/authService";
import setCookieOnReq from "@/utils/setCookieOnReq";

export default async function Page() {
  const cookieStore = await cookies();
  const options = setCookieOnReq(cookieStore);
  const { user } = await getUserApi(options).catch(() => ({ user: null }));
  if (!user || user.role !== "admin") {
    redirect("/profile");
  }
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "دسته بندی ها",
            href: "/profile/categories",
          },
          {
            label: "ایجاد دسته بندی",
            href: "/profile/categories/create",
            active: true,
          },
        ]}
      />
      <CreateCategoryForm />
    </div>
  );
}

