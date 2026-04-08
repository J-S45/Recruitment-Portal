import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import APIClient from "src/services/api-clients";
import type { InternalLoginPayload, InternalLoginResponse} from "@/Types/Types";
import { useNavigate } from "react-router-dom";
import { loginMeta } from "@/Types/Types";

const apiClients = new APIClient<InternalLoginPayload,InternalLoginResponse>("/api/v1/auth/login");


const useInternalLogin = (onAdd?: () => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  return useMutation<InternalLoginResponse, Error, InternalLoginPayload>({
    mutationKey: ["InternalLoginUser"],
    mutationFn: (data) => {
      loginMeta.isInternalLogin= true;
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
      queryClient.setQueryData<InternalLoginResponse>(["currentUser"], response);
      if (onAdd) onAdd();
      navigate("/jobs")
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
    //   navigate("/home")

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

export default useInternalLogin;