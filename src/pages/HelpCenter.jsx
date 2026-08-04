import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Search,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  User,
  ChevronDown,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

const CATEGORIES = [
  {
    icon: Package,
    title: "Orders & Delivery",
    desc: "Track, modify, or cancel your orders",
    topics: [
      "How to track my order?",
      "Cancel or modify an order",
      "Delivery time & charges",
      "Missed delivery",
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Pricing",
    desc: "Payment methods and pricing questions",
    topics: [
      "Accepted payment methods",
      "EMI options",
      "Price match guarantee",
      "Payment failed but money deducted",
    ],
  },
  {
    icon: RefreshCw,
    title: "Returns & Refunds",
    desc: "Return products and get refunds",
    topics: [
      "How to return a product",
      "Refund timeline",
      "Non-returnable items",
      "Exchange policy",
    ],
  },
  {
    icon: User,
    title: "Account & Profile",
    desc: "Manage your account settings",
    topics: [
      "Update profile",
      "Change password",
      "Delete account",
      "Login issues",
    ],
  },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Help Center" }]}
      />

      <div className="text-center mb-6 md:mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-[#111827] mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          How can we help you?
        </h1>
        <p className="text-sm md:text-base text-gray-500 mb-6">
          Search our help articles or browse by category
        </p>
        <div className="flex max-w-xl mx-auto border-2 border-[#FF5A1F] rounded-lg overflow-hidden bg-white">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for help..."
            className="flex-1 px-4 py-3 text-sm focus:outline-none"
          />
          <button className="px-5 bg-[#FF5A1F] text-white">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
        {CATEGORIES.map((cat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenCategory(openCategory === i ? null : i)}
              className="flex items-center gap-3 w-full p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                <cat.icon size={18} className="text-[#FF5A1F]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm md:text-base text-[#111827]">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-500">{cat.desc}</p>
              </div>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform flex-shrink-0 ${openCategory === i ? "rotate-180" : ""}`}
              />
            </button>
            {openCategory === i && (
              <div className="px-4 md:px-5 pb-4 space-y-2">
                {cat.topics.map((topic, j) => (
                  <Link
                    key={j}
                    to="/faq"
                    className="block text-sm text-gray-600 hover:text-[#FF5A1F] py-1.5 transition-colors"
                  >
                    → {topic}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
        <h2 className="font-bold text-base md:text-lg text-[#111827] mb-4">
          Still need help? Contact us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <a
            href="mailto:support@shopy.com"
            className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-[#FF5A1F] hover:bg-orange-50 transition-all"
          >
            <Mail size={24} className="text-[#FF5A1F]" />
            <p className="text-sm font-medium text-[#111827]">Email</p>
            <p className="text-xs text-gray-500">support@shopy.com</p>
          </a>
          <a
            href="tel:+918001234567"
            className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-[#FF5A1F] hover:bg-orange-50 transition-all"
          >
            <Phone size={24} className="text-[#FF5A1F]" />
            <p className="text-sm font-medium text-[#111827]">Call Us</p>
            <p className="text-xs text-gray-500">1800-123-4567</p>
          </a>
          <div className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-[#FF5A1F] hover:bg-orange-50 transition-all cursor-pointer">
            <MessageCircle size={24} className="text-[#FF5A1F]" />
            <p className="text-sm font-medium text-[#111827]">Live Chat</p>
            <p className="text-xs text-gray-500">24x7 available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
