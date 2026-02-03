import Breadcrumbs from "@/ui/BreadCrumbs";
import CreateCategoryForm from "../../create/_/CreateCategoryForm";
import { getCachedCategoriesApi } from "@/services/categoryServie";
import { notFound } from "next/navigation";
import setCookieOnReq from "@/utils/setCookieOnReq";
import getCacheKeyFromCookies from "@/utils/getCacheKeyFromCookies";
import { cookies } from "next/headers";

async function Page({ params }) {
  try {
    const { categoryId } = await params;
    const cookieStore = await cookies();
    const options = setCookieOnReq(cookieStore);
    const cacheKey = getCacheKeyFromCookies(cookieStore);
    const data = await getCachedCategoriesApi(options, cacheKey);
    const categories = data?.categories || [];
    const category = categories.find((cat) => cat._id === categoryId);

    if (!category) {
      notFound();
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
              label: "ویرایش دسته بندی",
              href: `/profile/categories/${categoryId}/edit`,
              active: true,
            },
          ]}
        />
        <CreateCategoryForm categoryToEdit={category} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    notFound();
  }
}

export default Page;

