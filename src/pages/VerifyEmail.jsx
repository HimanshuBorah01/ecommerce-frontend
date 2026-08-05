import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verify = async () => {
      setStatus("loading");
      try {
        await auth.verifyEmail({ token });
        setStatus("success");
        setMessage(
          "Your email has been verified successfully. You can now log in.",
        );
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Email verification failed.");
      }
    };

    verify();
  }, [token]);

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
