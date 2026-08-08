import { Link } from 'react-router-dom';

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { bag: 24, text: 'text-xl' },
    md: { bag: 32, text: 'text-2xl' },
    lg: { bag: 48, text: 'text-4xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
      <div className="relative">
        <div
          className="rounded-xl flex items-center justify-center"
          style={{
            width: s.bag,
            height: s.bag,
            background: '#FF5A1F',
          }}
        >
          <span className="text-white font-bold" style={{ fontSize: s.bag * 0.45 }}>S</span>
        </div>
      </div>
      <span className={`font-bold ${s.text} tracking-tight`}>
        <span className="text-[#111827]">Shop</span>
        <span className="text-[#FF5A1F]">y</span>
      </span>
    </Link>
  );
}