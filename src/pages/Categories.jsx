import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import NewsletterPopup from "@/components/NewsletterPopup";
import { ArrowRight, Award, Tag, RefreshCw, Loader2, Smartphone, Shirt, Home, Gem, Dumbbell, BookOpen, Puzzle, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

const highlights = [
  { icon: Award, label: "Best Prices", sub: "Great deals" },
  { icon: Tag, label: "Quality Products", sub: "100% trusted" },
  { icon: RefreshCw, label: "Easy Returns", sub: "Hassle free" },
];

export default function Categories() {
  const [showPopup, setShowPopup] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email?.value || "";
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setSubLoading(true);
    try {
      await api.post("/newsletter/subscribe", { email });
      setSubEmail(email);
      setShowPopup(true);
      e.target.reset();
    } catch (err) {
      toast({
        title: "Subscription failed",
        description: err.message || "Could not subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubLoading(false);
    }
  };

  const categories = [
    {
      name: "Electronics",
      slug: "electronics",
      productCount: 2456,
      description: "Mobiles, laptops, headphones, TVs, cameras and more",
      color: "#0B7485",
      icon: Smartphone,
    },
    {
      name: "Fashion",
      slug: "fashion",
      productCount: 3789,
      description: "Men, women & kids clothing, shoes, accessories and more",
      color: "#E2556B",
      icon: Shirt,
    },
    {
      name: "Home & Kitchen",
      slug: "home-kitchen",
      productCount: 4321,
      description: "Furniture, home decor, kitchen appliances and more",
      color: "#4E9A66",
      icon: Home,
    },
    {
      name: "Beauty & Wellness",
      slug: "beauty",
      productCount: 2145,
      description: "Skincare, makeup, haircare, fragrances and more",
      color: "#D67BA7",
      icon: Gem,
    },
    {
      name: "Sports & Fitness",
      slug: "sports",
      productCount: 1234,
      description: "Sports shoes, fitness gear, equipment and more",
      color: "#E87722",
      icon: Dumbbell,
    },
    {
      name: "Books & Stationery",
      slug: "books",
      productCount: 985,
      description: "Fiction, non-fiction, academic, children's books and more",
      color: "#C9A227",
      icon: BookOpen,
    },
    {
      name: "Toys & Games",
      slug: "toys-games",
      productCount: 1876,
      description: "Toys, games, puzzles, learning and more",
      color: "#9B5DE5",
      icon: Puzzle,
    },
    {
      name: "More Categories",
      slug: "",
      productCount: null,
      description: "Discover other exciting categories",
      color: "#6B7280",
      icon: LayoutGrid,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "All Categories" }]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 md:mb-7 gap-4">
        <div>
          <h1
            className="text-lg md:text-xl font-bold text-[#111827]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Shop by category
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Popular departments curated for faster shopping
          </p>
        </div>
        <div className="hidden md:grid grid-cols-4 gap-3">
          {highlights.map(({ icon: Icon, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex items-center gap-2 text-sm"
            >
              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-[#FF5A1F]" />
              </div>
              <div>
                <p className="font-medium text-[#111827] text-xs">{label}</p>
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((cat) => {
          const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-");
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat._id || slug || cat.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: Math.min(categories.indexOf(cat) * 0.04, 0.24) }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={slug ? `/search?category=${slug}` : "/search"}
                className="group flex flex-col items-center text-center"
              >
                <div
                  className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full shadow-sm transition-all group-hover:shadow-lg group-hover:scale-105"
                  style={{ backgroundColor: cat.color + "1A", color: cat.color }}
                >
                  <Icon size={32} className="md:size-[38px]" />
                </div>
                <span className="mt-2 text-xs md:text-sm font-medium text-[#111827] group-hover:text-[#FF5A1F] transition-colors line-clamp-1">
                  {cat.name}
                </span>
                {cat.productCount && (
                  <span className="text-[10px] md:text-xs text-gray-400">
                    {cat.productCount.toLocaleString()}+ items
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Newsletter */}
      <div className="mt-8 md:mt-10 bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 w-full">
          <h3 className="font-bold text-[#111827] text-base md:text-lg">
            Get exclusive offers &amp; updates
          </h3>
          <p className="text-sm text-gray-500">
            Subscribe to our newsletter and never miss any deals!
          </p>
        </div>
        <form
          onSubmit={handleSubscribe}
          className="flex w-full md:flex-1 md:max-w-sm"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="Enter your email address"
            className="flex-1 min-w-0 px-4 py-2.5 border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:border-[#FF5A1F]"
          />
          <button
            type="submit"
            disabled={subLoading}
            className="px-4 md:px-5 py-2.5 bg-[#FF5A1F] text-white text-sm font-medium rounded-r-lg hover:bg-[#E64A19] transition-colors whitespace-nowrap disabled:opacity-60"
          >
            {subLoading ? (
              <span className="flex items-center gap-1">
                <Loader2 size={16} className="animate-spin" /> Subscribing...
              </span>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
            Follow Us
          </span>
          <div className="flex items-center gap-2">
            {["f", "in", "tw", "yt"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#FF5A1F] hover:text-white transition-colors text-xs font-bold"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
      <NewsletterPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        email={subEmail}
      />
    </div>
  );
}
