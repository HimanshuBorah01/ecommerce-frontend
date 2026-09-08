import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";

function NotificationBreadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.to ? (
              <a href={item.to} className="hover:text-[#FF5A1F]">
                {item.label}
              </a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const defaultNotificationSettings = {
  orderUpdates: true,
  promotions: true,
  newsletter: true,
  priceDrops: false,
  newArrivals: true,
};

export default function NotificationSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: () => api.get("/notifications/settings"),
    retry: false,
  });

  const saveMutation = useMutation({
    mutationKey: ["notification-settings"],
    mutationFn: (settings) =>
      api.patch("/notifications/settings", { notificationSettings: settings }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div>
        <NotificationBreadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Account", to: "/account" },
            { label: "Notification Settings" },
          ]}
        />
        <div className="space-y-4 mt-4">
          <div className="h-64 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <NotificationBreadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Account", to: "/account" },
            { label: "Notification Settings" },
          ]}
        />
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          Failed to load settings. Please try again.
        </div>
      </div>
    );
  }

  const settings = {
    ...defaultNotificationSettings,
    orderUpdates:
      data?.notificationSettings?.orderUpdates ??
      defaultNotificationSettings.orderUpdates,
    promotions:
      data?.notificationSettings?.promotions ??
      defaultNotificationSettings.promotions,
    newsletter:
      data?.notificationSettings?.newsletter ??
      defaultNotificationSettings.newsletter,
    priceDrops:
      data?.notificationSettings?.priceDrops ??
      defaultNotificationSettings.priceDrops,
    newArrivals:
      data?.notificationSettings?.newArrivals ??
      defaultNotificationSettings.newArrivals,
  };

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    saveMutation.mutate(/** @type {any} */ (updated), {
      onError: (error) => {
        toast({
          title: "Failed to save",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

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
  ];

  return (
    <div>
      <NotificationBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Notification Settings" },
        ]}
      />
      <h1
        className="text-xl md:text-2xl font-bold text-[#111827] mb-4 md:mb-6 mt-4"
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
                    onClick={() => handleToggle(item.key)}
                    disabled={saveMutation.isPending}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${settings[item.key] ? "bg-[#FF5A1F]" : "bg-gray-200"} ${saveMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
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
      </div>
    </div>
  );
}
