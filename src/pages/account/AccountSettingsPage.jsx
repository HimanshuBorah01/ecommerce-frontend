import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Settings, Globe, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccountSettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    language: "English",
    theme: "Light",
    currency: "INR (₹)",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-4 md:p-5">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-50 transition-colors text-left"
            >
              <Trash2 size={18} className="text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600">
                  Delete Account
                </p>
                <p className="text-xs text-gray-500">
                  Permanently delete your account and all data
                </p>
              </div>
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                Are you sure? This action cannot be undone. All your orders,
                addresses, and wishlist data will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-outline text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"
                >
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
}
