import axios from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
    baseURL: "https://826qnvht-8081.uks1.devtunnels.ms/" 
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


let isRedirectingToLogin = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";

    const isAuthEndpoint =
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/register");

    if (status === 401) {
      if (isAuthEndpoint) {
        toast.error("Invalid email or password.", {
          position: "top-right",
          duration: 4000,
          style: { color: "#ef4444" },
        });

        return Promise.reject(error);
      }

      const token = sessionStorage.getItem("token");

      if (token && !isRedirectingToLogin) {
        isRedirectingToLogin = true; 

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("signupDetails");

        toast.error("Your session has expired. Please log in again.", {
          position: "top-right",
          duration: 4000,
          style: { color: "#ef4444" },
        });

        setTimeout(() => {
          isRedirectingToLogin = false; 
          window.location.href = "/login";
        }, 1500);
      }
    }

    // if (status === 403) {
    //   if (!isAuthEndpoint) {
    //     toast.error("You are not authorized to perform this action.", {
    //       position: "top-right",
    //       duration: 4000,
    //       style: { color: "#ef4444" },
    //     });
    //   }
    // }

    return Promise.reject(error);
  }
);

class APIClient<T, R> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll() {
        return axiosInstance.get<R[]>(this.endpoint)
            .then((res) => res.data)
            .catch((err) => {
                throw new Error(err?.response?.data?.message || err.message);
            });
    }

    postAll(data: T) {
        return axiosInstance.post<R>(this.endpoint, data)
            .then((res) => res.data)
            .catch((err) => {
                throw new Error(err?.response?.data?.message || err.message);
            });
    }

      postMultipart(data: FormData) {
    return axiosInstance.post<R>(this.endpoint, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => res.data)
      .catch((err) => { throw new Error(err?.response?.data?.message || err.message) });
  }
}

export default APIClient;