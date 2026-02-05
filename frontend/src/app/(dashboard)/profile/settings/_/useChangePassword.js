import { changePasswordApi } from '@/services/authService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function useChangePassword() {
  const queryClient = useQueryClient();

  const { isPending: isChanging, mutate: changePassword } = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isChanging, changePassword };
}
