import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import APIClient from "src/services/api-clients";
import type { SignupResponse } from "@/Types/Types";
import type {SignupPayload} from "@/Types/Types"
import { useNavigate } from "react-router-dom";

const apiClients = new APIClient<SignupPayload,SignupResponse>("/api/v1/auth/register");


const useSignup = (onAdd?: () => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationKey: ["SignupUser"],
    mutationFn: (data) => apiClients.postAll(data),
    
    onSuccess: (response, variables) => {
          toast.success("Account created successfully", {
        position: "top-right",
        style: {
          color: "#237227",
        },
      })

       sessionStorage.setItem("signupDetails", JSON.stringify({
    firstName: variables.firstName,
    middleName: variables.middleName,
    lastName: variables.lastName,
    email: variables.email,
    phone: variables.phone
  }));
      console.log("Account created successfully:", response);
      queryClient.setQueryData<SignupResponse>(["currentUser"], response);
      if (onAdd) onAdd();
      navigate("/login")
    },

    onError: (error) => {
          toast.error(error?.message || "Signup failed", {
        position: "top-right",
        style: {
          color: "#ef4444",
        },
      })
      console.error("❌ Login failed:", error.message);
    },
  });
};

export default useSignup;