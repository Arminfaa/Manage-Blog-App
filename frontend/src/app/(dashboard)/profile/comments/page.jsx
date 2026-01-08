import { Suspense } from "react";
import CommentsTable from "./_/components/CommentsTable";
import Search from "@/ui/Search";
import Spinner from "@/ui/Spinner";
import { getAllCommentsApi } from "@/services/commentService";

async function Page() {
  const data = await getAllCommentsApi();
  const comments = data?.comments || [];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-secondary-700 mb-12 items-center">
        <h1 className="font-bold text-xl">لیست نظرات</h1>
        <Search />
      </div>
      <Suspense fallback={<Spinner />}>
        <CommentsTable comments={comments} />
      </Suspense>
    </div>
  );
}
export default Page;

