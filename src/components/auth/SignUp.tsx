import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import useSignup from "@/hooks/useSignup";
import { Spinner } from "../ui/spinner";

const SignUp = () => {
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const { mutate: signup, isPending } = useSignup();

  const handleSignup = () => {
    if (!firstname || !lastname || !email || !password || !phone) {
      toast.error("All fields are required", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      return;
    }
    signup({ firstName: firstname, middleName: middlename, lastName: lastname, email, password, phone });
  };

  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending) {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-300 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md px-6 py-8 sm:px-10 sm:py-10 flex flex-col gap-4">

        
        <div className="flex justify-center">
          <img
            src="/logo-name.jpg"
            alt="calbank logo"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </div>

        
        <h1 className="text-center text-xl sm:text-2xl font-bold text-gray-900">
          Create Account
        </h1>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="text"
            placeholder="First Name"
            className="py-5 sm:py-6 px-3 text-sm sm:text-base border-gray-300"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
          <Input
            type="text"
            placeholder="Last Name"
            className="py-5 sm:py-6 px-3 text-sm sm:text-base border-gray-300"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
        </div>

        
        <Input
          type="text"
          placeholder="Middle Name (optional)"
          className="py-5 sm:py-6 px-3 text-sm sm:text-base border-gray-300"
          value={middlename}
          onChange={(e) => setMiddlename(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
        />

        
        <Input
          type="email"
          placeholder="Email Address"
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

        
        <Input
          type="tel"
          placeholder="Phone Number"
          className="py-5 sm:py-6 px-3 text-sm sm:text-base border-gray-300"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
        />

        
        <Button
          className="w-full bg-amber-400 hover:bg-amber-500 text-white text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors cursor-pointer"
          onClick={handleSignup}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="size-4" />
              Signing up...
            </span>
          ) : (
            "Sign Up"
          )}
        </Button>

        
        <p className="text-center text-sm sm:text-base text-gray-400 font-normal">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-amber-500 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignUp;