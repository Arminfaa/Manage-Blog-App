"use client";

import { useState } from "react";
import ButtonIcon from "@/ui/ButtonIcon";
import Button from "@/ui/Button";
import ConfirmDelete from "@/ui/ConfirmDelete";
import Modal from "@/ui/Modal";
import RHFTextField from "@/ui/RHFTextField";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import useDeleteUser from "../useDeleteUser";
import { updateUserByAdminApi } from "@/services/authService";
import { revalidateUsers } from "@/lib/revalidate";

export function UpdateUser({ user }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "user",
    },
  });

  const onOpen = () => {
    reset({ name: user?.name, email: user?.email, role: user?.role || "user" });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      await updateUserByAdminApi(user._id, data);
      toast.success("کاربر با موفقیت به‌روزرسانی شد");
      await revalidateUsers();
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "خطا در به‌روزرسانی");
    }
  };

  return (
    <>
      <ButtonIcon variant="outline" onClick={onOpen}>
        <PencilIcon />
      </ButtonIcon>
      <Modal title="ویرایش کاربر" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <RHFTextField
            label="نام"
            name="name"
            register={register}
            errors={errors}
            validationSchema={{ required: "نام ضروری است" }}
          />
          <RHFTextField
            label="ایمیل"
            name="email"
            type="email"
            dir="ltr"
            register={register}
            errors={errors}
            validationSchema={{ required: "ایمیل ضروری است" }}
          />
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">نقش</label>
            <select
              {...register("role", { required: true })}
              className="w-full rounded-lg border border-secondary-200 bg-secondary-0 px-3 py-2 text-secondary-700 focus:border-primary-500 focus:outline-none"
            >
              <option value="user">کاربر</option>
              <option value="admin">ادمین</option>
              <option value="super_admin">سوپر ادمین</option>
            </select>
          </div>
          <div className="flex gap-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              لغو
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              ذخیره
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function DeleteUser({ user }) {
  const [open, setOpen] = useState(false);
  const { isDeleting, deleteUser } = useDeleteUser();
  const router = useRouter();

  return (
    <>
      <ButtonIcon variant="outline" onClick={() => setOpen(true)}>
        <TrashIcon className="text-error" />
      </ButtonIcon>
      <Modal title={`حذف ${user?.name}`} open={open} onClose={() => setOpen(false)}>
        <ConfirmDelete
          resourceName={user?.name || "کاربر"}
          onClose={() => setOpen(false)}
          onConfirm={(e) => {
            e.preventDefault();
            deleteUser(user._id, {
              onSuccess: () => {
                setOpen(false);
                router.refresh();
              },
            });
          }}
          disabled={isDeleting}
        />
      </Modal>
    </>
  );
}
