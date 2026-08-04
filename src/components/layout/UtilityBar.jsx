import { Truck, RefreshCw, Shield, Headphones } from 'lucide-react';

const items = [
  { icon: Truck, text: 'Free Delivery on orders above ₹499' },
  { icon: RefreshCw, text: 'Easy 7 Days Returns' },
  { icon: Shield, text: '100% Secure Payments' },
  { icon: Headphones, text: '24x7 Customer Support' },
];

export default function UtilityBar() {
  return (
    <div className="bg-[#111827] text-white text-xs py-2 hidden md:block">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-1.5">
            <Icon size={12} className="text-[#FF5A1F]" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}