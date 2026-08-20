import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "@/api/authClient";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setStatus("error");
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    setStatus("loading");

    try {
      await auth.verifyEmail({ otp });
      setStatus("success");
      setMessage("Your email has been verified successfully. You can now log in.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Email verification failed.");
    }
  };

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => navigate("/login", { replace: true }), 2000);
      return () => clearTimeout(t);
    }
  }, [status, navigate]);

  return (
    <AuthSplitLayout
      title={status === "success" ? "Email verified" : "Verify your email"}
      subtitle={
        status === "success"
          ? "Your account is ready."
          : "Enter the 6-digit code sent to your email."
      }
      sideTitle="Almost there!"
      sideSubtitle="We are confirming your email so you can start shopping."
    >
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm border ${
            status === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-100"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">
            Verification Code
          </Label>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit code"
            className="h-12 border-gray-200 rounded-xl focus:border-[#FF5A1F] focus:ring-[#FF5A1F]/20 text-center text-2xl tracking-widest"
            disabled={status === "loading"}
            autoFocus
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-semibold bg-[#FF5A1F] rounded-xl"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Didn&apos;t receive the code?{" "}
        <Link to="/register" className="text-[#FF5A1F] font-medium hover:underline">
          Resend
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
