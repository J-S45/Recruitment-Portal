import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Spinner } from "../ui/spinner";
import useInternalLogin from "@/hooks/useInternalLogin";
import useLoginUser from "@/hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: dbLogin, isPending: dbPending } = useLoginUser();
  const { mutate: adLogin, isPending: adPending } = useInternalLogin();

  const isPending = dbPending || adPending;

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("All fields are required", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      return;
    }

    const isAD = email.toLowerCase().endsWith("@calbank.net");

    if (isAD) {
      adLogin(
        { email, password },
        {
          onSuccess: () => {
            setEmail("");
            setPassword("");
          },
        },
      );
    } else {
      dbLogin(
        { email, password },
        {
          onSuccess: () => {
            setEmail("");
            setPassword("");
          },
        },
      );
    }
  };

  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-300 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md px-6 py-8 sm:px-10 sm:py-10 flex flex-col gap-5">

        
        <div className="flex justify-center">
          <img
            src="/logo-name.jpg"
            alt="calbank logo"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </div>

        
        <p className="text-sm sm:text-base text-center text-gray-500 font-normal">
          Login to{" "}
          <span className="text-lg sm:text-xl font-semibold text-gray-900">
            Recruitment Portal
          </span>
        </p>

        
        <div className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="Email"
            className="py-5 sm:py-6 px-3 text-sm sm:text-base border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
          <Input
            type="password"
            placeholder="Password"
            className="py-5 sm:py-6 px-3 text-sm sm:text-base border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
        </div>

        
        <Button
          className="w-full bg-amber-400 hover:bg-amber-500 text-white text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors cursor-pointer"
          onClick={handleLogin}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="size-4" />
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </Button>

        
        <div className="flex flex-col items-center gap-1 pt-1">
          <p className="text-sm text-gray-400 font-normal">
            Forgot password?{" "}
            <Link to="/confirmEmail" className="text-amber-500 font-semibold hover:underline">
              Reset
            </Link>
          </p>
          <p className="text-sm text-gray-400 font-normal">
            Don't have an account?{" "}
            <Link to="/signup" className="text-amber-500 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;