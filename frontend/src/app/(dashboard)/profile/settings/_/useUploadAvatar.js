import { uploadAvatarApi } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useUploadAvatar() {
  const queryClient = useQueryClient();

  const { isPending: isUploading, mutate: uploadAvatar } = useMutation({
    mutationFn: uploadAvatarApi,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isUploading, uploadAvatar };
}

