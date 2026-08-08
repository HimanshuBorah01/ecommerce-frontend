// Razorpay checkout integration helper.
// Loads the Razorpay checkout script and wraps order creation + verification
// against the backend payment controller.

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

let loadPromise = null;

// Load the Razorpay checkout script once and cache the promise.
export function loadRazorpayScript() {
  if (typeof window === "undefined")
    return Promise.reject(new Error("Not in browser"));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        if (window.Razorpay) resolve(window.Razorpay);
        else reject(new Error("Razorpay failed to initialize"));
      };
      script.onerror = () => {
        loadPromise = null;
        reject(new Error("Failed to load Razorpay checkout"));
      };
      document.body.appendChild(script);
    });
  }

  return loadPromise;
}

/**
 * Open the Razorpay checkout modal for an order.
 *
 * @param {Object} options
 * @param {string} options.razorpayOrderId - The Razorpay order ID from the backend.
 * @param {number} options.amount - Amount in rupees (or the raw amount passed to backend).
 * @param {Object} options.prefill - { name, email, contact }
 * @param {Object} options.theme - { color }
 */
export async function openRazorpayCheckout({
  razorpayOrderId,
  amount,
  prefill = {},
  theme = {},
}) {
  const Razorpay = await loadRazorpayScript();

  if (!RAZORPAY_KEY_ID) {
    throw new Error("Razorpay key ID is not configured");
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    const options = {
      key: RAZORPAY_KEY_ID,
      order_id: razorpayOrderId,
      name: "Shopy",
      description: "Payment for your order",
      amount: Math.round(Number(amount || 0) * 100),
      currency: "INR",
      prefill: {
        name: prefill.name || "",
        email: prefill.email || "",
        contact: prefill.contact || "",
      },
      theme: { color: theme.color || "#FF5A1F" },
      handler: (response) => {
        if (settled) return;
        settled = true;
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          if (settled) return;
          settled = true;
          reject(new Error("Payment modal was closed"));
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", (response) => {
      if (settled) return;
      settled = true;
      reject(new Error(response?.error?.description || "Payment failed"));
    });
    rzp.open();
  });
}

export default {
  loadScript: loadRazorpayScript,
  openCheckout: openRazorpayCheckout,
};
