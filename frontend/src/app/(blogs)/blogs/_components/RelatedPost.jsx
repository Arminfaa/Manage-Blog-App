import Author from "./Author";
import CoverImage from "./CoverImage";
import Link from "next/link";

function RelatedPost({ posts }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-secondary-700 mb-6">پست های مرتبط</h2>
      <div className="grid gap-6 grid-cols-6">
        {posts.map((item) => {
          return (
            <Link
              key={item._id}
              href={`/blogs/${item.slug}`}
              className="col-span-6 md:col-span-3 lg:col-span-2 group"
            >
              <CoverImage {...item} />
              <div className="mt-3">
                <h3 className="font-semibold text-secondary-700 group-hover:text-primary-900 transition-colors mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <Author {...item.author} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default RelatedPost;
