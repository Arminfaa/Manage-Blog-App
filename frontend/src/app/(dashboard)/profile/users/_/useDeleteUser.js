'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteUserByAdminApi } from '@/services/authService';
import { revalidateUsers } from '@/lib/revalidate';

export default function useDeleteUser() {
  const { isPending: isDeleting, mutate: deleteUser } = useMutation({
    mutationFn: deleteUserByAdminApi,
    onSuccess: async (data) => {
      toast.success(data?.message || 'کاربر با موفقیت حذف شد');
      await revalidateUsers();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'خطا در حذف کاربر'),
  });

  return { isDeleting, deleteUser };
}
