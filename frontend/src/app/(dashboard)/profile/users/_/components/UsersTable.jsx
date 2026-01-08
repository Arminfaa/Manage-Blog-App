import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import UserRow from "./UserRow";

function UsersTable({ users = [] }) {
  if (!users.length) return <Empty resourceName="کاربری" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>نام</th>
        <th>ایمیل</th>
        <th>بیوگرافی</th>
        <th>تاریخ عضویت</th>
      </Table.Header>
      <Table.Body>
        {users.map((user, index) => (
          <UserRow key={user._id} user={user} index={index} />
        ))}
      </Table.Body>
    </Table>
  );
}
export default UsersTable;

