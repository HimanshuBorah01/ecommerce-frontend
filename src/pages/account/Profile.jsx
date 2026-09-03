import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { User, Mail, Phone, Save } from "lucide-react";
import { api } from "@/lib/api";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setMsg("");
    try {
      const res = await api.patch("/auth/me", {
        name: form.full_name,
        phone: form.phone,
      });
      setMsg("✓ Profile updated successfully");
      setSaved(true);
      updateUser({
        name: res?.user?.name,
        phone: res?.user?.phone,
      });
    } catch (err) {
      setMsg(err?.message || "Failed to update profile");
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
          </div>
          <h2 className="font-bold text-[#111827]">
            {form.full_name || "User"}
          </h2>
          <p className="text-sm text-gray-500">{form.email}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Member since</span>
              <span className="font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
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
          {msg && (
            <p
              className={`text-sm mt-2 ${msg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}
            >
              {msg}
            </p>
          )}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
