import { Link } from "react-router-dom";
import { Zap, CreditCard, Percent, Gift } from "lucide-react";
import { useState, useEffect } from "react";

function Countdown({ targetHours = 8 }) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) {
          m--;
          s = 59;
        } else if (h > 0) {
          h--;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 mt-1">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-[#111827] text-white text-xs font-bold px-1.5 py-0.5 rounded">
            {v}
          </span>
          {i < 2 && <span className="text-[#111827] font-bold text-xs">:</span>}
        </span>
      ))}
    </div>
  );
}

const promos = [
  {
    icon: Zap,
    label: "Flash Sale",
    sub: "Up to 60% Off · Limited time offer",
    to: "/search?deals=true",
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-[#FF5A1F] bg-orange-100",
    countdown: true,
  },
  {
    icon: CreditCard,
    label: "Bank Offers",
    sub: "Up to ₹1000 Instant Discount",
    to: "/search",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600 bg-green-100",
  },
  {
    icon: Percent,
    label: "No Cost EMI",
    sub: "Available on leading banks",
    to: "/search",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600 bg-blue-100",
  },
  {
    icon: Gift,
    label: "Deal of the Day",
    sub: "Best deals everyday",
    to: "/search?deals=true",
    color: "bg-yellow-50 border-yellow-200",
    iconColor: "text-yellow-600 bg-yellow-100",
  },
];

export default function PromoStrip({ type = "default" }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 my-4 md:my-6">
      {promos.map(
        ({ icon: Icon, label, sub, to, color, iconColor, countdown }) => (
          <Link
            key={label}
            to={to}
            className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border ${color} hover:shadow-md transition-all group ${countdown ? "col-span-2 md:col-span-1" : ""}`}
          >
            <div
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}
            >
              <Icon size={16} className="md:hidden" />
              <Icon size={18} className="hidden md:block" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-bold text-[#111827] group-hover:text-[#FF5A1F] transition-colors truncate">
                {label}
              </p>
              <p className="text-[10px] md:text-xs text-gray-500 truncate">
                {sub}
              </p>
              {countdown && (
                <div className="flex items-center gap-1 mt-1">
                  <Countdown />
                </div>
              )}
            </div>
            <span className="text-[#FF5A1F] text-sm font-medium group-hover:translate-x-1 transition-transform flex-shrink-0">
              →
            </span>
          </Link>
        ),
      )}
    </div>
  );
}
