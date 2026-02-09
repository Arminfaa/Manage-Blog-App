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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 lg:gap-8 text-secondary-700 lg:mb-12 items-center">
        <h1 className="text-lg font-bold">لیست بلاگ ها</h1>
        <Search />
        <BlogSort />
      </div>
      <div className="flex flex-col sm:grid sm:grid-cols-12 gap-4 lg:gap-8 max-lg:pb-6 max-lg:mt-2.5">
        <div className="lg:sticky lg:top-[75px] sm:col-span-12 lg:col-span-3 max-lg:pb-4 lg:self-start lg:rounded-xl lg:p-4 lg:bg-secondary-0 lg:shadow-sm lg:shadow-secondary-900/5 lg:dark:bg-secondary-0/80 lg:dark:shadow-none">
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
