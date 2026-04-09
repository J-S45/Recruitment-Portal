import APIClient from "@/services/api-clients";
import type { ConfirmEmailPayload, ConfirmEmailResponse } from "@/Types/Types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const apiClient = new APIClient<ConfirmEmailPayload, ConfirmEmailResponse>(
  "/api/auth/forgot-password" 
);

const useConfirmEmail = () => {
    const navigate = useNavigate();

  return useMutation<ConfirmEmailResponse, Error, ConfirmEmailPayload>({
    mutationFn: (data) => apiClient.postAll(data),
    onSuccess: (_, variables) => {
        sessionStorage.setItem("resetEmail", variables.email);
        
      toast.success("Verification code sent! Check your inbox.", {
        position: "top-right",
        style: { color: "#237227" },
      });
       navigate("/verifyCode");
      
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to send verification code.", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
    },
  });
};

export default useConfirmEmail;