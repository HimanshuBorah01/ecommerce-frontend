import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Mail, Check } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function ChangeEmail() {
  const { user } = useAuth();
  const [currentEmail, setCurrentEmail] = useState(user?.email || "");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setSent(true);
    // Email change endpoint not available in backend
    // This is a placeholder for future implementation
    setStep(2);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    // Email verification endpoint not available in backend
    // This is a placeholder for future implementation
    setStep(3);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Change Email" },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Change Email
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 max-w-lg">
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mb-2">
              <Mail size={18} className="text-blue-500 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Current email:{" "}
                <span className="font-medium">{currentEmail}</span>
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                New Email Address *
              </label>
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Verification Code
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail size={24} className="text-[#FF5A1F]" />
              </div>
              <p className="text-sm text-gray-600">
                We've sent a verification code to{" "}
                <span className="font-medium text-[#111827]">{newEmail}</span>
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Enter Verification Code *
              </label>
              <input
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength="6"
                className="input-field text-center text-lg tracking-widest"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Verify & Update Email
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:text-[#FF5A1F]"
            >
              Change email address
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="font-bold text-lg text-[#111827] mb-2">
              Email Updated!
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Your email has been changed to{" "}
              <span className="font-medium">{newEmail}</span>
            </p>
            <a href="/account/profile" className="btn-primary">
              Back to Profile
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
