import { cookies } from "next/headers";
import PostsTable from "../posts/_/components/PostsTable";
import setCookieOnReq from "@/utils/setCookieOnReq";

async function LatestPosts() {
  const cookieStore = await cookies();
  const options = setCookieOnReq(cookieStore);
  const query = "sort=latest&limit=5&scope=dashboard";
  return <PostsTable query={query} options={options} />;
}
export default LatestPosts;
