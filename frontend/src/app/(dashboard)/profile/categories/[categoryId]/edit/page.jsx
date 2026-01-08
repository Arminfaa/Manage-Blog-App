import Breadcrumbs from "@/ui/BreadCrumbs";
import CreateCategoryForm from "../../create/_/CreateCategoryForm";
import { getCategoriesApi } from "@/services/categoryServie";
import { notFound } from "next/navigation";

async function Page({ params }) {
  const { categoryId } = await params;
  const { categories } = await getCategoriesApi();
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
}

export default Page;

