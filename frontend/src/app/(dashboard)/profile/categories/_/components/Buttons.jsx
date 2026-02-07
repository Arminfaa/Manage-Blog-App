"use client";
import ButtonIcon from "@/ui/ButtonIcon";
import ConfirmDelete from "@/ui/ConfirmDelete";
import Modal from "@/ui/Modal";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import useDeleteCategory from "../useDeleteCategory";
import { useRouter } from "next/navigation";

export function CreateCategory() {
  return (
    <Link
      href="/profile/categories/create"
      className="justify-self-end flex gap-x-4 py-3 items-center rounded-lg bg-primary-900 px-4 text-sm font-medium text-secondary-0 
      transition-colors hover:bg-primary-700 max-[400px]:w-full max-[400px]:justify-center max-[400px]:gap-2"
    >
      <span className="block">ایجاد دسته بندی</span>{" "}
      <PlusIcon className="w-5" />
    </Link>
  );
}

export function DeleteCategory({ category: { _id: id, title } }) {
  const [open, setOpen] = useState(false);
  const { isDeleting, deleteCategory } = useDeleteCategory();
  const router = useRouter();

  return (
    <>
      <ButtonIcon variant="outline" onClick={() => setOpen(true)}>
        <TrashIcon className="text-error" />
      </ButtonIcon>
      <Modal title={`حذف ${title}`} open={open} onClose={() => setOpen(false)}>
        <ConfirmDelete
          resourceName={title}
          onClose={() => setOpen(false)}
          onConfirm={(e) => {
            e.preventDefault();
            deleteCategory(
              { id },
              {
                onSuccess: () => {
                  setOpen(false);
                  router.refresh();
                },
              }
            );
          }}
          disabled={isDeleting}
        />
      </Modal>
    </>
  );
}

export function UpdateCategory({ id }) {
  return (
    <Link href={`/profile/categories/${id}/edit`}>
      <ButtonIcon variant="outline">
        <PencilIcon />
      </ButtonIcon>
    </Link>
  );
}

