import { updateCommentApi } from '@/services/commentService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { revalidateComments } from '@/lib/revalidate';

export default function useUpdateCommentStatus() {
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: updateCommentStatus } = useMutation({
    mutationFn: updateCommentApi,
    onSuccess: async (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      await revalidateComments();
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isUpdating, updateCommentStatus };
}
