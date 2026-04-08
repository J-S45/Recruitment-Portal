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

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

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

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center bg-amber-300 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full sm:max-w-md bg-white rounded-sm py-12 sm:py-8 sm:px-10 md:py-10 md:12 px-16 font-bold text-[32px] text-black flex flex-col gap-4 sm:gap-5 z-50 shadow-md">
        <div className="flex justify-center w-full rounded-md gap-2">
          <img
            src="/logo-name.jpg"
            alt="calbank logo"
            className="h-20 w-auto sm:h-16 md:h-18 object-contain"
          />
        </div>
        <p className="text-base text-center font-normal">
          Login to{" "}
          <span className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-black">
            Recruitment Portal
          </span>
        </p>
        <Input
          type="email"
          placeholder="Email"
          className="py-5 sm:py-6 px-3 text-sm sm:text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          className="py-5 sm:py-6 px-3 text-sm sm:text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="cursor-pointer w-full bg-amber-400 hover:bg-amber-500 text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors"
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

        {/* Forgot password + Sign up grouped together */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <p className="text-sm text-gray-400 font-normal">
            Forgot password?{" "}
            <Link
              to="/confirmEmail"
              className="text-amber-500 font-semibold hover:underline"
            >
              Reset
            </Link>
          </p>
          <p className="text-sm text-gray-400 font-normal">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-amber-500 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
