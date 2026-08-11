import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  AlertTriangle,
  Ban,
  BarChart3,
  CheckCircle,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Clock,
  Cookie,
  CreditCard,
  ExternalLink,
  FileText,
  Globe2,
  Handshake,
  Lock,
  Mail,
  MapPin,
  Package,
  RefreshCw,
  Scale,
  ScrollText,
  Settings,
  Share2,
  ShieldCheck,
  Store,
  Tag,
  Target,
  Timer,
  Truck,
  User,
  UserCheck,
} from "lucide-react";

const ICONS = {
  "Information We Collect": ClipboardList,
  "How We Use Your Information": Target,
  "How We Share Your Information": Share2,
  "Cookies and Tracking Technologies": Cookie,
  "Data Security": Lock,
  "Your Rights and Choices": UserCheck,
  "Third-Party Links": ExternalLink,
  "Children's Privacy": ShieldCheck,
  "Changes to This Policy": FileText,
  "Contact Us": Mail,
  "Return Eligibility": CheckCircle,
  "Return Window": Clock,
  "Non-Returnable Items": Ban,
  "Return Process": Package,
  "Refund Process": CircleDollarSign,
  Exchange: RefreshCw,
  "Damaged or Defective Items": AlertTriangle,
  "Important Notes": FileText,
  "Shipping Charges": Truck,
  "Delivery Time": Timer,
  "Order Processing": Package,
  "Order Tracking": MapPin,
  "Delivery Areas": MapPin,
  "International Shipping": Globe2,
  "Failed Deliveries": AlertTriangle,
  "Acceptance of Terms": ScrollText,
  Introduction: ScrollText,
  "Use of Our Website": FileText,
  "User Accounts": User,
  "Products and Pricing": Tag,
  "Orders and Payments": CreditCard,
  "Shipping and Delivery": Truck,
  "Returns and Refunds": RefreshCw,
  "Intellectual Property": ShieldCheck,
  "Limitation of Liability": Scale,
  "Changes to Terms": FileText,
  "What Are Cookies": Cookie,
  "Types of Cookies We Use": BarChart3,
  "Essential Cookies": Lock,
  "Analytics Cookies": BarChart3,
  "Managing Cookies": Settings,
  "Third-Party Cookies": Globe2,
  "Become a Seller": Store,
  "Seller Requirements": ClipboardList,
  "Commission & Fees": CreditCard,
  "Product Listings": Tag,
  "Order Fulfillment": Package,
  Payments: CircleDollarSign,
  "Returns & Refunds": RefreshCw,
  "Seller Support": Handshake,
};

export default function PolicyPageLayout({
  title,
  breadcrumb,
  intro,
  lastUpdated,
  sections,
  trustBanner,
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const scrollToSection = (index) => {
    setActiveSection(index);
    setOpenIndex(index);
    const el = document.getElementById(`section-${index}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleSection = (index) => {
    setActiveSection(index);
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: breadcrumb }]} />

      <div className="mb-6 md:mb-8">
        <h1
          className="text-2xl md:text-4xl font-bold text-[#111827] mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {title}
        </h1>
        {intro && (
          <p className="text-sm md:text-base text-gray-500 max-w-3xl">
            {intro}
          </p>
        )}
        {lastUpdated && (
          <p className="text-xs text-gray-400 mt-2">
            Last updated: {lastUpdated}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 md:gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-4 bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-[#111827] mb-3">
              On this page
            </h3>
            <nav className="space-y-1">
              {sections.map((section, i) => (
                <button
                  key={section.heading}
                  onClick={() => scrollToSection(i)}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === i
                      ? "bg-orange-50 text-[#FF5A1F] font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{section.heading}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Accordion content */}
        <div className="space-y-3">
          {sections.map((section, i) => {
            const SectionIcon = ICONS[section.heading] || FileText;
            const isOpen = openIndex === i;
            const isActive = activeSection === i;

            return (
              <motion.div
                key={section.heading}
                id={`section-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-xl border overflow-hidden transition-colors ${
                  isActive ? "border-orange-200" : "border-gray-200"
                }`}
              >
                <button
                  onClick={() => toggleSection(i)}
                  className="flex items-center gap-3 w-full p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? "bg-orange-50 text-[#FF5A1F]"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <SectionIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-sm md:text-base text-[#111827]">
                      {section.heading}
                    </h2>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 md:px-5 pb-4 md:pb-5 md:pl-[4.75rem]">
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                          {section.body}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Trust banner */}
      {trustBanner && (
        <div className="mt-8 md:mt-10 bg-gradient-to-r from-[#FFF9F5] to-[#FFF3ED] rounded-2xl p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {trustBanner.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-orange-200 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-[#FF5A1F]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#111827]">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-orange-100">
            <p className="text-sm text-gray-600">
              Questions? Email us at{" "}
              <span className="text-[#FF5A1F] font-medium">
                support@shopy.com
              </span>
            </p>
            <a href="mailto:support@shopy.com" className="btn-primary text-sm">
              Contact Us →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
