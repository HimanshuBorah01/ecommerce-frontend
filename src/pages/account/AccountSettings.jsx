import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Bell, Settings as SettingsIcon } from "lucide-react";

export default function AccountSettings({ type = "settings" }) {
  const config = {
    notifications: {
      icon: Bell,
      title: "Notification Settings",
      desc: "Manage your notification preferences",
    },
    settings: {
      icon: SettingsIcon,
      title: "Account Settings",
      desc: "General account preferences",
    },
  };
  const { icon: Icon, title, desc } = config[type] || config.settings;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: title },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {title}
      </h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 text-center max-w-lg">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon size={28} className="text-[#FF5A1F]" />
        </div>
        <p className="text-gray-500">{desc}</p>
        <p className="text-sm text-gray-400 mt-2">
          This section is coming soon.
        </p>
      </div>
    </div>
  );
}
