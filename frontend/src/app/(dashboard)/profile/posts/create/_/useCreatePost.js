import { createPostApi } from '@/services/postServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { revalidatePosts } from '@/lib/revalidate';

export default function useCreatePost() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createPost } = useMutation({
    mutationFn: createPostApi,
    onSuccess: async (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      await revalidatePosts();
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isCreating, createPost };
}
