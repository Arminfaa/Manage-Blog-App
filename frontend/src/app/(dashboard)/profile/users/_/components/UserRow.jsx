import Table from "@/ui/Table";
import Avatar from "@/ui/Avatar";
import { toPersianDigits } from "@/utils/numberFormatter";
import { toLocalDateShort } from "@/utils/dateFormatter";
import truncateText from "@/utils/truncateText";

function UserRow({ index, user }) {
  const { name, email, biography, createdAt, avatarUrl } = user;

  return (
    <Table.Row>
      <td>{toPersianDigits(index + 1)}</td>
      <td>
        <div className="flex items-center gap-x-3">
          <Avatar
            src={avatarUrl}
            alt={name}
            width={40}
            height={40}
          />
          <span className="font-medium">{name}</span>
        </div>
      </td>
      <td className="text-sm" dir="ltr">
        {email}
      </td>
      <td>{truncateText(biography || "-", 40)}</td>
      <td>{toLocalDateShort(createdAt)}</td>
    </Table.Row>
  );
}
export default UserRow;

