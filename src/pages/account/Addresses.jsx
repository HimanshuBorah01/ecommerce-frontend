import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
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
  pinCode: "",
  country: "India",
  type: "home",
};

export default function Addresses() {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      try {
        return await api.get("/addresses");
      } catch (error) {
        return [];
      }
    },
  });

  // Handle different response formats from backend
  const addresses = Array.isArray(data?.addresses)
    ? data.addresses
    : Array.isArray(data)
      ? data
      : [];

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const reset = () => {
    setForm(empty);
    setShowForm(false);
    setEditingId(null);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      // Prepare address data — backend address model uses camelCase fields.
      const addressData = {
        fullName: form.fullName,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        city: form.city,
        state: form.state,
        pinCode: form.pinCode,
        country: form.country || "India",
        type: form.type,
      };

      if (editingId) {
        await api.put(`/addresses/${editingId}`, addressData);
        showMessage("Address updated successfully!", "success");
      } else {
        await api.post("/addresses", addressData);
        showMessage("Address added successfully!", "success");
      }

      reset();
      await refetch();
    } catch (err) {
      let errorMsg = "Failed to save address";

      if (err.data) {
        // Check for errors array FIRST (before message)
        if (
          err.data.errors &&
          Array.isArray(err.data.errors) &&
          err.data.errors.length > 0
        ) {
          // Handle errors array - this is the most specific
          errorMsg = `Validation failed: ${err.data.errors.join(", ")}`;
        } else if (err.data.errors && typeof err.data.errors === "object") {
          const errorList = Object.entries(err.data.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join("; ");
          errorMsg = `Validation failed: ${errorList}`;
        } else if (typeof err.data === "string") {
          errorMsg = err.data;
        } else if (err.data.message) {
          errorMsg = err.data.message;
        } else if (err.data.error) {
          errorMsg = err.data.error;
        } else {
          // Show raw error data for debugging
          errorMsg = `Error: ${JSON.stringify(err.data)}`;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      showMessage(errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (addr) => {
    setForm({
      fullName: addr.fullName || addr.full_name || "",
      phone: addr.phone || "",
      addressLine1: addr.addressLine1 || addr.address_line1 || "",
      addressLine2: addr.addressLine2 || addr.address_line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pinCode: addr.pinCode || addr.pincode || "",
      country: addr.country || "India",
      type: addr.type || "home",
    });
    setEditingId(addr._id || addr.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;
    setDeleteTarget(null);

    try {
      await api.delete(`/addresses/${id}`);
      await refetch();
      showMessage("Address deleted successfully!", "success");
    } catch (err) {
      console.error("Delete error:", err);
      showMessage(err.message || "Failed to delete address", "error");
    }
  };

  const setDefault = async (id) => {
    try {
      await api.put(`/addresses/${id}`, { isDefault: true });
      await refetch();
      showMessage("Default address updated!", "success");
    } catch (err) {
      console.error("Set default error:", err);
      showMessage("Failed to set default address", "error");
    }
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

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
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

      {/* Add/Edit Form */}
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
                value={form.pinCode}
                onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium border capitalize flex items-center gap-1 ${
                      form.type === t
                        ? "border-[#FF5A1F] text-[#FF5A1F] bg-orange-50"
                        : "border-gray-200 text-gray-600"
                    }`}
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

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 skeleton rounded-xl" />
          ))}
        </div>
      ) : addresses.length === 0 && !showForm ? (
        /* Empty State */
        <EmptyState
          icon={<MapPin size={48} className="text-gray-300" />}
          title="No saved addresses"
          description="Add a delivery address to make checkout faster."
          actionLabel="Add Address"
          onAction={() => setShowForm(true)}
        />
      ) : (
        /* Addresses List */
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
                    <p className="font-bold text-[#111827]">
                      {addr.fullName || addr.full_name}
                    </p>
                    <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded">
                      {addr.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {addr.addressLine1 || addr.address_line1}
                    {addr.addressLine2 || addr.address_line2
                      ? `, ${addr.addressLine2 || addr.address_line2}`
                      : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.city}, {addr.state} - {addr.pinCode || addr.pincode}
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

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
