import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import PolicyPageLayout from "@/components/info/PolicyPageLayout";

import aboutImage from "../images/about_image.jpeg";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Shield,
  Lock,
  User,
  Headphones,
  Truck,
  Tag,
  Target,
  Eye,
  Gem,
  Users,
  Package,
  Star,
  Smile,
  ArrowRight,
  Search,
  ChevronDown,
} from "lucide-react";

const POLICY_PAGES = {
  "privacy-policy": {
    title: "Privacy Policy",
    breadcrumb: "Privacy Policy",
    intro:
      "Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.",
    lastUpdated: "12 May 2024",
    sections: [
      {
        heading: "Information We Collect",
        body: "We collect information you provide directly, such as your name, email, phone number, shipping address, and payment details. We also automatically collect browsing data, device information, and usage patterns to improve our services.",
      },
      {
        heading: "How We Use Your Information",
        body: "Your information is used to process orders, provide customer support, send order updates, personalize your shopping experience, and prevent fraud. We never sell your personal information to third parties.",
      },
      {
        heading: "How We Share Your Information",
        body: "We share your information only with trusted service providers who help us operate (payment processors, logistics partners, cloud services). All partners are bound by strict confidentiality agreements.",
      },
      {
        heading: "Cookies and Tracking Technologies",
        body: "We use cookies and similar technologies to remember your preferences, keep items in your cart, analyze traffic, and provide a personalized experience. You can control cookies through your browser settings.",
      },
      {
        heading: "Data Security",
        body: "We use industry-standard encryption (SSL/TLS) and security measures to protect your data. Your payment information is processed through secure payment gateways and is never stored on our servers.",
      },
      {
        heading: "Your Rights and Choices",
        body: "You have the right to access, update, or delete your personal information. You can also opt out of marketing communications at any time from your account settings or by clicking unsubscribe in our emails.",
      },
      {
        heading: "Third-Party Links",
        body: "Our website may contain links to third-party sites. We are not responsible for the privacy practices of these sites. We encourage you to review their privacy policies.",
      },
      {
        heading: "Children's Privacy",
        body: "Our services are not directed to children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us information, please contact us for deletion.",
      },
      {
        heading: "Changes to This Policy",
        body: 'We may update this policy from time to time. We will notify you of significant changes by posting the updated policy on this page and updating the "Last updated" date.',
      },
      {
        heading: "Contact Us",
        body: "If you have questions about this Privacy Policy, please contact us at himanshuborah9954@gmail.com or call +916003185021. Our privacy team will respond within 48 hours.",
      },
    ],
    trustBanner: [
      {
        icon: Lock,
        title: "Your Privacy Matters",
        desc: "We protect your data",
      },
      { icon: Shield, title: "Secure Platform", desc: "Bank-grade encryption" },
      {
        icon: User,
        title: "You're in Control",
        desc: "Manage your preferences",
      },
      { icon: Headphones, title: "Questions?", desc: "24x7 support available" },
    ],
  },
  returns: {
    title: "Return Policy",
    breadcrumb: "Return Policy",
    intro:
      "We want you to love every purchase. If something isn't right, we're here to help with easy returns and quick refunds.",
    lastUpdated: "12 May 2024",
    sections: [
      {
        heading: "Return Eligibility",
        body: "Items must be unused, unworn, unwashed and in original condition with all tags and packaging intact. Returns can be initiated within 7 days of delivery. Products must match what was shipped to you.",
      },
      {
        heading: "Return Window",
        body: "You can request a return within 7 days of delivery. After 7 days, returns cannot be accepted. We recommend inspecting your items upon delivery and initiating returns promptly.",
      },
      {
        heading: "Non-Returnable Items",
        body: "Certain items such as personalized products, hygiene items, innerwear, swimwear, food products, and digital goods are non-returnable. Check the product page for return eligibility before purchasing.",
      },
      {
        heading: "Return Process",
        body: 'Log in to your account, go to "My Orders", select the item you want to return, choose the reason, and submit. Our team will arrange a free pickup within 2-3 business days from your address.',
      },
      {
        heading: "Refund Process",
        body: "Once we receive and inspect the returned item, your refund will be processed within 5-7 business days. Refunds are credited to the original payment method. For COD orders, refunds go to your bank account.",
      },
      {
        heading: "Exchange",
        body: 'We only replace items if they are defective, damaged, or incorrect. To request an exchange, follow the same return process and select "Exchange" as the reason. The replacement will be shipped after we receive the original item.',
      },
      {
        heading: "Damaged or Defective Items",
        body: "If you receive a damaged or defective item, contact us within 48 hours of delivery with photos. We will arrange a free pickup and send a replacement or issue a full refund.",
      },
      {
        heading: "Important Notes",
        body: "Returns are free for all orders. The refund amount includes the product price but not shipping charges (if applicable). Gift cards and store credits are non-refundable.",
      },
      {
        heading: "Contact Us",
        body: "For return-related queries, email us at returns@shopy.com or call +916003185021. Our returns team is available 24x7 to assist you.",
      },
    ],
    trustBanner: [
      {
        icon: Package,
        title: "Hassle-Free Returns",
        desc: "Easy returns within 7 days",
      },
      {
        icon: Tag,
        title: "Quick Refunds",
        desc: "Refund in 5-7 business days",
      },
      {
        icon: Shield,
        title: "Secure & Reliable",
        desc: "Your satisfaction is our priority",
      },
      {
        icon: Headphones,
        title: "Need Help?",
        desc: "24x7 support team available",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    breadcrumb: "Terms & Conditions",
    intro:
      "These Terms & Conditions govern your use of Shopy. By accessing our website, you agree to be bound by these terms.",
    lastUpdated: "12 May 2024",
    sections: [
      {
        heading: "Introduction",
        body: 'These Terms & Conditions ("Terms") govern your access to and use of the Shopy website and services. By using our services, you agree to be bound by these Terms. If you do not agree, please do not use our services.',
      },
      {
        heading: "Use of Our Website",
        body: "You agree to use our Services only for lawful purposes. You must not misuse the site, attempt to gain unauthorized access, introduce malware, or interfere with the proper functioning of the website.",
      },
      {
        heading: "User Accounts",
        body: "To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must be 18 or older to create an account.",
      },
      {
        heading: "Products and Pricing",
        body: "We strive to display accurate product information, including images, descriptions, and prices. However, we do not guarantee that all information is error-free. Prices and availability are subject to change without notice.",
      },
      {
        heading: "Orders and Payments",
        body: "All orders are subject to acceptance and availability. We reserve the right to cancel any order. Payment must be completed at checkout. We accept credit/debit cards, UPI, net banking, and COD.",
      },
      {
        heading: "Shipping and Delivery",
        body: "We offer free shipping on orders above ₹499. Standard delivery takes 3-5 business days. We are not liable for delays caused by shipping partners or circumstances beyond our control.",
      },
      {
        heading: "Returns and Refunds",
        body: "We offer a 7-day return policy on most products. Refunds are processed within 5-7 business days after we receive the returned item. Please refer to our Return Policy for detailed information.",
      },
      {
        heading: "Intellectual Property",
        body: "All content on this website, including text, graphics, logos, and images, is the property of Shopy or its licensors and is protected by intellectual property laws. You may not reproduce or distribute our content without permission.",
      },
      {
        heading: "Limitation of Liability",
        body: "Shopy shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our maximum liability is limited to the value of the product purchased.",
      },
      {
        heading: "Changes to Terms",
        body: "We may update these Terms from time to time. We will notify you of significant changes by posting the updated Terms on this page. Continued use of our services after changes constitutes acceptance.",
      },
      {
        heading: "Contact Us",
        body: "If you have questions about these Terms, please contact us at himanshuborah9954@gmail.com or call +916003185021. Our legal team will respond within 48 hours.",
      },
    ],
    trustBanner: [
      {
        icon: Shield,
        title: "Fair and Transparent",
        desc: "Clear terms, no hidden clauses",
      },
      { icon: Lock, title: "Your Rights", desc: "Protected at every step" },
      {
        icon: Headphones,
        title: "We're Here to Help",
        desc: "24x7 customer support",
      },
      { icon: Mail, title: "Contact Us", desc: "himanshuborah9954@gmail.com" },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    breadcrumb: "Shipping Policy",
    intro:
      "We deliver across India with fast, reliable shipping. Here's everything you need to know about our shipping process.",
    lastUpdated: "12 May 2024",
    sections: [
      {
        heading: "Shipping Charges",
        body: "We offer free shipping on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹49 is applicable. Cash on Delivery (COD) orders may incur an additional ₹40 handling fee.",
      },
      {
        heading: "Delivery Time",
        body: "Standard delivery takes 3-5 business days. Express delivery (1-2 business days) is available in select cities for an additional charge of ₹99. Delivery times may vary based on your location and product availability.",
      },
      {
        heading: "Order Processing",
        body: "Orders are processed within 24 hours of placement. You will receive an order confirmation email and SMS. Once shipped, you will receive tracking information to monitor your delivery.",
      },
      {
        heading: "Order Tracking",
        body: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order in real-time from the \"My Orders\" section in your account or via the courier partner's website.",
      },
      {
        heading: "Delivery Areas",
        body: "We deliver to all serviceable pin codes across India. Enter your pin code on the product page to check delivery availability in your area. Remote locations may take additional delivery time.",
      },
      {
        heading: "International Shipping",
        body: "Currently, we only ship within India. We're working on expanding our shipping to international destinations and will update this policy accordingly. Stay tuned for updates!",
      },
      {
        heading: "Failed Deliveries",
        body: "If our courier partner is unable to deliver your package, they will attempt delivery 3 times. After 3 failed attempts, the order will be returned to us and a refund will be processed.",
      },
      {
        heading: "Contact Us",
        body: "For shipping-related queries, email us at shipping@shopy.com or call +916003185021. Our logistics team is available 24x7 to assist you.",
      },
    ],
    trustBanner: [
      { icon: Truck, title: "Fast Delivery", desc: "3-5 business days" },
      { icon: Tag, title: "Free Shipping", desc: "On orders above ₹499" },
      { icon: Package, title: "Safe Packaging", desc: "Secure & damage-free" },
      {
        icon: Headphones,
        title: "Track Anytime",
        desc: "Real-time order tracking",
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    breadcrumb: "Cookie Policy",
    intro:
      "This Cookie Policy explains how we use cookies and similar technologies on Shopy to enhance your shopping experience.",
    lastUpdated: "12 May 2024",
    sections: [
      {
        heading: "What Are Cookies",
        body: "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, keep items in your cart, and provide a personalized shopping experience.",
      },
      {
        heading: "Types of Cookies We Use",
        body: "We use essential cookies for site functionality, analytics cookies to understand user behavior, and marketing cookies to show relevant advertisements. You can control cookie preferences from your browser settings.",
      },
      {
        heading: "Essential Cookies",
        body: "These cookies are necessary for the website to function properly. They enable core features like secure login, shopping cart, and checkout. You cannot opt out of essential cookies as they are required for the site to work.",
      },
      {
        heading: "Analytics Cookies",
        body: "We use analytics cookies to understand how visitors interact with our website. This helps us improve site performance, fix issues, and enhance user experience. The data collected is anonymous and aggregated.",
      },
      {
        heading: "Managing Cookies",
        body: "You can choose to accept or decline cookies through your browser settings. Disabling cookies may affect some features of our website, such as the ability to stay logged in or items remaining in your cart.",
      },
      {
        heading: "Third-Party Cookies",
        body: "We use third-party services like Google Analytics and payment gateways that may set their own cookies. These are governed by their respective privacy policies. We do not control these third-party cookies.",
      },
      {
        heading: "Changes to This Policy",
        body: "We may update this Cookie Policy from time to time. We will notify you of significant changes by posting the updated policy on this page. We encourage you to review this policy periodically.",
      },
      {
        heading: "Contact Us",
        body: "If you have questions about our Cookie Policy, please contact us at himanshuborah9954@gmail.com or call +916003185021. Our team will respond within 48 hours.",
      },
    ],
    trustBanner: [
      { icon: Shield, title: "Transparent", desc: "We tell you what we use" },
      { icon: Lock, title: "Your Control", desc: "Manage your preferences" },
      { icon: User, title: "Privacy First", desc: "Your data is protected" },
      { icon: Headphones, title: "Questions?", desc: "24x7 support available" },
    ],
  },
  "seller-policy": {
    title: "Seller Policy",
    breadcrumb: "Seller Policy",
    intro:
      "Join Shopy's marketplace and reach millions of customers across India. Here's everything you need to know about selling on Shopy.",
    lastUpdated: "12 May 2024",
    sections: [
      {
        heading: "Become a Seller",
        body: "Join Shopy's marketplace and reach millions of customers across India. We welcome sellers of all sizes, from individual entrepreneurs to large brands. Registration is free and takes just a few minutes.",
      },
      {
        heading: "Seller Requirements",
        body: "To sell on Shopy, you need a valid GST registration, bank account, and product listings that meet our quality standards. The onboarding process typically takes 3-5 business days after document verification.",
      },
      {
        heading: "Commission & Fees",
        body: "We charge a competitive commission ranging from 3% to 15% depending on the product category. There are no listing fees or monthly subscription charges. You only pay when you make a sale.",
      },
      {
        heading: "Product Listings",
        body: "Sellers must provide accurate product information, high-quality images, and competitive pricing. All listings are reviewed by our team before going live. Misleading listings may be removed without notice.",
      },
      {
        heading: "Order Fulfillment",
        body: "Sellers are expected to ship orders within 24-48 hours. We provide integrated logistics with our shipping partners. Late shipments may affect your seller rating and visibility on the platform.",
      },
      {
        heading: "Payments",
        body: "Payments are settled within 7-10 business days after successful delivery. The settlement includes the product price minus commission, shipping, and applicable taxes. You can track all settlements in your seller dashboard.",
      },
      {
        heading: "Returns & Refunds",
        body: "Sellers must accept returns as per our 7-day return policy. Refunds are processed from the seller's account. Defective or incorrect products must be replaced at the seller's expense.",
      },
      {
        heading: "Seller Support",
        body: "Our dedicated seller support team is available 24x7 to assist with listings, orders, payments, and any other queries. Access the seller dashboard to manage your products and track performance.",
      },
      {
        heading: "Contact Us",
        body: "For seller-related queries, email us at sellers@shopy.com or call +916003185021. Our seller support team will respond within 24 hours.",
      },
    ],
    trustBanner: [
      {
        icon: Package,
        title: "Easy Onboarding",
        desc: "Start selling in 3-5 days",
      },
      { icon: Tag, title: "Low Commission", desc: "3% to 15% per sale" },
      { icon: Users, title: "Millions of Buyers", desc: "Reach across India" },
      {
        icon: Headphones,
        title: "24x7 Support",
        desc: "Dedicated seller team",
      },
    ],
  },
};

const FAQ_TOPICS = [
  "All Questions",
  "Orders",
  "Payments",
  "Shipping & Delivery",
  "Returns & Refunds",
  "Account & Profile",
];

const FAQ_ITEMS = [
  {
    id: "place-order",
    topic: "Orders",
    q: "How can I place an order on Shopy?",
    a: "Placing an order is easy! Browse your favorite products, add them to the cart, and proceed to checkout. Enter your shipping address, choose a payment method, and confirm your order. You'll receive an order confirmation via email and SMS.",
  },
  {
    id: "track-order",
    topic: "Orders",
    q: "How do I track my order?",
    a: "Go to \"My Orders\" in your account, click on the order you want to track, and you'll see the current status and tracking information. You'll also receive tracking updates via email and SMS once your order is shipped.",
  },
  {
    id: "return-policy",
    topic: "Returns & Refunds",
    q: "What is the return policy?",
    a: "We offer a 7-day return policy on most products. Items must be unused, in original packaging, with all tags intact. Some categories like innerwear and personal care items are non-returnable.",
  },
  {
    id: "cancel-order",
    topic: "Orders",
    q: "How do I cancel my order?",
    a: 'You can cancel your order from "My Orders" before it has been shipped. Once shipped, cancellation is not possible, but you can return the product after delivery for a full refund.',
  },
  {
    id: "payment-methods",
    topic: "Payments",
    q: "What payment methods are accepted?",
    a: "We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery (COD). All online payments are secured through trusted payment gateways with 256-bit SSL encryption.",
  },
  {
    id: "delivery-time",
    topic: "Shipping & Delivery",
    q: "How long does delivery take?",
    a: "Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available in select cities for ₹99 extra. Remote areas may take additional time depending on the courier partner.",
  },
  {
    id: "free-shipping",
    topic: "Shipping & Delivery",
    q: "Do you offer free shipping?",
    a: "Yes, free shipping is available on all orders above ₹499. Orders below ₹499 incur a flat ₹49 shipping fee. COD orders may have an additional ₹40 handling charge.",
  },
  {
    id: "change-delivery-address",
    topic: "Account & Profile",
    q: "How do I change my delivery address?",
    a: 'You can add or edit addresses in "My Addresses" under your account. During checkout, you can select from your saved addresses or enter a new one. You cannot change the address after the order is shipped.',
  },
];

export default function InfoPage() {
  const { slug } = useParams();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSent, setContactSent] = useState(false);
  const [faqOpen, setFaqOpen] = useState(FAQ_ITEMS[0].id);
  const [selectedTopic, setSelectedTopic] = useState("All Questions");
  const [highlightedTopic, setHighlightedTopic] = useState("All Questions");

  // Policy pages
  if (POLICY_PAGES[slug]) {
    return <PolicyPageLayout {...POLICY_PAGES[slug]} />;
  }

  // About page
  if (slug === "about") {
    return <AboutPage />;
  }

  // Contact page
  if (slug === "contact") {
    const handleContactSubmit = (e) => {
      e.preventDefault();
      setContactSent(true);
      setContactForm({ name: "", email: "", message: "" });
    };
    return (
      <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
        <Breadcrumb
          items={[{ label: "Home", to: "/" }, { label: "Contact Us" }]}
        />
        <h1
          className="text-2xl md:text-4xl font-bold text-[#111827] mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Contact Us
        </h1>
        <p className="text-sm text-gray-500 mb-6 md:mb-8">
          We're here to help! Reach out to us anytime.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-[#111827] mb-3">Get in Touch</h3>
              <div className="space-y-3">
                <a
                  href="mailto:himanshuborah9954@gmail.com"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF5A1F] transition-colors"
                >
                  <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center">
                    <Mail size={16} className="text-[#FF5A1F]" />
                  </div>
                  himanshuborah9954@gmail.com
                </a>
                <a
                  href="tel:+918001234567"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF5A1F] transition-colors"
                >
                  <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center">
                    <Phone size={16} className="text-[#FF5A1F]" />
                  </div>
                  +916003185021
                </a>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-[#FF5A1F]" />
                  </div>
                  <span>
                    Shopy E-commerce Pvt. Ltd., 123 Tech Park, Electronic City,
                    Bengaluru - 560100
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-[#111827] mb-2">
                Customer Support Hours
              </h3>
              <p className="text-sm text-gray-500">
                24x7 - We're always here to help!
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
            <h3 className="font-bold text-[#111827] mb-4">Send Us a Message</h3>
            {contactSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-green-600" />
                </div>
                <h4 className="font-bold text-[#111827] mb-1">Message Sent!</h4>
                <p className="text-sm text-gray-500 mb-4">
                  We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setContactSent(false)}
                  className="text-sm text-[#FF5A1F] font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Your Name *
                  </label>
                  <input
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Message *
                  </label>
                  <textarea
                    required
                    rows="5"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FAQ page
  if (slug === "faq") {
    const visibleFaqItems =
      selectedTopic === "All Questions"
        ? FAQ_ITEMS
        : FAQ_ITEMS.filter((item) => item.topic === selectedTopic);

    const handleTopicClick = (topic) => {
      const nextOpenItem =
        topic === "All Questions"
          ? FAQ_ITEMS[0]
          : FAQ_ITEMS.find((item) => item.topic === topic);

      setSelectedTopic(topic);
      setHighlightedTopic(topic);
      setFaqOpen(nextOpenItem?.id ?? "");
    };

    const handleFaqClick = (item) => {
      setHighlightedTopic(item.topic);
      setFaqOpen(faqOpen === item.id ? "" : item.id);
    };

    return (
      <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />
        <h1
          className="text-2xl md:text-4xl font-bold text-[#111827] mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-gray-500 mb-6 md:mb-8">
          Find answers to common questions about shopping on Shopy.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-sm text-[#111827] mb-3">
                  Browse by Topic
                </h3>
                <nav className="space-y-1">
                  {FAQ_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
                      className={`flex items-center w-full px-3 py-2 rounded-lg text-left text-sm transition-colors ${highlightedTopic === topic ? "bg-orange-50 text-[#FF5A1F] font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {topic}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="bg-[#FFF7F4] rounded-xl border border-orange-100 p-4">
                <h3 className="font-bold text-sm text-[#111827] mb-1">
                  Still Need Help?
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Can't find the answer? Our support team is here to help.
                </p>
                <Link to="/help-center" className="btn-primary text-sm w-full">
                  Contact Us →
                </Link>
              </div>
            </div>
          </aside>

          {/* FAQ list */}
          <div>
            <div className="flex items-center gap-2 mb-4 bg-white rounded-xl border border-gray-200 px-4">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search for questions..."
                className="flex-1 py-3 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              {visibleFaqItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => handleFaqClick(item)}
                    className="flex items-center justify-between w-full p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-sm md:text-base text-[#111827] pr-4">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-[#FF5A1F] flex-shrink-0 transition-transform duration-300 ${faqOpen === item.id ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {faqOpen === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm md:text-base text-gray-600 leading-relaxed">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-blue-50 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Headphones size={24} className="text-[#FF5A1F]" />
                <p className="text-sm text-gray-600">
                  Can't find what you're looking for? Our support team is
                  available 24x7.
                </p>
              </div>
              <Link
                to="/help-center"
                className="btn-primary text-sm whitespace-nowrap"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sitemap
  if (slug === "sitemap") {
    return (
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6">
        <Breadcrumb
          items={[{ label: "Home", to: "/" }, { label: "Sitemap" }]}
        />
        <h1
          className="text-2xl md:text-3xl font-bold text-[#111827] mb-6"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Sitemap
        </h1>
        <div className="space-y-4">
          {[
            {
              heading: "Main Pages",
              links: [
                ["Home", "/"],
                ["All Categories", "/categories"],
                ["Search", "/search"],
                ["Cart", "/cart"],
                ["Checkout", "/checkout"],
                ["Wishlist", "/wishlist"],
              ],
            },
            {
              heading: "Account Pages",
              links: [
                ["Dashboard", "/account/dashboard"],
                ["My Orders", "/account/orders"],
                ["My Addresses", "/account/addresses"],
                ["My Wishlist", "/account/wishlist"],
                ["My Profile", "/account/profile"],
                ["Change Password", "/account/password"],
                ["Change Email", "/account/email"],
                ["Notification Settings", "/account/notifications"],
              ],
            },
            {
              heading: "Information Pages",
              links: [
                ["About Us", "/info/about"],
                ["Contact Us", "/info/contact"],
                ["FAQ", "/info/faq"],
                ["Help Center", "/help-center"],
              ],
            },
            {
              heading: "Policy Pages",
              links: [
                ["Shipping Policy", "/info/shipping"],
                ["Return Policy", "/info/returns"],
                ["Privacy Policy", "/info/privacy-policy"],
                ["Terms & Conditions", "/info/terms"],
                ["Cookie Policy", "/info/cookies"],
                ["Seller Policy", "/info/seller-policy"],
              ],
            },
          ].map((section) => (
            <div
              key={section.heading}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <h2 className="font-bold text-[#111827] mb-3">
                {section.heading}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {section.links.map(([label, to]) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-sm text-gray-600 hover:text-[#FF5A1F] transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Not found
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-[#111827] mb-2">Page Not Found</h1>
      <Link to="/" className="text-[#FF5A1F] hover:underline">
        Go Home →
      </Link>
    </div>
  );
}

function AboutPage() {
  const stats = [
    { icon: Users, value: "5M+", label: "Happy Customers" },
    { icon: Package, value: "10M+", label: "Orders Delivered" },
    { icon: Star, value: "4.6/5", label: "Customer Rating" },
    { icon: Smile, value: "99%", label: "Customer Satisfaction" },
  ];
  const features = [
    {
      icon: Shield,
      title: "Trusted & Secure",
      desc: "100% secure payments and data protection",
    },
    {
      icon: Tag,
      title: "Best Quality",
      desc: "Handpicked products from trusted brands",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Quick and reliable delivery at your door",
    },
    {
      icon: Headphones,
      title: "24x7 Support",
      desc: "We're always here to help you",
    },
  ];
  const mvv = [
    {
      icon: Target,
      title: "Our Mission",
      desc: "To deliver happiness to every doorstep by making online shopping easy, affordable, and enjoyable for everyone across India.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      desc: "To become India's most loved and trusted e-commerce platform, known for quality, value, and exceptional customer service.",
    },
    {
      icon: Gem,
      title: "Our Values",
      desc: "Customer First • Integrity • Quality • Innovation • Passion • Teamwork",
    },
  ];

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-3 md:px-4 py-4 md:py-6">
        <Breadcrumb
          items={[{ label: "Home", to: "/" }, { label: "About Us" }]}
        />

        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-3xl md:text-5xl font-bold text-[#111827] mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              About <span className="text-[#FF5A1F]">Shopy</span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
              Shopy was founded with a simple idea - to make online shopping
              easy, affordable and enjoyable for everyone. We bring you a wide
              range of quality products across categories, at the best prices,
              with a smooth shopping experience and excellent customer service.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-2">
                  <div className="w-9 h-9 rounded-full border border-orange-200 bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <f.icon size={16} className="text-[#FF5A1F]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">
                      {f.title}
                    </p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-80"
          >
            <img
              src={aboutImage}
              alt="Shopy team"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Mission Vision Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
          {mvv.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#FFF9F5] to-[#FFF3ED] rounded-2xl p-6"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-orange-200 flex items-center justify-center mb-4">
                <item.icon size={22} className="text-[#FF5A1F]" />
              </div>
              <h3
                className="font-bold text-lg text-[#111827] mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center mb-10 md:mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#111827] mb-6 md:mb-8"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Why Customers Love Shopy
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-3">
                  <s.icon size={22} className="text-[#FF5A1F]" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#111827] mb-1">
                  {s.value}
                </p>
                <p className="text-xs md:text-sm text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#FF5A1F] to-[#E64A19] rounded-2xl p-6 md:p-10 text-center text-white">
          <h2
            className="text-xl md:text-2xl font-bold mb-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Join millions of happy customers
          </h2>
          <p className="text-sm md:text-base text-white/90 mb-5 max-w-2xl mx-auto">
            Quality products, best prices and a smile - delivered to you!
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-white text-[#FF5A1F] font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
          >
            Start Shopping Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
