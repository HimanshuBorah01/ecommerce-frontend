import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import auth from "@/api/authClient";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token") || "";
  const attempted = useRef(false);
  const navigate = useNavigate();
  const debugMode = searchParams.get("debug") === "1";
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    // If we've attempted verification for this token recently, avoid calling the API again
    // to prevent hitting rate limits on the backend. Uses sessionStorage so attempts
    // are scoped to the browser session and cleared when the tab/window closes.
    try {
      const last = window.sessionStorage.getItem(`verify_attempt_${token}`);
      const FIVE_MIN = 5 * 60 * 1000;
      if (last && Date.now() - Number(last) < FIVE_MIN) {
        setStatus("error");
        setMessage("Too many requests. Please try again later.");
        return;
      }
    } catch (e) {
      // sessionStorage may be unavailable in some environments; ignore and continue.
    }

    // Ensure we only attempt verification once per mount.
    if (attempted.current) return;
    attempted.current = true;

    let isMounted = true;

    const verify = async () => {
      setStatus("loading");
      // mark this token as attempted in sessionStorage immediately
      try {
        window.sessionStorage.setItem(
          `verify_attempt_${token}`,
          String(Date.now()),
        );
      } catch (e) {
        /* ignore */
      }
      try {
        await auth.verifyEmail({ token });
        if (!isMounted) return;
        setStatus("success");
        setMessage(
          "Your email has been verified successfully. You can now log in.",
        );
        try {
          window.sessionStorage.setItem(`verify_success_${token}`, "1");
        } catch (e) {
          /* ignore */
        }
        if (debugMode) setDebugInfo({ ok: true, note: "verified" });
      } catch (error) {
        if (!isMounted) return;
        setStatus("error");
        setMessage(error.message || "Email verification failed.");
        if (debugMode) setDebugInfo({ status: error.status, data: error.data });
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Auto-redirect to login after successful verification.
  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => navigate("/login", { replace: true }), 2000);
    return () => clearTimeout(t);
  }, [status, navigate]);

  return (
    <AuthSplitLayout
      title={status === "success" ? "Email verified" : "Verify your email"}
      subtitle={
        status === "success"
          ? "Your account is ready."
          : "Verifying your email address..."
      }
      sideTitle="Almost there!"
      sideSubtitle="We are confirming your email so you can start shopping."
    >
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-white text-sm text-gray-700 border border-gray-200">
          {message}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {status === "loading" ? (
          <Button
            className="w-full h-12 font-semibold bg-[#FF5A1F] rounded-xl"
            disabled
          >
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
          </Button>
        ) : (
          <Link to="/login">
            <Button className="w-full h-12 font-semibold bg-[#FF5A1F] rounded-xl">
              Go to Login
            </Button>
          </Link>
        )}
      </div>
    </AuthSplitLayout>
  );
}
