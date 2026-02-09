import { editPostApi } from '@/services/postServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { revalidatePosts } from '@/lib/revalidate';
import { revalidatePostBySlug } from '@/lib/actions';

export default function useEditPost() {
  const queryClient = useQueryClient();

  const { isPending: isEditing, mutate: editPost } = useMutation({
    mutationFn: ({ id, data }) => editPostApi({ id, data }),
    onSuccess: async (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      await revalidatePosts();
      if (variables.slug) await revalidatePostBySlug(variables.slug);
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isEditing, editPost };
}
