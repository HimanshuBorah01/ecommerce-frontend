import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
import { api } from "@/lib/api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      await api.put("/users/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMsg("✓ Password updated successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setMsg("Failed to update password");
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
          { label: "Change Password" },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Change Password
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 max-w-lg"
      >
        <div className="space-y-4">
          {["currentPassword", "newPassword", "confirmPassword"].map(
            (field) => (
              <div key={field}>
                <label className="text-sm text-gray-600 mb-1 block capitalize flex items-center gap-1">
                  <Lock size={14} /> {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
        {msg && (
          <p
            className={`text-sm mt-4 ${msg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}
          >
            {msg}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary mt-6 disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
