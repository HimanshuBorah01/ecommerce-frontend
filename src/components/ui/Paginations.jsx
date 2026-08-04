import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        pages.push(i);
      }
    }

    const withEllipsis = [];
    let prev;
    for (const page of pages) {
      if (prev && page - prev > 1) withEllipsis.push("...");
      withEllipsis.push(page);
      prev = page;
    }
    return withEllipsis;
  };

  return (
    <div className="flex items-center justify-center gap-1 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-[#FF5A1F] hover:text-[#FF5A1F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={i}
            className="w-9 h-9 flex items-center justify-center text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-[#FF5A1F] text-white border border-[#FF5A1F]"
                : "border border-gray-200 text-gray-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-[#FF5A1F] hover:text-[#FF5A1F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
