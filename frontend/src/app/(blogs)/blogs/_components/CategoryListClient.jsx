"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Select from "@/ui/Select";

function CategoryListClient({ categories = [] }) {
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on a category page: /blogs/category/[slug]
  const categorySlug = pathname.startsWith("/blogs/category/")
    ? pathname.split("/blogs/category/")[1]?.split("/")[0] || ""
    : "";

  const categoryValue = categorySlug ? `/blogs/category/${categorySlug}` : "/blogs";

  const categoryOptions = [
    { value: "/blogs", label: "همه" },
    ...categories.map((category) => ({
      value: `/blogs/category/${category.slug}`,
      label: category.title,
    })),
  ];

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value) {
      router.push(value);
    }
  };

  return (
    <>
      {/* Desktop: list (min 1024px) */}
      <ul className="hidden lg:block space-y-1">
        <li>
          <Link
            href="/blogs"
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !categorySlug
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-300"
                : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-200/50 hover:text-secondary-800 dark:hover:text-secondary-200"
            }`}
          >
            همه
          </Link>
        </li>
        {categories.map((category) => {
          const isActive = categorySlug === category.slug;
          return (
            <li key={category._id}>
              <Link
                href={`/blogs/category/${category.slug}`}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-300"
                    : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-200/50 hover:text-secondary-800 dark:hover:text-secondary-200"
                }`}
              >
                {category.title}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile/Tablet: select (max 1023px) - same Select as BlogSort */}
      <div className="lg:hidden w-full">
        <Select
          value={categoryValue}
          onChange={handleSelectChange}
          options={categoryOptions}
        />
      </div>
    </>
  );
}

export default CategoryListClient;
