import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import APIClient from "src/services/api-clients";
import { loginMeta, type LoginPayload, type LoginResponse } from "@/Types/Types";
import { useNavigate } from "react-router-dom";

const apiClients = new APIClient<LoginPayload,LoginResponse>("/api/v1/auth/login");


const useLoginUser = (onAdd?: () => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationKey: ["ExternalUser"],
    mutationFn: (data) => { 
      loginMeta.isInternalLogin = false;
      return apiClients.postAll(data)},
    
    onSuccess: (response) => {
          toast.success("Login successful", {
        position: "top-right",
        style: {
          color: "#237227",
        },
      })

      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("user", JSON.stringify(response));
      console.log("Login successful:");
      queryClient.setQueryData<LoginResponse>(["currentUser"], response);
      if (onAdd) onAdd();
      navigate("/home")
  //      const role = response.roles[0]; 

  // if (role === "ADMIN") {
  //   navigate("/admin");
  // } else if (role === "PCD_OFFICER") {
  //   navigate("/admin");
  // } else if (role === "APPLICANT") {
  //   navigate("/home");
  // } else {
  //   navigate("/dashboard"); // fallback
  // }
  // //A=SET TOKEN TO  SESSION STORAGE
},
   

 onError: (error) => {
          toast.error(error?.message || "Login failed", {
        position: "top-right",
        style: {
          color: "#ef4444",
        },
      })
      console.error("❌ Login failed:", error.message);
    },
  });
};

export default useLoginUser;