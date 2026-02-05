import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import UserRow from "./UserRow";

function UsersTable({ users = [], currentUserRole }) {
  if (!users.length) return <Empty resourceName="کاربری" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>نام</th>
        <th>ایمیل</th>
        <th>بیوگرافی</th>
        <th>تاریخ عضویت</th>
        <th>نقش</th>
        {currentUserRole === "super_admin" && <th>عملیات</th>}
      </Table.Header>
      <Table.Body>
        {users.map((user, index) => (
          <UserRow key={user._id} user={user} index={index} currentUserRole={currentUserRole} />
        ))}
      </Table.Body>
    </Table>
  );
}
export default UsersTable;

