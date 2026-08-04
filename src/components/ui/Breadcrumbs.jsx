import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm py-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
          {item.to ? (
            <Link
              to={item.to}
              className="text-gray-500 hover:text-[#FF5A1F] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#111827] font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
