import { createCategoryApi } from '@/services/categoryServie';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { revalidateCategories } from '@/lib/revalidate';

export default function useCreateCategory() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createCategory } = useMutation({
    mutationFn: createCategoryApi,
    onSuccess: async (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      await revalidateCategories();
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isCreating, createCategory };
}
