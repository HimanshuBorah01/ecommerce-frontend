import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Settings, Globe } from "lucide-react";

export default function AccountSettingsPage() {
  const [preferences, setPreferences] = useState({
    language: "English",
    theme: "Light",
    currency: "INR (₹)",
  });

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Account Settings" },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Account Settings
      </h1>

      <div className="space-y-4 md:space-y-6 max-w-2xl">
        {/* Preferences */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
          <h2 className="font-bold text-base md:text-lg text-[#111827] mb-3 md:mb-4 flex items-center gap-2">
            <Settings size={18} className="text-[#FF5A1F]" /> Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                <Globe size={14} /> Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) =>
                  setPreferences({ ...preferences, language: e.target.value })
                }
                className="input-field"
              >
                <option>English</option>
                <option>हिन्दी</option>
                <option>தமிழ்</option>
                <option>తెలుగు</option>
                <option>ಕನ್ನಡ</option>
              </select>
            </div>
            <div></div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Currency
              </label>
              <select
                value={preferences.currency}
                onChange={(e) =>
                  setPreferences({ ...preferences, currency: e.target.value })
                }
                className="input-field"
              >
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}

        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
}
