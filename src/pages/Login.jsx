import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "@/api/authClient";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const returnTo = safeReturnTo();
  const debugMode =
    new URLSearchParams(window.location.search).get("debug") === "1";
  const [debugInfo, setDebugInfo] = useState(null);
  const mountCount = React.useRef(0);
  mountCount.current += 1;

  const { checkUserAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.loginViaEmailPassword(email, password);
      await checkUserAuth();
      // Prevent redirect loops: if `returnTo` points back to the login page
      // (or equals the current location), default to home.
      try {
        const current = window.location.pathname + window.location.search;
        const target =
          returnTo === current || returnTo.startsWith("/login")
            ? "/"
            : returnTo;
        navigate(target, { replace: true });
        if (debugMode) setDebugInfo({ target, current, returnTo });
      } catch (navErr) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Gather debug snapshot for the UI when debug mode is enabled.
  const debugSnapshot = (() => {
    if (!debugMode) return null;
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("app_access_token")
        : null;
    const lastLogin =
      typeof window !== "undefined" ? window.__lastAuthLoginResponse : null;
    const sessionKeys =
      typeof window !== "undefined" ? { ...window.sessionStorage } : null;
    return {
      mountCount: mountCount.current,
      current: window.location.pathname + window.location.search,
      returnTo,
      token,
      lastLogin,
      sessionKeys,
      debugInfo,
    };
  })();

  return (
    <AuthSplitLayout
      title="Login to your account"
      sideTitle="Welcome back to Shopy!"
      sideSubtitle="Login to continue shopping and get the best deals on your favorite products."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to={
              "/register" +
              (returnTo !== "/"
                ? "?returnTo=" + encodeURIComponent(returnTo)
                : "")
            }
            className="text-[#FF5A1F] font-semibold hover:underline"
          >
            Register
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#111827]">
            Email or Phone Number
          </Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 border-gray-200 rounded-xl focus:border-[#FF5A1F] focus:ring-[#FF5A1F]/20"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-[#111827]"
            >
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#FF5A1F] hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        <Button
          type="submit"
          className="w-full h-12 font-semibold bg-[#FF5A1F] hover:bg-[#E64A19] rounded-xl text-base"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </AuthSplitLayout>
  );
}
