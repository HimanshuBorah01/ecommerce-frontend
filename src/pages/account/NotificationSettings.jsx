import { useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Bell, Mail, MessageSquare, Tag, Truck, Star } from "lucide-react";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: true,
    priceDrops: false,
    newArrivals: true,
    smsAlerts: false,
    whatsappUpdates: true,
  });

  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

  const groups = [
    {
      title: "Email Notifications",
      icon: Mail,
      items: [
        {
          key: "orderUpdates",
          label: "Order Updates",
          desc: "Get notified about your order status",
        },
        {
          key: "promotions",
          label: "Promotions & Offers",
          desc: "Receive deals and discount alerts",
        },
        {
          key: "newsletter",
          label: "Newsletter",
          desc: "Weekly digest of trending products",
        },
        {
          key: "priceDrops",
          label: "Price Drop Alerts",
          desc: "When wishlist items go on sale",
        },
        {
          key: "newArrivals",
          label: "New Arrivals",
          desc: "Be the first to know about new products",
        },
      ],
    },
    {
      title: "SMS & WhatsApp",
      icon: MessageSquare,
      items: [
        {
          key: "smsAlerts",
          label: "SMS Alerts",
          desc: "Order updates via SMS",
        },
        {
          key: "whatsappUpdates",
          label: "WhatsApp Updates",
          desc: "Order & delivery updates on WhatsApp",
        },
      ],
    },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Notification Settings" },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Notification Settings
      </h1>

      <div className="space-y-4 md:space-y-6 max-w-2xl">
        {groups.map((group) => (
          <div
            key={group.title}
            className="bg-white rounded-xl border border-gray-200 p-4 md:p-5"
          >
            <h2 className="font-bold text-base md:text-lg text-[#111827] mb-3 md:mb-4 flex items-center gap-2">
              <group.icon size={18} className="text-[#FF5A1F]" /> {group.title}
            </h2>
            <div className="space-y-1">
              {group.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-medium text-[#111827]">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(item.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${settings[item.key] ? "bg-[#FF5A1F]" : "bg-gray-200"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings[item.key] ? "translate-x-5" : ""}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
}
