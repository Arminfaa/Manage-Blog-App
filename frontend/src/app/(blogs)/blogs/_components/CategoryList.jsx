import Link from "next/link";

async function CategoryList() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.warn("NEXT_PUBLIC_BASE_URL is not set");
      return (
        <ul className="space-y-4">
          <Link href="/blogs" className="text-secondary-700 hover:text-primary-900 transition-all ease-out">همه</Link>
        </ul>
      );
    }

    const res = await fetch(`${baseUrl}/category/list`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      return (
        <ul className="space-y-4">
          <Link href="/blogs" className="text-secondary-700 hover:text-primary-900 transition-all ease-out">همه</Link>
        </ul>
      );
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return (
        <ul className="space-y-4">
          <Link href="/blogs" className="text-secondary-700 hover:text-primary-900 transition-all ease-out">همه</Link>
        </ul>
      );
    }

    const json = await res.json();
    const {
      data: { categories } = {},
    } = json || {};

    if (!categories || categories.length === 0) {
      return (
        <ul className="space-y-4">
          <Link href="/blogs" className="text-secondary-700 hover:text-primary-900 transition-all ease-out">همه</Link>
        </ul>
      );
    }

    return (
      <ul className="space-y-4">
        <Link href="/blogs" className="text-secondary-700 hover:text-primary-900 transition-all ease-out">همه</Link>
        {categories.map((category) => {
          return (
            <li key={category._id}>
              <Link href={`/blogs/category/${category.slug}`} className="text-secondary-700 hover:text-primary-900 transition-all ease-out">
                {category.title}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return (
      <ul className="space-y-4">
        <Link href="/blogs" className="text-secondary-700 hover:text-primary-900 transition-all ease-out">همه</Link>
      </ul>
    );
  }
}
export default CategoryList;
