import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Search,
} from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { Pagination } from "@/components/ui/pagination";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SORT_OPTIONS } from "@/constants";

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="text-sm font-semibold text-[#111827]">{title}</span>
        {open ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      {open && children}
    </div>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "relevance";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const selectedBrand = searchParams.get("brand") || "";
  const rating = searchParams.get("rating") || "";
  const inStock = searchParams.get("inStock") || "";

  // Keep price edits local until the user applies them.
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice || "");

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice || "");
  }, [minPrice, maxPrice]);

  const commitPrice = (min, max) => {
    const p = new URLSearchParams(searchParams);
    if (min) p.set("minPrice", min);
    else p.delete("minPrice");
    if (max) p.set("maxPrice", max);
    else p.delete("maxPrice");
    setSearchParams(p);
    setPage(1);
  };

  const applyCustomPrice = () => {
    const min = localMin.trim();
    const max = localMax.trim();
    commitPrice(min, max);
  };

  const clearPrice = () => {
    setLocalMin("");
    setLocalMax("");
    commitPrice("", "");
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "search",
      q,
      category,
      sort,
      page,
      minPrice,
      maxPrice,
      selectedBrand,
      rating,
      inStock,
    ],
    queryFn: () => {
      // Backend supports: search, category, minPrice, maxPrice, page, limit.
      // Sort/rating/inStock are filtered client-side or unsupported.
      const params = {
        page,
        limit: 16,
      };
      if (q) params.search = q;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedBrand) params.brand = selectedBrand;
      return api.get("/products", params);
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    setPage(1);
  }, [q, category, selectedBrand]);

  const products = data?.products || [];
  // Backend returns totalProducts, not total.
  const total = data?.totalProducts || data?.total || 0;
  const totalPages = data?.totalPages || Math.ceil(total / 16);
  const facets = data?.facets || {};

  const [sortedProducts, setSortedProducts] = useState(null);

  // Sort is not supported by the backend query API, so sort client-side.
  useEffect(() => {
    if (sort && products.length > 0) {
      const sorted = [...products];
      if (sort === "price_asc")
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      else if (sort === "price_desc")
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      else if (sort === "rating")
        sorted.sort(
          (a, b) =>
            (b.averageRating || b.rating?.average || 0) -
            (a.averageRating || a.rating?.average || 0),
        );
      else if (sort === "newest")
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      else if (sort === "discount")
        sorted.sort((a, b) => {
          const da =
            a.discount ||
            (a.originalPrice && a.price
              ? Math.round(
                  ((a.originalPrice - a.price) / a.originalPrice) * 100,
                )
              : 0);
          const db =
            b.discount ||
            (b.originalPrice && b.price
              ? Math.round(
                  ((b.originalPrice - b.price) / b.originalPrice) * 100,
                )
              : 0);
          return db - da;
        });
      setSortedProducts(sorted);
    } else {
      setSortedProducts(null);
    }
  }, [sort, products]);

  const normalizeFilterValue = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  const brandFilteredProducts = selectedBrand
    ? products.filter((product) => {
        const productBrand = product.brand || product.brandName || "";
        return (
          normalizeFilterValue(productBrand) ===
          normalizeFilterValue(selectedBrand)
        );
      })
    : products;

  const displayProducts = sortedProducts
    ? selectedBrand
      ? sortedProducts.filter((product) => {
          const productBrand = product.brand || product.brandName || "";
          return (
            normalizeFilterValue(productBrand) ===
            normalizeFilterValue(selectedBrand)
          );
        })
      : sortedProducts
    : brandFilteredProducts;

  const updateFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
    setPage(1);
  };

  const clearAll = () => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    setSearchParams(p);
  };

  const hasFilters =
    category || minPrice || maxPrice || selectedBrand || rating || inStock;

  const filterCategories = facets?.categories || [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books",
  ];
  const filterBrands = facets?.brands || [
    "boAt",
    "Sony",
    "JBL",
    "Noise",
    "Realme",
    "Samsung",
    "Apple",
    "Nike",
  ];

  const renderFilterPanel = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#111827]">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[#FF5A1F] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <FilterSection title="Category">
        {filterCategories.map((cat) => {
          const slug =
            typeof cat === "string"
              ? cat.toLowerCase().replace(/\s+/g, "-")
              : cat.slug;
          const name = typeof cat === "string" ? cat : cat.name;
          const count = typeof cat === "object" ? cat.count : "";
          return (
            <label
              key={slug}
              className="flex items-center gap-2 mb-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={category === slug}
                onChange={(e) =>
                  updateFilter("category", e.target.checked ? slug : "")
                }
                className="w-4 h-4 accent-[#FF5A1F]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#FF5A1F] transition-colors flex-1">
                {name}
              </span>
              {count && (
                <span className="text-xs text-gray-400">({count})</span>
              )}
            </label>
          );
        })}
      </FilterSection>

      <FilterSection title="Brand">
        {filterBrands.map((brandOption) => {
          const name =
            typeof brandOption === "string" ? brandOption : brandOption.name;
          const value =
            typeof brandOption === "string"
              ? brandOption
              : brandOption.slug || brandOption.name;
          return (
            <label
              key={value}
              className="flex items-center gap-2 mb-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={
                  normalizeFilterValue(selectedBrand) ===
                  normalizeFilterValue(value)
                }
                onChange={(e) =>
                  updateFilter("brand", e.target.checked ? value : "")
                }
                className="w-4 h-4 accent-[#FF5A1F]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#FF5A1F] transition-colors flex-1">
                {name}
              </span>
            </label>
          );
        })}
      </FilterSection>

      <FilterSection title="Price">
        <div className="space-y-2">
          {[
            { label: "Under ₹500", min: "", max: "500" },
            { label: "₹500 to ₹1,000", min: "500", max: "1000" },
            { label: "₹1,000 to ₹5,000", min: "1000", max: "5000" },
            { label: "₹5,000 to ₹10,000", min: "5000", max: "10000" },
            { label: "Over ₹10,000", min: "10000", max: "" },
          ].map((preset) => {
            const active = minPrice === preset.min && maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                onClick={() => {
                  setLocalMin(preset.min);
                  setLocalMax(preset.max);
                  commitPrice(preset.min, preset.max);
                }}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? "border-[#FF5A1F] bg-orange-50 text-[#FF5A1F] font-medium"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50/60"
                }`}
              >
                <span>{preset.label}</span>
                <span
                  className={`h-3.5 w-3.5 rounded-full border ${
                    active
                      ? "border-[#FF5A1F] bg-[#FF5A1F] ring-2 ring-orange-100"
                      : "border-gray-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="mb-2 text-xs font-medium text-gray-500">
            Custom price
          </p>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={localMin}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                setLocalMin(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyCustomPrice();
              }}
              className="min-w-0 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#FF5A1F]"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Max"
              value={localMax}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                setLocalMax(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyCustomPrice();
              }}
              className="min-w-0 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#FF5A1F]"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={applyCustomPrice}
              className="flex-1 rounded-md bg-[#FF5A1F] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E64A19]"
            >
              Apply
            </button>
            {(minPrice || maxPrice) && (
              <button
                type="button"
                onClick={clearPrice}
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        {[4, 3, 2, 1].map((r) => (
          <label
            key={r}
            className="flex items-center gap-2 mb-2 cursor-pointer group"
          >
            <input
              type="radio"
              name="rating"
              checked={rating === String(r)}
              onChange={() => updateFilter("rating", String(r))}
              className="w-4 h-4 accent-[#FF5A1F]"
            />
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < r ? "text-yellow-400" : "text-gray-200"}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">& up</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Availability">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock === "true"}
            onChange={(e) =>
              updateFilter("inStock", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 accent-[#FF5A1F]"
          />
          <span className="text-sm text-green-600 font-medium">In Stock</span>
        </label>
      </FilterSection>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Search Results" }]}
      />

      <div className="flex gap-4 md:gap-6">
        {/* Sidebar filters - desktop */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {renderFilterPanel()}
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2 md:gap-3">
            <div>
              {q ? (
                <h1 className="text-lg md:text-xl font-bold text-[#111827]">
                  Results for <span className="text-[#FF5A1F]">"{q}"</span>
                </h1>
              ) : category ? (
                <h1 className="text-lg md:text-xl font-bold text-[#111827] capitalize">
                  {category.replace(/-/g, " ")}
                </h1>
              ) : (
                <h1 className="text-lg md:text-xl font-bold text-[#111827]">
                  All Products
                </h1>
              )}
              {total > 0 && (
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  {total} products found
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <select
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF5A1F] bg-white"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    Sort by: {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 py-12 md:py-16">
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={40} className="text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-[#111827] mb-2">
                  No results found{q ? ` for "${q}"` : ""}
                </h2>
                <p className="text-gray-500 mb-6">
                  We couldn't find any products matching your search.
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <p>Check the spelling of your search keyword</p>
                  <p>Try more general keywords</p>
                  <p>Browse categories or popular products</p>
                </div>
                <a href="/search" className="btn-primary inline-flex">
                  Continue Shopping →
                </a>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 transition-opacity ${isFetching ? "opacity-70" : ""}`}
              >
                {displayProducts.map((p) => (
                  <ProductCard key={p._id || p.id} product={p} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </main>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {renderFilterPanel()}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="btn-primary w-full mt-4"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
