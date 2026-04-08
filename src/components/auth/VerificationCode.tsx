import { Check} from "lucide-react"; 
import { Button } from "src/components/ui/button";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerificationCode = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
 const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null));

  
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
    // replace with actual API call
    console.log("OTP submitted:", code);
    navigate("/reset-password"); 
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
          <div className="flex items-center justify-center w-[70%] rounded-lg bg-amber-200">
            <span className="text-base font-normal text-amber-500">Code sent to j***@gmail.com</span> 
          </div>
        </div>

       
        <h1 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-black">
          Enter verification code
        </h1>

        
        <span className="text-sm font-normal text-gray-500 text-center leading-relaxed">
          We sent a 6-digit code to your registered email. It expires in 5 minutes.
        </span>

        
        <div className="flex w-full max-w-[360px] gap-x-2.5 sm:gap-3">
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
              className={`w-full h-14 border rounded-lg text-center font-bold text-2xl transition-colors
                ${digit ? "border-amber-400 bg-amber-50 text-amber-800" : "border-gray-300"}
                focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400`}
            />
          ))}
        </div>

        
        <div className="flex items-center justify-between">
          <span className="text-sm font-normal text-gray-500">Expires in 07:42</span>
          <span className="text-sm font-medium text-amber-500 cursor-pointer hover:text-amber-600">
            Resend code
          </span>
        </div>

        
        <Button
          className="cursor-pointer w-full bg-amber-400 hover:bg-amber-500 text-black text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors"
          onClick={handleSend} 
        >
          <Check className="w-4 h-4 mr-2" />
          Verify code
        </Button>

        
        <div className="text-center">
          <span className="text-sm text-gray-400 font-normal">
            Didn't receive it? Check your spam folder.
          </span>
        </div>

      </div>
    </div>
  );
};

export default VerificationCode;