import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Package } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Exclusive Offers', desc: 'Access member-only deals & discounts' },
  { icon: Package, title: 'Faster Checkout', desc: 'Save your details for a smooth checkout' },
  { icon: ShieldCheck, title: 'Track Orders', desc: 'Easily track and manage your orders' },
];

export default function AuthSplitLayout({ title, subtitle, footer, children, sideTitle, sideSubtitle }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
        style={{ minHeight: '560px' }}
      >
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-center p-10 lg:p-12 bg-gradient-to-br from-[#FFF9F5] to-[#FFF3ED] relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-[#FF5A1F] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {sideTitle}
            </h2>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">{sideSubtitle}</p>
            <div className="space-y-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <f.icon size={18} className="text-[#FF5A1F]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#111827]">{f.title}</p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Decorative circles */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#FF5A1F]/5" />
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#FF5A1F]/5" />
        </div>

        {/* Right panel - form */}
        <div className="bg-white p-8 md:p-10 lg:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-[#111827] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {title}
            </h1>
            {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
            {children}
            {footer && <p className="text-center text-sm text-gray-500 mt-6">{footer}</p>}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}