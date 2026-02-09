import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

function Layout({ children }) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-md px-4 py-4 lg:py-2 lg:px-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-primary-900 dark:text-primary-600 text-sm mb-6 px-4 py-2 rounded-lg bg-secondary-200 dark:bg-secondary-0"
        >
          <ArrowRightIcon className="w-4 h-4" aria-hidden />
          بازگشت به صفحه اصلی
        </Link>
        {children}
      </div>
    </div>
  );
}
export default Layout;
