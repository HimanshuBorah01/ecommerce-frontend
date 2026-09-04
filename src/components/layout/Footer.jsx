import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Truck, RefreshCw, Shield, Headphones, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import Logo from './Logo';
import NewsletterPopup from '@/components/NewsletterPopup';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const footerLinks = {
  Company: [
    { label: 'About Us', to: '/info/about' },
    { label: 'Contact Us', to: '/info/contact' },
    { label: 'Help Center', to: '/help-center' },
    { label: 'FAQ', to: '/info/faq' },
  ],
  Help: [
    { label: 'FAQ', to: '/info/faq' },
    { label: 'Shipping Policy', to: '/info/shipping' },
    { label: 'Returns & Refunds', to: '/info/returns' },
    { label: 'Track Order', to: '/account/orders' },
    { label: 'Help Center', to: '/help-center' },
  ],
  Account: [
    { label: 'My Account', to: '/account/dashboard' },
    { label: 'My Orders', to: '/account/orders' },
    { label: 'My Wishlist', to: '/account/wishlist' },
    { label: 'My Addresses', to: '/account/addresses' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/info/privacy-policy' },
    { label: 'Terms & Conditions', to: '/info/terms' },
    { label: 'Cookie Policy', to: '/info/cookies' },
    { label: 'Seller Policy', to: '/info/seller-policy' },
  ],
};

const trustItems = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7 days return & refund policy' },
  { icon: Shield, title: 'Secure Payments', desc: '100% secure payments' },
  { icon: Headphones, title: '24x7 Support', desc: 'We are always here to help' },
];

export default function Footer() {
  const [showPopup, setShowPopup] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email?.value || subEmail;
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    setSubLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      setSubEmail(email);
      setShowPopup(true);
      e.target.reset();
    } catch (err) {
      toast({
        title: 'Subscription failed',
        description: err.message || 'Could not subscribe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      {/* Trust strip */}
      <div className="border-b border-gray-100 bg-[#F8FAFC]">
        <div className="max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-[#FF5A1F]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Logo />
            <p className="text-sm text-gray-500 mt-3 mb-4 leading-relaxed">
              Your one-stop destination for all your shopping needs. Quality products, best prices, and seamless delivery.
            </p>
            <div className="space-y-2">
              <a href="mailto:himanshuborah9954@gmail.com" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF5A1F] transition-colors">
                <Mail size={14} className="text-[#FF5A1F]" /> himanshuborah9954@gmail.com
              </a>
              <a href="tel:+916003185021" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF5A1F] transition-colors">
                <Phone size={14} className="text-[#FF5A1F]" /> +91 6003185021
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin size={14} className="text-[#FF5A1F] mt-0.5 flex-shrink-0" />
                <span>Shopy E-commerce Pvt. Ltd., 123 Tech Park, ABCD City, Bengaluru - 123400</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-semibold text-[#111827] text-sm mb-3">{heading}</h3>
              <ul className="space-y-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-gray-500 hover:text-[#FF5A1F] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter + Social */}
      <div className="border-t border-gray-100 bg-[#F8FAFC]">
        <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:flex md:items-center md:gap-3 md:flex-1">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <Mail size={20} className="text-[#FF5A1F] flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#111827]">Get exclusive offers &amp; updates</p>
                <p className="text-xs text-gray-500">Subscribe to our newsletter</p>
              </div>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:flex-1 md:max-w-sm">
              <input name="email" type="email" required placeholder="Enter your email address"
                className="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:border-[#FF5A1F]" />
              <button type="submit" disabled={subLoading} className="px-4 md:px-5 py-2 bg-[#FF5A1F] text-white text-sm font-medium rounded-r-lg hover:bg-[#E64A19] transition-colors whitespace-nowrap disabled:opacity-60">
                {subLoading ? (
                  <span className="flex items-center gap-1">
                    <Loader2 size={16} className="animate-spin" /> Subscribing...
                  </span>
                ) : 'Subscribe'}
              </button>
            </form>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm text-gray-500 whitespace-nowrap">Follow Us</span>
            <div className="flex items-center gap-2">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#FF5A1F] hover:text-white transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 Shopy E-commerce Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/info/privacy-policy" className="hover:text-[#FF5A1F] transition-colors">Privacy Policy</Link>
            <Link to="/info/terms" className="hover:text-[#FF5A1F] transition-colors">Terms of Service</Link>
            <Link to="/info/sitemap" className="hover:text-[#FF5A1F] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
      <NewsletterPopup open={showPopup} onClose={() => setShowPopup(false)} email={subEmail} />
    </footer>
  );
}