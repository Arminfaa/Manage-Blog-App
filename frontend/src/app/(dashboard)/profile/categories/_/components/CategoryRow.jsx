import Table from "@/ui/Table";
import { toPersianDigits } from "@/utils/numberFormatter";
import truncateText from "@/utils/truncateText";
import { DeleteCategory, UpdateCategory } from "./Buttons";

function CategoryRow({ index, category }) {
  const { title, englishTitle, description } = category;
  return (
    <Table.Row>
      <td>{toPersianDigits(index + 1)}</td>
      <td>{title}</td>
      <td>{englishTitle}</td>
      <td>{truncateText(description || "-", 40)}</td>
      <td>
        <div className="flex items-center gap-x-3">
          <UpdateCategory id={category._id} />
          <DeleteCategory category={category} />
        </div>
      </td>
    </Table.Row>
  );
}
export default CategoryRow;

