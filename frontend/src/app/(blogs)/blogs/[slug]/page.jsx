import { getPostBySlug, getPosts } from "@/services/postServices";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import setCookieOnReq from "@/utils/setCookieOnReq";
import RelatedPost from "../_components/RelatedPost";
import PostComment from "../_components/comment/PostComment";
import Author from "../_components/Author";
import PostInteraction from "../_components/PostInteraction";
import Link from "next/link";
import { ClockIcon } from "@heroicons/react/24/outline";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { toPersianDigits } from "@/utils/numberFormatter";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { posts } = await getPosts();
    if (!posts || posts.length === 0) {
      return [];
    }
    const slugs = posts.map((post) => ({ slug: post.slug }));
    return slugs;
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const post = await getPostBySlug(await params.slug);
    return {
      title: post?.title || "پست",
      description: post?.briefText || "",
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "پست",
      description: "",
    };
  }
}

async function SinglePost({ params }) {
  const cookieStore = await cookies();
  const options = setCookieOnReq(cookieStore);
  const post = await getPostBySlug(await params.slug, options);

  if (!post) notFound();

  return (
    <article className="text-secondary-600 max-w-screen-md mx-auto">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-secondary-700 text-3xl md:text-4xl font-bold mb-6">
          {post.title}
        </h1>
        
        {/* Post Meta Information */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-secondary-500">
          <Author {...post.author} />
          <div className="flex items-center gap-x-1">
            <ClockIcon className="w-4 h-4" />
            <span>{toPersianDigits(post.readingTime)} دقیقه</span>
          </div>
          <span>{toLocalDateShort(post.createdAt)}</span>
          {post.category && (
            <Link
              href={`/blogs/category/${post.category.slug}`}
              className="px-3 py-1 bg-primary-100 text-primary-900 rounded-lg hover:bg-primary-200 transition-colors"
            >
              {post.category.title}
            </Link>
          )}
        </div>

        {/* Brief Text */}
        <p className="text-lg text-secondary-600 leading-relaxed mb-6">
          {post.briefText}
        </p>
      </header>

      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden rounded-lg mb-10">
        <Image
          className="object-cover object-center hover:scale-110 transition-all ease-out duration-300"
          fill
          src={post.coverImageUrl}
          alt={post.title}
          priority
        />
      </div>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none mb-10">
        <div className="text-secondary-700 leading-8 whitespace-pre-line">
          {post.text}
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-lg text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Interactions */}
      <div className="border-t border-b border-secondary-200 py-6 mb-10">
        <PostInteraction post={post} />
      </div>

      {/* Related Posts */}
      {post.related && post.related.length > 0 && (
        <RelatedPost posts={post.related} />
      )}

      {/* Comments Section */}
      <PostComment post={post} />
    </article>
  );
}
export default SinglePost;