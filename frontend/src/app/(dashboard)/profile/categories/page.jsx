import { Suspense } from "react";
import CategoriesTable from "./_/components/CategoriesTable";
import Search from "@/ui/Search";
import { CreateCategory } from "./_/components/Buttons";
import Spinner from "@/ui/Spinner";
import { getCategoriesApi } from "@/services/categoryServie";

export const dynamic = 'force-dynamic';

async function Page() {
  try {
    const data = await getCategoriesApi();
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

