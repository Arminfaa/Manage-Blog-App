import CoverImage from "./CoverImage";
import BookmarkOnImage from "./BookmarkOnImage";
import Link from "next/link";
import { ClockIcon } from "@heroicons/react/24/outline";
import Author from "./Author";
import PostInteraction from "./PostInteraction";

async function PostList({ posts }) {
  return posts.length > 0 ? (
    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-8">
      {posts.map((post) => (
        <div
          key={post._id}
          className="group relative sm:col-span-6 lg:col-span-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 ease-out overflow-hidden bg-secondary-0 shadow-card hover:shadow-card-hover dark:shadow-none dark:hover:shadow-card-dark-hover"
        >
          <div className="relative">
            <CoverImage {...post} />
            <BookmarkOnImage post={post} />
          </div>
          {/* post content */}
          <div>
            <Link href={`/blogs/${post.slug}`}>
              <h2 className="mb-4 font-bold text-secondary-700 hover:text-primary-900 transition-all ease-out">
                {post.title}
              </h2>
            </Link>

            {/* post author - readingTime */}
            <div className="flex items-center justify-between mb-4">
              <Author {...post.author} />
              <div className="flex items-center text-[10px] text-secondary-500">
                <ClockIcon className="w-4 h-4 stroke-secondary-500 ml-1" />
                <span className="ml-1"> خواندن:</span>
                <span className="ml-1 leading-3">{post.readingTime}</span>
                <span>دقیقه</span>
              </div>
            </div>
            <PostInteraction post={post} />
          </div>
        </div>
      ))}
    </div>
  ) : null;
}
export default PostList;
