import Link from "next/link";

async function CategoryList() {
  // await new Promise((res) => setTimeout(res, 2000));
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category/list`);
  const {
    data: { categories },
  } = await res.json();

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
}
export default CategoryList;
