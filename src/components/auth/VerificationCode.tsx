import { Check } from "lucide-react";
import { Button } from "src/components/ui/button";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerificationCode = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null));

  const resetEmail = sessionStorage.getItem("resetEmail") ?? "";

    const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (!domain) return email;
    return `${local.charAt(0)}***@${domain}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    pasted.split("").forEach((char, i) => { newDigits[i] = char; });
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSend = () => {
    const code = digits.join("");
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit code.", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      return;
    }
    console.log("OTP submitted:", code);
    navigate("/reset-password");
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
          <span className="text-sm font-normal text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-4 py-1.5">
            Code sent to {resetEmail ? maskEmail(resetEmail) : "your email"}
          </span>
        </div>

        
        <h1 className="text-center text-xl sm:text-2xl font-semibold text-gray-900">
          Enter verification code
        </h1>

        
        <p className="text-sm sm:text-base font-normal text-gray-500 text-center leading-relaxed">
          We sent a 6-digit code to your registered email. It expires in 5 minutes.
        </p>

        
        <div className="flex w-full gap-2 sm:gap-3">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el: HTMLInputElement | null) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              className={`
                flex-1 min-w-0 h-12 sm:h-14
                border rounded-lg text-center font-bold text-xl sm:text-2xl
                transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400
                ${digit
                  ? "border-amber-400 bg-amber-50 text-amber-800"
                  : "border-gray-300 text-gray-900"}
              `}
            />
          ))}
        </div>

        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 font-normal">Expires in 07:42</span>
          <button
            type="button"
            className="text-sm font-semibold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
          >
            Resend code
          </button>
        </div>

        
        <Button
          className="w-full bg-amber-400 hover:bg-amber-500 text-white text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors cursor-pointer"
          onClick={handleSend}
        >
          <Check className="w-4 h-4 mr-2" />
          Verify code
        </Button>

        
        <p className="text-center text-sm text-gray-400 font-normal">
          Didn't receive it? Check your spam folder.
        </p>

      </div>
    </div>
  );
};

export default VerificationCode;