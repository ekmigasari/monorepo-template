import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueryKey } from "../../auth/query-keys";
import { updateProfile } from "../services";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
    },
  });
}
