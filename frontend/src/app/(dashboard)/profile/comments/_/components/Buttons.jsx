"use client";
import ButtonIcon from "@/ui/ButtonIcon";
import ConfirmDelete from "@/ui/ConfirmDelete";
import Modal from "@/ui/Modal";
import Select from "@/ui/Select";
import { CheckCircleIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useDeleteComment from "../useDeleteComment";
import useUpdateCommentStatus from "../useUpdateCommentStatus";
import { useRouter } from "next/navigation";

const statusOptions = [
  { value: 0, label: "در انتظار تایید" },
  { value: 1, label: "رد شده" },
  { value: 2, label: "تایید شده" },
];

export function UpdateCommentStatus({ comment }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(comment.status);
  const { isUpdating, updateCommentStatus } = useUpdateCommentStatus();
  const router = useRouter();

  const handleUpdate = (e) => {
    e.preventDefault();
    if (status === comment.status) {
      setOpen(false);
      return;
    }
    updateCommentStatus(
      { id: comment._id, data: { status } },
      {
        onSuccess: () => {
          setOpen(false);
          router.refresh();
        },
      }
    );
  };

  return (
    <>
      <ButtonIcon
        variant="outline"
        onClick={() => setOpen(true)}
        title="تغییر وضعیت"
      >
        {comment.status === 2 ? (
          <CheckCircleIcon className="text-success" />
        ) : (
          <XCircleIcon className="text-warning" />
        )}
      </ButtonIcon>
      <Modal
        title="تغییر وضعیت نظر"
        open={open}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Select
            label="وضعیت"
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            options={statusOptions}
          />
          <div className="flex gap-x-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isUpdating ? "در حال بروزرسانی..." : "تایید"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300"
            >
              انصراف
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function DeleteComment({ comment }) {
  const [open, setOpen] = useState(false);
  const { isDeleting, deleteComment } = useDeleteComment();
  const router = useRouter();
  const commentText = comment.content?.text || "این نظر";

  return (
    <>
      <ButtonIcon variant="outline" onClick={() => setOpen(true)}>
        <TrashIcon className="text-error" />
      </ButtonIcon>
      <Modal title="حذف نظر" open={open} onClose={() => setOpen(false)}>
        <ConfirmDelete
          resourceName={commentText}
          onClose={() => setOpen(false)}
          onConfirm={(e) => {
            e.preventDefault();
            deleteComment(
              { id: comment._id },
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

