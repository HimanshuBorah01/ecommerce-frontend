import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import NewsletterPopup from "@/components/NewsletterPopup";
import { ArrowRight, LayoutGrid, Award, Tag, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import electronicsImage from "@/assets/categories/electronics-ai.png";
import fashionImage from "@/assets/categories/fashion-ai.png";
import homeKitchenImage from "@/assets/categories/home-kitchen-ai.png";
import beautyImage from "@/assets/categories/beauty-ai.png";
import sportsImage from "@/assets/categories/sports-ai.png";
import booksImage from "@/assets/categories/books-ai.png";
import toysGamesImage from "@/assets/categories/toys-games-ai.png";

const CATEGORY_IMAGES = {
  electronics: electronicsImage,
  fashion: fashionImage,
  "home-kitchen": homeKitchenImage,
  beauty: beautyImage,
  sports: sportsImage,
  books: booksImage,
  "toys-games": toysGamesImage,
};

const highlights = [
  { icon: LayoutGrid, label: "Wide Range", sub: "Top categories" },
  { icon: Award, label: "Best Prices", sub: "Great deals" },
  { icon: Tag, label: "Quality Products", sub: "100% trusted" },
  { icon: RefreshCw, label: "Easy Returns", sub: "Hassle free" },
];

export default function Categories() {
  const [showPopup, setShowPopup] = useState(false);
  const [subEmail, setSubEmail] = useState("");

  const categories = [
    {
      name: "Electronics",
      slug: "electronics",
      productCount: 2456,
      description: "Mobiles, laptops, headphones, TVs, cameras and more",
    },
    {
      name: "Fashion",
      slug: "fashion",
      productCount: 3789,
      description: "Men, women & kids clothing, shoes, accessories and more",
    },
    {
      name: "Home & Kitchen",
      slug: "home-kitchen",
      productCount: 4321,
      description: "Furniture, home decor, kitchen appliances and more",
    },
    {
      name: "Beauty",
      slug: "beauty",
      productCount: 2145,
      description: "Skincare, makeup, haircare, fragrances and more",
    },
    {
      name: "Sports",
      slug: "sports",
      productCount: 1234,
      description: "Sports shoes, fitness gear, equipment and more",
    },
    {
      name: "Books",
      slug: "books",
      productCount: 985,
      description: "Fiction, non-fiction, academic, children's books and more",
    },
    {
      name: "Toys & Games",
      slug: "toys-games",
      productCount: 1876,
      description: "Toys, games, puzzles, learning and more",
    },
    {
      name: "More Categories",
      slug: "",
      productCount: null,
      description: "Discover other exciting categories",
    },
  ];

  const featuredImages = categories
    .filter((cat) => cat.slug)
    .slice(0, 4)
    .map((cat) => CATEGORY_IMAGES[cat.slug]);

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "All Categories" }]}
      />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-white via-orange-50 to-amber-50 p-4 md:p-6 shadow-[0_18px_45px_-28px_rgba(255,90,31,0.45)] mb-5 md:mb-6"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] md:text-xs font-semibold text-[#FF5A1F] shadow-sm ring-1 ring-orange-100">
              <LayoutGrid size={14} />
              Browse store departments
            </span>
            <h1
              className="mt-3 text-2xl md:text-4xl font-bold text-[#111827] leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              All Categories
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-2 max-w-xl">
              Explore every department and jump straight to the products you need.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 lg:w-[360px]">
            {featuredImages.map((image, i) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.35 }}
                className="aspect-square overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-white/70"
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat) => {
          const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-");
          const image = cat.image || cat.thumbnail || CATEGORY_IMAGES[slug];
          return (
            <motion.div
              key={cat._id || slug || cat.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: Math.min(categories.indexOf(cat) * 0.04, 0.24) }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={slug ? `/search?category=${slug}` : "/search"}
                className="group block h-full min-w-0 overflow-hidden rounded-2xl border-2 border-orange-100 bg-white shadow-sm ring-1 ring-white transition-all hover:border-[#FF5A1F] hover:shadow-xl hover:shadow-orange-100/70"
              >
                <div className="relative h-28 md:h-32 overflow-hidden bg-orange-50">
                  {image ? (
                    <img
                      src={image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                      <LayoutGrid size={36} className="text-[#FF5A1F]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#FF5A1F] shadow-sm">
                    <LayoutGrid size={18} />
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-bold text-sm md:text-base text-[#111827] group-hover:text-[#FF5A1F] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.productCount && (
                    <p className="text-sm text-[#FF5A1F] font-medium">
                      {cat.productCount.toLocaleString()} products
                    </p>
                  )}
                  <p className="text-xs md:text-sm text-gray-500 mt-3 min-h-[38px]">
                    {cat.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#FF5A1F]">
                    Shop Now
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
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
          onSubmit={(e) => {
            e.preventDefault();
            setSubEmail(e.target.elements.email?.value || "");
            setShowPopup(true);
            e.target.reset();
          }}
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
            className="px-4 md:px-5 py-2.5 bg-[#FF5A1F] text-white text-sm font-medium rounded-r-lg hover:bg-[#E64A19] transition-colors whitespace-nowrap"
          >
            Subscribe
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
