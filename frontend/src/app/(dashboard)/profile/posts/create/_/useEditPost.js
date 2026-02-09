import { editPostApi } from '@/services/postServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { revalidatePosts } from '@/lib/revalidate';
import { revalidatePostsList } from '@/lib/actions';

export default function useEditPost() {
  const queryClient = useQueryClient();

  const { isPending: isEditing, mutate: editPost } = useMutation({
    mutationFn: editPostApi,
    onSuccess: async (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      await revalidatePosts();
      await revalidatePostsList();
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isEditing, editPost };
}
