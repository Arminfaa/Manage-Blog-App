import CategoryListClient from "./CategoryListClient";

async function CategoryList() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.warn("NEXT_PUBLIC_BASE_URL is not set");
      return (
        <CategoryListClient categories={[]} />
      );
    }

    const res = await fetch(`${baseUrl}/category/list`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      return <CategoryListClient categories={[]} />;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return <CategoryListClient categories={[]} />;
    }

    const json = await res.json();
    const {
      data: { categories } = {},
    } = json || {};

    return (
      <CategoryListClient categories={categories || []} />
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <CategoryListClient categories={[]} />;
  }
}
export default CategoryList;
