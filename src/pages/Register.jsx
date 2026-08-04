import React, { useState } from "react";
import { Link } from "react-router-dom";
import auth from "@/api/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Eye, EyeOff, User, Phone } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agree) {
      setError("Please accept the Terms & Conditions and Privacy Policy");
      return;
    }
    setLoading(true);
    try {
      await auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        auth.setToken(result.access_token);
      }
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await auth.resendOtp(email);
      toast({
        title: "Code sent",
        description: "Check your email for the new code.",
      });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    auth.loginWithProvider("google", safeReturnTo());
  };

  if (showOtp) {
    return (
      <AuthSplitLayout
        title="Verify your email"
        subtitle={`We sent a code to ${email}`}
        sideTitle="Almost there!"
        sideSubtitle="Just one more step to start shopping on Shopy."
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-semibold bg-[#FF5A1F] hover:bg-[#E64A19] rounded-xl"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            className="text-[#FF5A1F] font-medium hover:underline"
          >
            Resend
          </button>
        </p>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      title="Create your account"
      subtitle="Join Shopy and start shopping today!"
      sideTitle="Hello there!"
      sideSubtitle="Create your account and enjoy a better shopping experience."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to={
              "/login" +
              (safeReturnTo() !== "/"
                ? "?returnTo=" + encodeURIComponent(safeReturnTo())
                : "")
            }
            className="text-[#FF5A1F] font-semibold hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="pl-10 h-12 border-gray-200 rounded-xl focus:border-[#FF5A1F] focus:ring-[#FF5A1F]/20"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-10 h-12 border-gray-200 rounded-xl focus:border-[#FF5A1F] focus:ring-[#FF5A1F]/20"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111827]">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="pl-10 h-12 border-gray-200 rounded-xl focus:border-[#FF5A1F] focus:ring-[#FF5A1F]/20"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111827]">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="pl-10 pr-10 h-12 border-gray-200 rounded-xl focus:border-[#FF5A1F] focus:ring-[#FF5A1F]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111827]">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="pl-10 pr-10 h-12 border-gray-200 rounded-xl focus:border-[#FF5A1F] focus:ring-[#FF5A1F]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 accent-[#FF5A1F] w-4 h-4 rounded"
          />
          <span>
            I agree to the{" "}
            <Link
              to="/info/terms"
              className="text-[#FF5A1F] font-medium hover:underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/info/privacy-policy"
              className="text-[#FF5A1F] font-medium hover:underline"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
        <Button
          type="submit"
          className="w-full h-12 font-semibold bg-[#FF5A1F] hover:bg-[#E64A19] rounded-xl text-base"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">or</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium border-gray-200 rounded-xl hover:border-gray-300"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>
    </AuthSplitLayout>
  );
}
