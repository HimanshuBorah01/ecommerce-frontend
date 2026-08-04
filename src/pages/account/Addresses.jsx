import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Home,
  Briefcase,
} from "lucide-react";

const empty = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  type: "home",
};

export default function Addresses() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.get("/addresses"),
  });
  const addresses = data?.addresses || data || [];

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setForm(empty);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) await api.put(`/addresses/${editingId}`, form);
      else await api.post("/addresses", form);
      queryClient.invalidateQueries(["addresses"]);
      reset();
    } catch {
      /* bubble */
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (addr) => {
    setForm({ ...empty, ...addr });
    setEditingId(addr._id || addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    await api.delete(`/addresses/${id}`);
    queryClient.invalidateQueries(["addresses"]);
  };

  const setDefault = async (id) => {
    await api.put(`/addresses/${id}/default`);
    queryClient.invalidateQueries(["addresses"]);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Addresses" },
        ]}
      />
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1
          className="text-xl md:text-2xl font-bold text-[#111827]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          My Addresses
        </h1>
        {!showForm && (
          <button
            onClick={() => {
              setForm(empty);
              setEditingId(null);
              setShowForm(true);
            }}
            className="btn-primary text-sm px-4 py-2.5"
          >
            <Plus size={16} /> Add Address
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-4 md:mb-6"
        >
          <h2 className="font-bold text-base md:text-lg text-[#111827] mb-3 md:mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Full Name *
              </label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Phone *
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 mb-1 block">
                Address Line 1 *
              </label>
              <input
                required
                value={form.addressLine1}
                onChange={(e) =>
                  setForm({ ...form, addressLine1: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 mb-1 block">
                Address Line 2
              </label>
              <input
                value={form.addressLine2}
                onChange={(e) =>
                  setForm({ ...form, addressLine2: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">City *</label>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                State *
              </label>
              <input
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Pincode *
              </label>
              <input
                required
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Address Type
              </label>
              <div className="flex gap-2">
                {["home", "work"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border capitalize flex items-center gap-1 ${form.type === t ? "border-[#FF5A1F] text-[#FF5A1F] bg-orange-50" : "border-gray-200 text-gray-600"}`}
                  >
                    {t === "home" ? (
                      <Home size={14} />
                    ) : (
                      <Briefcase size={14} />
                    )}{" "}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Address"
                  : "Save Address"}
            </button>
            <button type="button" onClick={reset} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 skeleton rounded-xl" />
          ))}
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <EmptyState
          icon={<MapPin size={48} className="text-gray-300" />}
          title="No saved addresses"
          description="Add a delivery address to make checkout faster."
          actionLabel="Add Address"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id || addr.id}
              className="bg-white rounded-xl border border-gray-200 p-5 relative"
            >
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  Default
                </span>
              )}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  {addr.type === "work" ? (
                    <Briefcase size={18} className="text-[#FF5A1F]" />
                  ) : (
                    <Home size={18} className="text-[#FF5A1F]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#111827]">{addr.fullName}</p>
                    <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded">
                      {addr.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">📞 {addr.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(addr)}
                  className="text-sm text-gray-600 hover:text-[#FF5A1F] flex items-center gap-1"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr._id || addr.id)}
                  className="text-sm text-gray-600 hover:text-red-500 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr._id || addr.id)}
                    className="text-sm text-gray-600 hover:text-green-600 flex items-center gap-1 ml-auto"
                  >
                    <Check size={14} /> Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
