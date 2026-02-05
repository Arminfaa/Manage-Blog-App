import Table from "@/ui/Table";
import Avatar from "@/ui/Avatar";
import { toPersianDigits } from "@/utils/numberFormatter";
import { toLocalDateShort } from "@/utils/dateFormatter";
import truncateText from "@/utils/truncateText";
import { UpdateUser, DeleteUser } from "./Buttons";

const roleLabel = { admin: "ادمین", user: "کاربر", super_admin: "سوپر ادمین" };

function UserRow({ index, user, currentUserRole }) {
  const { name, email, biography, createdAt, avatarUrl, role } = user;
  const isSuperAdmin = currentUserRole === "super_admin";

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
      <td>
        <span className="badge badge--secondary">
          {roleLabel[role] || roleLabel.user}
        </span>
      </td>
      {isSuperAdmin && (
        <td>
          <div className="flex items-center gap-x-3">
            <UpdateUser user={user} />
            <DeleteUser user={user} />
          </div>
        </td>
      )}
    </Table.Row>
  );
}
export default UserRow;

