import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { Spinner } from "../ui/spinner";
import useResetPassword from "@/hooks/useResetPassword";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const getStrength = (pwd: string) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
    if (pwd.length < 10) return { label: "Fair", color: "bg-amber-400", width: "w-2/4" };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const strength = getStrength(newPassword);

  const handleSubmit = () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Both password fields are required.", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      return;
    }

    resetPassword({ newPassword, confirmPassword, token }); 
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending) handleSubmit();
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
            <KeyRound className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Set new password
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
            Choose a strong password you haven't used before.
          </p>
        </div>

       
        <div className="flex flex-col gap-1.5">
          <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
            New Password
          </span>
          <div className="relative">
            <Input
              type={showNew ? "text" : "password"}
              className="py-5 sm:py-6 px-3 pr-10 text-sm sm:text-base border-gray-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter new password"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          
          {strength && (
            <div className="flex flex-col gap-1 mt-1">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
              </div>
              <span className={`text-xs font-medium ${
                strength.label === "Weak"   ? "text-red-500"   :
                strength.label === "Fair"   ? "text-amber-500" :
                strength.label === "Good"   ? "text-blue-500"  : "text-green-600"
              }`}>
                {strength.label} password
              </span>
            </div>
          )}
        </div>

        
        <div className="flex flex-col gap-1.5">
          <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
            Confirm New Password
          </span>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              className={`py-5 sm:py-6 px-3 pr-10 text-sm sm:text-base transition-colors ${
                passwordsMismatch ? "border-red-300 focus-visible:ring-red-300"    :
                passwordsMatch    ? "border-green-400 focus-visible:ring-green-300" :
                "border-gray-300"
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Re-enter new password"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {passwordsMismatch && (
            <span className="text-xs text-red-500 font-medium">Passwords do not match.</span>
          )}
          {passwordsMatch && (
            <span className="text-xs text-green-600 font-medium">Passwords match!</span>
          )}
        </div>

       
        <ul className="text-xs text-gray-400 space-y-0.5 list-disc list-inside">
          <li className={newPassword.length >= 8   ? "text-green-600" : ""}>At least 8 characters</li>
          <li className={/[A-Z]/.test(newPassword)  ? "text-green-600" : ""}>One uppercase letter</li>
          <li className={/[0-9]/.test(newPassword)  ? "text-green-600" : ""}>One number</li>
        </ul>

        
        <Button
          className="w-full bg-amber-400 hover:bg-amber-500 text-white text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors cursor-pointer disabled:opacity-60"
          onClick={handleSubmit}
          disabled={passwordsMismatch || isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="size-4" />
              Updating...
            </span>
          ) : (
            "Update Password"
          )}
        </Button>

        
        <p className="text-center text-sm sm:text-base text-gray-400 font-normal">
          Back to{" "}
          <Link to="/login" className="font-semibold text-amber-500 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;