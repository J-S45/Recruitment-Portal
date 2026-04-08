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
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const {mutate: signup, isPending } = useSignup();

  const handleSignup = () => {
    if (!firstname ||!lastname || !email || !password || !phone ) {
      event?.preventDefault()
      toast.error("All fields are required", {
        position: "top-right",
        style: {
          color: "#ef4444",
        },
      });
      return;
    }
    signup({ firstName:firstname,middleName:middlename,lastName:lastname, email, password, phone});
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
        <h6 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-black">
          Create Account
        </h6>
        <Input
          type="text"
          placeholder="First Name"
          className="py-5 sm:py-6 px-3 text-sm sm:text-base"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Middle Name"
          className="py-5 sm:py-6 px-3 text-sm sm:text-base"
          value={middlename}
          onChange={(e) => setMiddlename(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Last Name"
          className="py-5 sm:py-6 px-3 text-sm sm:text-base"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email Address"
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
        <Input
          type="tel"
          placeholder="Phone Number"
          className="py-5 sm:py-6 px-3 text-sm sm:text-base"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button
          className="cursor-pointer w-full bg-amber-400 hover:bg-amber-500 text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors"
          onClick={handleSignup}
          disabled={isPending}
        >
         {isPending ?  (
  <span className="flex items-center justify-center gap-2">
    <Spinner className="size-4" />
    Signing up...
  </span>
) :"Sign Up"}
        </Button>
        {/* <p className="text-sm sm:text-base text-gray-400 text-center">OR</p> */}
        {/* <div className="flex items-center justify-center gap-4">
          <FcGoogle className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 hover:opacity-80 transition-opacity" />
        </div> */}
        <div className="text-center">
          <span className="text-base text-gray-400 font-normal">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="text-base font-medium text-amber-500 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

// import { useState } from "react";
// import { Button } from "src/components/ui/button";
// import { Input } from "src/components/ui/input";
// import { toast } from "sonner";
// import { Link } from "react-router-dom";
// import useSignup from "@/hooks/useSignup";

// // 👇 Utility function to encrypt password
// const encryptPassword = async (plainTextPassword: string): Promise<string> => {
//   // 1. Fetch public key from backend
//   const res = await fetch("https://51frp7zh-8081.uks1.devtunnels.ms/api/auth/public-key");
//   const publicKeyBase64 = await res.text();

//   // 2. Import the key
//   const keyBytes = Uint8Array.from(atob(publicKeyBase64), (c) => c.charCodeAt(0));
//   const publicKey = await crypto.subtle.importKey(
//     "spki",
//     keyBytes.buffer,
//     { name: "RSA-OAEP", hash: "SHA-1" },
//     false,
//     ["encrypt"]
//   );

//   // 3. Encrypt the password
//   const encoder = new TextEncoder();
//   const encryptedBuffer = await crypto.subtle.encrypt(
//     { name: "RSA-OAEP" },
//     publicKey,
//     encoder.encode(plainTextPassword)
//   );

//   // 4. Base64-encode and return
//   return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
// };

// const SignUp = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [isEncrypting, setIsEncrypting] = useState(false); // 👈 track encryption state

//   const { mutate: signup, isPending } = useSignup();

//   const handleSignup = async () => {
//     if (!name || !email || !password || !phone) {
//       toast.error("All fields are required", {
//         position: "top-right",
//         style: { color: "#ef4444" },
//       });
//       return;
//     }

//     try {
//       setIsEncrypting(true);

//       // 👇 encrypt password before sending
//       const encryptedPassword = await encryptPassword(password);

//       signup({
//         fullName: name,
//         email,
//         password: encryptedPassword, // 👈 send encrypted password
//         phone,
//       });
//     } catch (err) {
//       toast.error("Encryption failed. Please try again.", {
//         position: "top-right",
//         style: { color: "#ef4444" },
//       });
//       console.error("❌ Encryption error:", err);
//     } finally {
//       setIsEncrypting(false);
//     }
//   };

//   const isLoading = isPending || isEncrypting;

//   return (
//     <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center bg-amber-300 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="max-w-sm w-full sm:max-w-md bg-white rounded-sm py-12 sm:py-8 sm:px-10 md:py-10 md:12 px-16 font-bold text-[32px] text-black flex flex-col gap-4 sm:gap-5 z-50 shadow-md">
//         <div className="flex justify-center w-full rounded-md gap-2">
//           <img
//             src="/logo-name.jpg"
//             alt="calbank logo"
//             className="h-20 w-auto sm:h-16 md:h-18 object-contain"
//           />
//         </div>
//         <h6 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-black">
//           Create Account
//         </h6>
//         <Input
//           type="text"
//           placeholder="Full Name"
//           className="py-5 sm:py-6 px-3 text-sm sm:text-base"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <Input
//           type="email"
//           placeholder="Email Address"
//           className="py-5 sm:py-6 px-3 text-sm sm:text-base"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Input
//           type="password"
//           placeholder="Password"
//           className="py-5 sm:py-6 px-3 text-sm sm:text-base"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Input
//           type="tel"
//           placeholder="Phone Number"
//           className="py-5 sm:py-6 px-3 text-sm sm:text-base"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//         />
//         <Button
//           className="cursor-pointer w-full bg-amber-400 hover:bg-amber-500 text-sm sm:text-base font-medium rounded-lg py-5 sm:py-6 transition-colors"
//           onClick={handleSignup}
//           disabled={isLoading}
//         >
//           {isEncrypting ? "Encrypting..." : isPending ? "Signing Up..." : "Sign Up"}
//         </Button>

//         <div className="text-center">
//           <span className="text-base text-gray-400 font-normal">
//             Already have an account?{" "}
//           </span>
//           <Link
//             to="/login"
//             className="text-base font-medium text-amber-500 hover:underline"
//           >
//             Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;