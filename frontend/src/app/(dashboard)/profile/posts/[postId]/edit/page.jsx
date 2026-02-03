import { getPostById } from "@/services/postServices";
import Breadcrumbs from "@/ui/BreadCrumbs";
import { notFound } from "next/navigation";
import CreatePostForm from "../../create/_/CreatePostForm";

async function EditPage({ params }) {
  try {
    const { postId } = await params;
    console.log(postId);
    const data = await getPostById(postId);
    const post = data?.post || data;

    if (!post) {
      notFound();
    }

    return (
      <div>
        <Breadcrumbs
          breadcrumbs={[
            {
              label: "پست ها",
              href: "/profile/posts",
            },
            {
              label: "ویرایش پست",
              href: `/profile/posts/${postId}/edit`,
              active: true,
            },
          ]}
        />
        <CreatePostForm postToEdit={post} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
export default EditPage;
