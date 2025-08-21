"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verifyCode }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          "Account verified successfully! Redirecting to dashboard..."
        );
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        toast.error(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Verify Your Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-xl font-mono tracking-widest"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Check your email for the 6-digit verification code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Verify Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors cursor-pointer"
                onClick={() =>
                  toast.info("Resend functionality will be implemented soon")
                }
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
