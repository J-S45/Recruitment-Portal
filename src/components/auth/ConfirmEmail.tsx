import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Send, ArrowLeft, AlertTriangle } from "lucide-react";
import { Spinner } from "../ui/spinner";
import useConfirmEmail from "@/hooks/useConfirmEmail";

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  

  const { mutate: confirmEmail, isPending } = useConfirmEmail();

  const handleSend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error("Email Address field cannot be blank", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      return;
    }

    confirmEmail({ email });
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

        
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-100">
            <Mail className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        
        <h1 className="text-center text-xl sm:text-2xl font-semibold text-gray-900">
          Confirm your email
        </h1>

        
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-amber-800 leading-relaxed">
            Make sure you enter the exact email you used during registration
          </p>
        </div>

        
        <div className="flex flex-col gap-1.5">
          <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
            Email Address
          </span>
          <Input
            type="email"
            className="py-5 sm:py-6 px-3 text-sm sm:text-base border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            placeholder="you@example.com"
          />
        </div>

        
        <Button
          className="w-full border-gray-300 text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors cursor-pointer"
          variant="outline"
          onClick={handleSend}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="size-4" />
              Sending...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send verification code
            </>
          )}
        </Button>

        
        <Button
          className="w-full border-gray-300 text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors cursor-pointer"
          variant="outline"
          onClick={() => navigate("/login")}
          disabled={isPending}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Button>

        
        <p className="text-center text-sm sm:text-base text-gray-400 font-normal">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-amber-500 hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ConfirmEmail;