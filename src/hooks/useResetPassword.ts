
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import APIClient from "@/services/api-clients";
import type { ResetPasswordPayload, ResetPasswordResponse } from "@/Types/Types";

const apiClient = new APIClient<ResetPasswordPayload, ResetPasswordResponse>(
  "/api/auth/reset-password"
);

const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: (data) => apiClient.postAll(data),
    onSuccess: () => {
      toast.success("Password updated successfully!", {
        position: "top-right",
        style: { color: "#237227" },
      });
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update password. Please try again.", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
    },
  });
};

export default useResetPassword;