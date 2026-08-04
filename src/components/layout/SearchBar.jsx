import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { data: suggestions } = useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => api.get('/products/search/suggestions', { q: query }),
    enabled: query.length >= 2,
    staleTime: 30000,
  });

  const suggestionList = suggestions?.suggestions || [];

  const handleSearch = (q = query) => {
    if (!q.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.closest('.search-container')?.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container relative flex-1 max-w-2xl" ref={inputRef}>
      <div className="flex items-center border-2 border-[#FF5A1F] rounded-lg overflow-hidden bg-white">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products, brands and more..."
          className="flex-1 px-4 py-2.5 text-sm focus:outline-none text-[#111827] placeholder-gray-400"
        />
        {query && (
          <button onClick={() => { setQuery(''); setShowSuggestions(false); }} className="px-2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          className="px-4 py-2.5 bg-[#FF5A1F] hover:bg-[#E64A19] text-white transition-colors"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestionList.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
            Search Suggestions
          </div>
          {suggestionList.map((s, i) => (
            <button
              key={i}
              onClick={() => { setQuery(s); handleSearch(s); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-orange-50 transition-colors"
            >
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-[#111827]">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}