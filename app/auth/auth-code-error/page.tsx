import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md relative">
        {/* Glass effect card */}
        <div className="relative z-10 bg-[#1C2117]/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-red-500/30 shadow-2xl shadow-black/40 text-center">
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center border border-red-500/30">
              <FaExclamationTriangle className="text-red-500 text-3xl" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#E7E4D8] mb-4">
            Authentication Error
          </h1>
          
          <p className="text-[#A6A99F] text-sm mb-8">
            There was a problem verifying your login. This usually happens if the login link has expired or if there is a configuration issue with the authentication provider.
          </p>

          <Link 
            href="/login"
            className="w-full py-3.5 bg-[#C6A15B] text-[#12150F] rounded-xl hover:bg-[#d4b46d] transition-all font-bold text-sm shadow-lg shadow-[#C6A15B]/20 hover:shadow-xl hover:shadow-[#C6A15B]/30 inline-flex items-center justify-center"
          >
            Return to Login
          </Link>
        </div>

        {/* Decorative glow behind card */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-900/10 rounded-3xl blur-2xl -z-10"></div>
      </div>
    </div>
  );
}
