import React, { useState } from "react";
import { Link } from "react-router-dom";
import auth from "@/api/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Eye, EyeOff, User, Phone } from "lucide-react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
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
  const [showVerificationSent, setShowVerificationSent] = useState(false);
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
      await auth.register({
        name: fullName,
        email,
        phone,
        password,
        confirmPassword,
      });
      setShowVerificationSent(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await auth.resendVerificationEmail(email);
      toast({
        title: "Email sent",
        description: "Check your inbox for the verification link.",
      });
    } catch (err) {
      setError(err.message || "Failed to resend verification email");
    }
  };

  if (showVerificationSent) {
    return (
      <AuthSplitLayout
        title="Verify your email"
        subtitle={`We sent a verification link to ${email}`}
        sideTitle="Almost there!"
        sideSubtitle="Check your inbox and click the link to verify your account."
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}
        <div className="mb-6 text-sm text-gray-600">
          <p>
            A verification link has been sent to <strong>{email}</strong>.
          </p>
          <p>
            Please open your email and click the link to complete registration.
          </p>
        </div>
        <Button
          className="w-full h-12 font-semibold bg-[#FF5A1F] hover:bg-[#E64A19] rounded-xl"
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resending...
            </>
          ) : (
            "Resend verification email"
          )}
        </Button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already verified?{" "}
          <Link
            to="/login"
            className="text-[#FF5A1F] font-medium hover:underline"
          >
            Login
          </Link>
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
    </AuthSplitLayout>
  );
}
