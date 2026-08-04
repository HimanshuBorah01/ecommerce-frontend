import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  User,
  Mail,
  Phone,
  Save,
  Camera,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.put("/users/profile", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      /* bubble */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Profile" },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Avatar card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF5A1F] to-[#E64A19] flex items-center justify-center text-white text-3xl font-bold">
              {(form.full_name || "U").charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-[#FF5A1F]">
              <Camera size={14} className="text-gray-600" />
            </button>
          </div>
          <h2 className="font-bold text-[#111827]">
            {form.full_name || "User"}
          </h2>
          <p className="text-sm text-gray-500">{form.email}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Member since</span>
              <span className="font-medium">
                {new Date(user?.created_date || Date.now()).toLocaleDateString(
                  "en-IN",
                  { month: "short", year: "numeric" },
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="font-bold text-[#111827] mb-4">Edit Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block flex items-center gap-1">
                <User size={14} /> Full Name
              </label>
              <input
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block flex items-center gap-1">
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                value={form.email}
                disabled
                className="input-field opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block flex items-center gap-1">
                <Phone size={14} /> Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field"
                placeholder="Add phone number"
              />
            </div>
            <div className="md:col-span-2"></div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Profile updated successfully
              </span>
            )}
          </div>
        </form>

        {/* Delete Account */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-red-200 p-5 md:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="font-bold text-red-600">Delete Account</h2>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
          </div>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} /> Delete My Account
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
      </div>
    </div>
  );
}
