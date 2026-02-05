import { Suspense } from "react";
import CategoryList from "../_components/CategoryList";
import Spinner from "@/ui/Spinner";
import Search from "@/ui/Search";
import BlogSort from "../_components/BlogSort";

export const metadata = {
  title: "بلاگ ها",
};

async function Layout({ children }) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-secondary-700 lg:mb-12 items-center">
        <h1 className="text-lg font-bold">لیست بلاگ ها</h1>
        <Search />
        <BlogSort />
      </div>
      <div className="flex flex-col sm:grid sm:grid-cols-12 gap-8 max-lg:pb-6">
        <div className="sm:col-span-12 lg:col-span-3 text-secondary-500 space-y-4 max-lg:border-b max-lg:border-b-secondary-300 pb-4 lg:border-l lg:border-l-secondary-300 lg:pl-4">
          <Suspense fallback={<Spinner />}>
            <CategoryList />
          </Suspense>
        </div>
        <div className="sm:col-span-12 lg:col-span-9">
          {children}
        </div>
      </div>
    </div>
  );
}
export default Layout;
