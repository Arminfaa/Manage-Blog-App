import { deleteCategoryApi } from '@/services/categoryServie';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { revalidateCategories } from '@/lib/revalidate';

export default function useDeleteCategory() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteCategory } = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: async (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      await revalidateCategories();
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isDeleting, deleteCategory };
}
