import { deletePostApi } from '@/services/postServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { revalidatePosts } from '@/lib/revalidate';

export default function useDeletePost() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deletePost } = useMutation({
    mutationFn: deletePostApi,
    onSuccess: async (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      await revalidatePosts();
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isDeleting, deletePost };
}
