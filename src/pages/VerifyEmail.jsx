import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import auth from "@/api/authClient";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const STORAGE_KEY = "verify_email_pending";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  useEffect(() => {
    if (emailFromState) {
      sessionStorage.setItem(STORAGE_KEY, emailFromState);
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && !resendEmail) {
      setResendEmail(stored);
    }
  }, [emailFromState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setStatus("loading");

    try {
      await auth.verifyEmail({ otp });
      sessionStorage.removeItem(STORAGE_KEY);
      toast({
        title: "Email verified",
        description: "Your email is now verified. You can log in.",
      });
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (error) {
      setStatus("error");
      toast({
        title: "Verification failed",
        description: error.message || "Email verification failed.",
        variant: "destructive",
      });
    } finally {
      setStatus("idle");
    }
  };

  const handleResend = async () => {
    const emailToUse = resendEmail || emailFromState;
    if (!emailToUse) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend the OTP.",
        variant: "destructive",
      });
      return;
    }
    setResendLoading(true);
    try {
      await auth.resendVerificationEmail(emailToUse);
      sessionStorage.setItem(STORAGE_KEY, emailToUse);
      toast({
        title: "OTP sent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Failed to resend",
        description: error.data?.errors?.[0] || error.message || "Failed to resend verification email",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Verify your email"
      subtitle={
        emailFromState
          ? "Your email is not verified. Enter the OTP below or resend it."
          : "Enter the 6-digit code sent to your email."
      }
      sideTitle="Almost there!"
      sideSubtitle="We are confirming your email so you can start shopping."
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
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

      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">
            Resend verification code
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              value={resendEmail || emailFromState}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-10 h-12 border-gray-200 rounded-xl focus:border-[#FF5A1F] focus:ring-[#FF5A1F]/20"
              disabled={resendLoading}
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          variant="outline"
          className="w-full h-12 font-semibold rounded-xl"
        >
          {resendLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resending...
            </>
          ) : (
            "Resend verification code"
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Didn&apos;t receive the code?{" "}
        <Link to="/register" className="text-[#FF5A1F] font-medium hover:underline">
          Resend
        </Link>
      </p>
    </AuthSplitLayout>
  );
}