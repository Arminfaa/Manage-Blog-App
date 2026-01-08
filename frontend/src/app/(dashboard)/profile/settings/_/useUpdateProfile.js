import { updateProfileApi } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: updateProfile } = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isUpdating, updateProfile };
}

