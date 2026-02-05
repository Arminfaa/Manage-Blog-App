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
      <ul className="hidden lg:block space-y-4">
        <li>
          <Link
            href="/blogs"
            className="text-secondary-700 hover:text-primary-900 transition-all ease-out"
          >
            همه
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category._id}>
            <Link
              href={`/blogs/category/${category.slug}`}
              className="text-secondary-700 hover:text-primary-900 transition-all ease-out"
            >
              {category.title}
            </Link>
          </li>
        ))}
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
