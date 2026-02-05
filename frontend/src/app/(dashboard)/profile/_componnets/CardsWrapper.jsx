import { fetchCardData } from "@/services/data";
import Card from "./Card";

async function CardsWrapper() {
  const data = await fetchCardData() || {
    numberOfComments: 0,
    numberOfPosts: 0,
    numberOfUsers: 0,
    showUsersCard: false,
  };
  const { numberOfComments, numberOfPosts, numberOfUsers, showUsersCard } = data;

  return (
    <div className={`grid gap-6 mb-8 ${showUsersCard ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      {showUsersCard && <Card title="کاربران" value={numberOfUsers} type="users" />}
      <Card title="پست ها" value={numberOfPosts} type="posts" />
      <Card title="نظرات" value={numberOfComments} type="comments" />
    </div>
  );
}
export default CardsWrapper;
