import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Send, ArrowLeft, AlertTriangle } from "lucide-react";

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error("Email Address field cannot be blank", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      return;
    }

    // your send verification logic here
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center bg-amber-300 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full sm:max-w-md bg-white rounded-sm py-12 sm:py-8 sm:px-10 md:py-10 px-16 font-bold text-[32px] text-black flex flex-col gap-4 sm:gap-5 z-50 shadow-md">
        
        
        <div className="flex justify-center w-full">
          <img
            src="/logo-name.jpg"
            alt="calbank logo"
            className="h-20 w-auto sm:h-16 md:h-18 object-contain"
          />
        </div>

        
        <div className="flex justify-center w-full">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-200">
            <Mail className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        
        <h1 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-black">
          Confirm your email
        </h1>
        <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-3 mb-8">          
            <AlertTriangle className="w-4 h-8 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-base text-amber-800 leading-relaxed">
           Make sure you enter the exact email you used during registration
          </p>
      </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Email Address
          </span>
          <Input
            type="email"
            className="py-5 border-gray-400 sm:py-6 px-3 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        
        <Button
          className="cursor-pointer w-full border-gray-400 text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors"
          variant="outline"
          onClick={handleSend}
        >
          <Send className="w-4 h-4 mr-2" />
          Send verification code
        </Button>

        
        <Button
          className="cursor-pointer w-full border-gray-400 text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors"
          variant="outline"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Button>

        <div className="text-center">
          <span className="text-base text-gray-400 font-normal">
            Don't have an account?{" "}
          </span>
          <Link
            to="/signup"
            className="text-base font-medium text-amber-500 hover:underline"
          >
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;