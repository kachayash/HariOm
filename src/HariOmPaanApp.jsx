import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "919104830377"; // Kano

const NAV_LINKS = [
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Supplies", href: "#supplies" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    id: "moti",
    name: "Juni Moti Supari",
    gujaratiName: "જૂની મોટી સોપારી",
    localName:
      "જૂની મોટી સોપારી - Large, aged whole betel nuts known for their robust flavor, rich aroma, and premium texture.",
    pricePerKg: 800,
    price: "₹800",
    badge: { label: "Premium", className: "bg-tertiary text-on-tertiary" },
    image: "/images/moti.jpg",
    alt: "Premium Juni Moti whole betel nuts on a clean background.",
  },
  {
    id: "moro",
    name: "Juni Moro Supari",
    gujaratiName: "જૂની મોરો સોપારી",
    localName:
      "જૂની મોરો સોપારી - Medium-sized, well-cured nuts ideal for daily chewing and standard paan shop preparations.",
    pricePerKg: 840,
    price: "₹840",
    badge: null,
    image: "/images/moro.jpg",
    alt: "Juni Moro supari, whole and partially cut betel nut pieces.",
  },
  {
    id: "sekal",
    name: "Juni Sekal Supari",
    gujaratiName: "જૂની સેકલ સોપારી",
    localName:
      "જૂની સેકલ સોપારી - Specially selected and cured, offering an exquisite texture with beautiful radial cut patterns.",
    pricePerKg: 840,
    price: "₹840",
    badge: { label: "Best Seller", className: "bg-secondary text-on-secondary" },
    image: "/images/sekal.jpg",
    alt: "Juni Sekal sliced supari showing the internal radial pattern.",
  },
];

const INVENTORY_ITEMS = [
  {
    icon: "smoking_rooms",
    title: "Premium 138 Tobacco",
    subtitle: "Available With / Without Work (કામવાળું / વગર કામનું)",
  },
  {
    icon: "science",
    title: "Limestone (Chuna)",
    subtitle: "High-grade edible quality chuna for paan shops",
  },
  {
    icon: "shopping_bag",
    title: "Packaging Materials",
    subtitle: "Plastic pouch bags, rubber bands & shop supplies",
  },
];

const CONTACTS = [
  { name: "Jayeshbhai Sapariya", phoneDisplay: "98793 33913", phoneHref: "9879333913" },
  { name: "Diyanbhai Siddhapura (Kano)", phoneDisplay: "91048 30377", phoneHref: "9104830377" },
];

// ------------------------------------------------------------------
// WhatsApp Order & Automatic Price Calculation Modal
// ------------------------------------------------------------------
function WhatsAppOrderModal({ isOpen, onClose, initialProduct = null }) {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [city, setCity] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(
    initialProduct?.id || PRODUCTS[0].id
  );
  const [weightOption, setWeightOption] = useState("1kg"); // "250gm", "500gm", "1kg", "2kg", "5kg", "custom"
  const [customKg, setCustomKg] = useState("10");
  const [cuttingType, setCuttingType] = useState("machine"); // "machine", "sarota", "whole"
  const [selectedSupplies, setSelectedSupplies] = useState([]);
  const [specialNotes, setSpecialNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const pricePerKg = currentProduct.pricePerKg;

  // Calculate weight and price based on selected unit / kg
  let weightInKg = 1;
  let weightLabel = "1 kg";

  if (weightOption === "250gm") {
    weightInKg = 0.25;
    weightLabel = "250 gm";
  } else if (weightOption === "500gm") {
    weightInKg = 0.5;
    weightLabel = "500 gm";
  } else if (weightOption === "1kg") {
    weightInKg = 1;
    weightLabel = "1 kg";
  } else if (weightOption === "2kg") {
    weightInKg = 2;
    weightLabel = "2 kg";
  } else if (weightOption === "5kg") {
    weightInKg = 5;
    weightLabel = "5 kg";
  } else if (weightOption === "custom") {
    const parsed = parseFloat(customKg) || 1;
    weightInKg = Math.max(0.25, parsed);
    weightLabel = `${weightInKg} kg`;
  }

  const calculatedTotalPrice = Math.round(pricePerKg * weightInKg);

  const cuttingLabels = {
    machine: "Machine Cut / Sancha Cutting (સંચા કટિંગ)",
    sarota: "Sarota Cut / Sudi Cutting (સૂડી કટિંગ)",
    whole: "Whole Supari (આખી સોપારી)",
  };

  const handleSupplyToggle = (itemTitle) => {
    setSelectedSupplies((prev) =>
      prev.includes(itemTitle)
        ? prev.filter((title) => title !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  const handleSendToWhatsApp = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setErrorMessage("Please enter your name (તમારું નામ દાખલ કરો).");
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number (મોબાઈલ નંબર ચકાસો).");
      return;
    }

    setErrorMessage("");

    const messageLines = [
      "🛒 *NEW ORDER / PRICE INQUIRY*",
      "*Hari Om Paan & Coldrinks - Rajkot*",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      `👤 *Customer Name:* ${customerName.trim()}`,
      `📱 *Mobile Number:* ${mobileNumber.trim()}`,
      city.trim() ? `📍 *City / Area:* ${city.trim()}` : null,
      "",
      `📦 *Selected Product:* ${currentProduct.name} (${currentProduct.gujaratiName})`,
      `⚖️ *Selected Weight:* ${weightLabel}`,
      `💰 *Base Rate:* ₹${pricePerKg} / kg`,
      `💵 *Estimated Total Price:* ₹${calculatedTotalPrice.toLocaleString("en-IN")}`,
      `✂️ *Cutting Preference:* ${cuttingLabels[cuttingType]}`,
      selectedSupplies.length > 0
        ? `➕ *Extra Supplies:* ${selectedSupplies.join(", ")}`
        : null,
      specialNotes.trim() ? `📝 *Notes:* ${specialNotes.trim()}` : null,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "Please confirm stock availability and delivery schedule.",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageLines)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl max-w-lg w-full shadow-2xl border border-outline-variant/30 overflow-hidden my-4 sm:my-8 modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-primary text-on-primary px-5 py-4 flex items-center justify-between border-b border-tertiary-container/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <div>
              <h3 className="font-headline-lg text-lg sm:text-xl font-bold text-white leading-tight">
                Quick Order &amp; Price Calculator
              </h3>
              <p className="text-xs text-tertiary-container">
                ઓર્ડર ફોર્મ • ભાવ અને વજન ગણતરી
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-on-primary/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSendToWhatsApp} className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-lg">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-secondary">badge</span>
              1. Your Contact Details (ગ્રાહક વિગત)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">
                  Full Name / નામ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant/60 text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajeshbhai Patel"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-9 pr-3 py-2 text-sm text-on-surface focus:outline-hidden focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">
                  Mobile / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant/60 text-lg">
                    call
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98793 33913"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-9 pr-3 py-2 text-sm text-on-surface focus:outline-hidden focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                City / Delivery Location (શહેર / ગામ)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant/60 text-lg">
                  location_on
                </span>
                <input
                  type="text"
                  placeholder="e.g. Rajkot, Gondal, Morbi, Ahmedabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-9 pr-3 py-2 text-sm text-on-surface focus:outline-hidden focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Choose Product */}
          <div className="space-y-2 pt-1 border-t border-outline-variant/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 pt-2">
              <span className="material-symbols-outlined text-base text-secondary">inventory_2</span>
              2. Select Supari Product (સોપારી પસંદ કરો)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRODUCTS.map((prod) => {
                const isSelected = prod.id === selectedProductId;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex sm:flex-col items-center sm:items-start gap-2.5 ${
                      isSelected
                        ? "bg-secondary-container/30 border-secondary ring-1 ring-secondary shadow-xs"
                        : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container-high"
                    }`}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 sm:w-full sm:h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-primary truncate block">
                          {prod.name}
                        </span>
                        {isSelected && (
                          <span
                            className="material-symbols-outlined text-secondary text-sm shrink-0"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check_circle
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-tertiary block font-medium">
                        {prod.gujaratiName}
                      </span>
                      <span className="font-bold text-xs text-secondary mt-0.5 block">
                        {prod.price}/kg
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Select Weight / Quantity */}
          <div className="space-y-2 pt-1 border-t border-outline-variant/20">
            <div className="flex items-center justify-between pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-secondary">scale</span>
                3. Select Weight / Quantity (કેટલા કિલો જોઈએ?)
              </h4>
              <span className="text-xs font-semibold text-secondary">
                Selected: {weightLabel}
              </span>
            </div>

            {/* Quick Weight Chips */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: "250gm", label: "250 gm", sub: "0.25 kg" },
                { id: "500gm", label: "500 gm", sub: "0.50 kg" },
                { id: "1kg", label: "1 kg", sub: "Standard" },
                { id: "2kg", label: "2 kg", sub: "Pack" },
                { id: "5kg", label: "5 kg", sub: "Wholesale" },
                { id: "custom", label: "Custom", sub: "Other kg" },
              ].map((chip) => {
                const isActive = weightOption === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setWeightOption(chip.id)}
                    className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-on-primary border-primary shadow-xs font-bold"
                        : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container-high text-on-surface"
                    }`}
                  >
                    <span className="block text-xs font-bold">{chip.label}</span>
                    <span
                      className={`block text-[10px] ${
                        isActive ? "text-on-primary/70" : "text-on-surface-variant/70"
                      }`}
                    >
                      {chip.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Weight Stepper/Input */}
            {weightOption === "custom" && (
              <div className="mt-2.5 p-3 rounded-lg bg-surface-container-low border border-outline-variant/50 flex items-center justify-between gap-3">
                <div className="text-xs font-medium text-on-surface">
                  Enter Custom Weight (કિલો):
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(customKg) || 1;
                      setCustomKg(String(Math.max(1, cur - 1)));
                    }}
                    className="w-8 h-8 rounded-md bg-surface-container-high hover:bg-surface-container-highest font-bold text-sm flex items-center justify-center cursor-pointer border border-outline-variant/40"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={customKg}
                    onChange={(e) => setCustomKg(e.target.value)}
                    className="w-20 bg-surface border border-outline-variant/60 rounded-md py-1 px-2 text-center text-sm font-bold text-primary focus:outline-hidden"
                  />
                  <span className="text-xs font-semibold text-on-surface-variant">kg</span>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(customKg) || 1;
                      setCustomKg(String(cur + 1));
                    }}
                    className="w-8 h-8 rounded-md bg-surface-container-high hover:bg-surface-container-highest font-bold text-sm flex items-center justify-center cursor-pointer border border-outline-variant/40"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Cutting Preference */}
          <div className="space-y-2 pt-1 border-t border-outline-variant/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 pt-2">
              <span className="material-symbols-outlined text-base text-secondary">content_cut</span>
              4. Cutting Preference (કટિંગ પસંદગી)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: "machine", label: "Machine Cut (મશીન)", icon: "precision_manufacturing" },
                { id: "sarota", label: "Suda Cut (સૂડી)", icon: "content_cut" },
                { id: "whole", label: "Whole nuts(આખી સોપારી)", icon: "circle" },
              ].map((cut) => {
                const isActive = cuttingType === cut.id;
                return (
                  <button
                    key={cut.id}
                    type="button"
                    onClick={() => setCuttingType(cut.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? "bg-secondary/10 border-secondary text-secondary font-bold ring-1 ring-secondary"
                        : "bg-surface-container-low border-outline-variant/40 text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{cut.icon}</span>
                    <span className="text-xs font-semibold">{cut.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Additional Supplies Checkboxes */}
          <div className="space-y-2 pt-1 border-t border-outline-variant/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 pt-2">
              <span className="material-symbols-outlined text-base text-secondary">add_shopping_cart</span>
              5. Also Need Paan Supplies? (અન્ય સામગ્રી)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {INVENTORY_ITEMS.map((item) => {
                const isChecked = selectedSupplies.includes(item.title);
                return (
                  <label
                    key={item.title}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? "bg-primary/5 border-primary font-semibold text-primary"
                        : "bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSupplyToggle(item.title)}
                      className="rounded text-primary focus:ring-primary h-3.5 w-3.5 accent-primary"
                    />
                    <span className="truncate">{item.title}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 6: Special Note (Optional) */}
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Special Request / Instructions (કોઈ ખાસ સૂચના હોય તો)
            </label>
            <input
              type="text"
              placeholder="e.g. Urgent delivery needed, specific bag size, or tobacco details..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-secondary"
            />
          </div>

          {/* Section 7: Live Automatic Calculated Price Card */}
          <div className="bg-gradient-to-br from-primary to-primary-container text-white p-4 rounded-xl shadow-md border border-tertiary-container/30">
            <div className="flex items-center justify-between text-xs text-on-primary/80 pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary-container text-base">
                  calculate
                </span>
                <span className="font-semibold text-white">Live Price Calculation</span>
              </div>
              <span className="bg-white/15 px-2 py-0.5 rounded text-[11px] font-medium">
                Rate: ₹{pricePerKg}/kg
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between gap-2">
              <div>
                <span className="text-xs text-on-primary/80 block">
                  {currentProduct.name} ({weightLabel})
                </span>
                <span className="text-[11px] text-tertiary-container">
                  ₹{pricePerKg} × {weightInKg} kg
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-tertiary-container font-semibold block">
                  Total Estimated Amount
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  ₹{calculatedTotalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-on-primary/70 mt-2 italic">
              * Automatic calculation based on 1 kg wholesale base rate. Final confirmation &amp; transport details on WhatsApp.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                chat
              </span>
              <span>Send Order on WhatsApp • ₹{calculatedTotalPrice.toLocaleString("en-IN")}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="sm:w-auto px-5 py-3 rounded-xl border border-outline-variant/50 text-on-surface-variant font-semibold text-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Floating WhatsApp Chat Button with Pulse Animation
// ------------------------------------------------------------------
function FloatingWhatsAppButton({ onOpenOrder }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip / Label */}
      <div
        onClick={() => onOpenOrder()}
        className="hidden sm:flex items-center gap-2 bg-surface/95 backdrop-blur-md text-primary font-bold text-xs px-4 py-2.5 rounded-full shadow-lg border border-outline-variant/30 cursor-pointer hover:bg-surface-container-high transition-colors"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping" />
        <span>Order &amp; Calc Price</span>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => onOpenOrder()}
        aria-label="Open WhatsApp Order Form"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 whatsapp-pulse cursor-pointer group"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">
          chat
        </span>
      </button>
    </div>
  );
}

// ------------------------------------------------------------------
// Top Navigation Bar
// ------------------------------------------------------------------
function TopNavBar({ onOpenOrder }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#products");

  return (
    <nav className="glass-nav border-b border-outline-variant/20 sticky top-0 z-50 w-full shadow-xs">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-20">
        <a href="#top" className="flex items-center gap-3 group">
          <img
            alt="Hari Om Paan & Coldrinks Logo"
            className="h-12 w-12 rounded-full object-contain border border-secondary/20 shadow-xs transition-transform group-hover:scale-105"
            src="/images/logo.jpg"
          />
          <div>
            <span className="font-headline-lg text-lg sm:text-xl font-bold text-primary block leading-tight">
              Hari Om Paan &amp; Coldrinks
            </span>
            <span className="text-[11px] font-semibold text-tertiary block leading-tight">
              રાજકોટ હોલસેલ સોપારી • Whole &amp; Sliced Supari
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActiveHref(link.href)}
              className={
                activeHref === link.href
                  ? "text-primary border-b-2 border-primary font-bold pb-1 transition-colors duration-200"
                  : "text-on-surface-variant font-medium hover:text-primary transition-colors duration-200"
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenOrder()}
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md hidden sm:inline-flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            <span>Order / Calc Price</span>
          </button>

          <button
            className="md:hidden text-primary p-2 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Open menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="material-symbols-outlined text-3xl">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-outline-variant/20 px-6 py-4 bg-surface shadow-xl">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-primary font-semibold py-1.5"
                onClick={() => {
                  setActiveHref(link.href);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenOrder();
              }}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2 mt-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>Order / Calculate Price</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ------------------------------------------------------------------
// Enhanced, Perfectly Aligned Hero Section
// ------------------------------------------------------------------
function HeroSection({ onOpenOrder }) {
  return (
    <section
      id="about"
      className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden heritage-pattern border-b border-outline-variant/20"
    >
      {/* Ambient background glow accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-gradient-to-tr from-secondary/10 via-tertiary/10 to-primary/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Text & Value Propositions (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-container-high/90 border border-tertiary/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-tertiary shadow-xs">
            <span
              className="material-symbols-outlined text-base text-tertiary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span>Premium Wholesale Supari • Rajkot, Gujarat</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-primary tracking-tight leading-[1.18]">
              Best Quality Betel Nut{" "}
              <span className="text-secondary italic underline decoration-secondary/30 decoration-wavy decoration-1">
                (Supari)
              </span>{" "}
              &amp; Paan Supplies
            </h1>
            <p className="text-sm sm:text-base font-semibold text-tertiary">
              શ્રેષ્ઠ ગુણવત્તાવાળી જૂની સોપારી • હોલસેલ તથા રીટેલ વેચાણ
            </p>
          </div>

          {/* Body Paragraph */}
          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Direct wholesale suppliers of Gujarat&apos;s finest aged betel nuts —{" "}
            <strong className="text-primary font-semibold">Juni Moti</strong>,{" "}
            <strong className="text-primary font-semibold">Juni Moro</strong>, and{" "}
            <strong className="text-primary font-semibold">Juni Sekal</strong>.
            Available in whole nuts, precision machine cutting, and traditional suda
            cutting tailored for paan shops across Gujarat.
          </p>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-surface/90 border border-outline-variant/30 rounded-xl p-3 flex items-center gap-2.5 shadow-xs">
              <span
                className="material-symbols-outlined text-secondary text-2xl shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                price_check
              </span>
              <div>
                <span className="font-bold text-xs text-on-surface block">From ₹800/kg</span>
                <span className="text-[11px] text-on-surface-variant">Wholesale Rate</span>
              </div>
            </div>

            <div className="bg-surface/90 border border-outline-variant/30 rounded-xl p-3 flex items-center gap-2.5 shadow-xs">
              <span
                className="material-symbols-outlined text-secondary text-2xl shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                content_cut
              </span>
              <div>
                <span className="font-bold text-xs text-on-surface block">Custom Cut</span>
                <span className="text-[11px] text-on-surface-variant">Machine &amp; Sudi</span>
              </div>
            </div>

            <div className="bg-surface/90 border border-outline-variant/30 rounded-xl p-3 flex items-center gap-2.5 shadow-xs">
              <span
                className="material-symbols-outlined text-secondary text-2xl shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_shipping
              </span>
              <div>
                <span className="font-bold text-xs text-on-surface block">Fast Dispatch</span>
                <span className="text-[11px] text-on-surface-variant">Across Gujarat</span>
              </div>
            </div>

            <div className="bg-surface/90 border border-outline-variant/30 rounded-xl p-3 flex items-center gap-2.5 shadow-xs">
              <span
                className="material-symbols-outlined text-secondary text-2xl shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                inventory_2
              </span>
              <div>
                <span className="font-bold text-xs text-on-surface block">Ready Stock</span>
                <span className="text-[11px] text-on-surface-variant">250g to 50kg+</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
            <button
              type="button"
              onClick={() => onOpenOrder()}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02] cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
              <span>Order &amp; Calculate Price</span>
            </button>

            <a
              href="#products"
              className="bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/40 font-semibold px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>View Supari Selection</span>
              <span className="material-symbols-outlined text-lg">arrow_downward</span>
            </a>
          </div>
        </div>

        {/* Right Column: Hero Showcase Visual (5 cols on lg) */}
        <div className="lg:col-span-5 relative mt-4 lg:mt-0">
          <div className="relative mx-auto max-w-lg lg:max-w-none">
            {/* Ambient decorative glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-secondary/30 via-tertiary/20 to-primary/20 rounded-2xl blur-lg opacity-70" />

            {/* Main Showcase Image Card */}
            <div className="relative rounded-2xl overflow-hidden soft-shadow border border-outline-variant/30 bg-surface group">
              <div className="aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden relative">
                <img
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  alt="Premium whole betel nuts on a carved wooden platter at Hari Om Paan & Coldrinks."
                  src="/images/hero.jpg"
                />
                {/* Subtle soft vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                {/* Floating Top Pill */}
                <div className="absolute top-3 left-3 bg-surface/95 backdrop-blur-md border border-outline-variant/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span
                    className="material-symbols-outlined text-secondary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-xs font-bold text-primary">100% Cured &amp; Aged</span>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-surface/95 backdrop-blur-md border border-outline-variant/30 p-3 rounded-xl shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/images/logo.jpg"
                      alt="Hari Om Logo"
                      className="w-10 h-10 rounded-full border border-secondary/20 object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-primary">Hari Om Paan &amp; Coldrinks</h4>
                      <p className="text-[11px] text-on-surface-variant">Rajkot&apos;s Trusted Supari Mandi</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenOrder()}
                    className="bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Quick Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Availability Banner
// ------------------------------------------------------------------
function AvailabilityBanner({ onOpenOrder }) {
  return (
    <section className="bg-primary text-on-primary py-5 px-4 sm:px-6 lg:px-8 border-y-2 border-tertiary-container relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
        }}
      />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative z-10">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-3xl sm:text-4xl text-tertiary-container shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            precision_manufacturing
          </span>
          <div>
            <p className="font-semibold text-base sm:text-lg tracking-wide text-white">
              Both Cutting (Sliced) and Whole Supari Available.
            </p>
            <p className="text-xs sm:text-sm text-tertiary-container">
              સંચા કટિંગ (Machine) &amp; સૂડી કટિંગ (Sarota) as per your paan shop requirement.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenOrder()}
          className="bg-tertiary-container hover:bg-[#b89525] text-on-tertiary-container font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-colors shrink-0 cursor-pointer"
        >
          Inquire Custom Cutting
        </button>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Product Card
// ------------------------------------------------------------------
function ProductCard({ product, onOpenOrder }) {
  return (
    <div className="bg-surface rounded-2xl soft-shadow border border-outline-variant/20 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="h-60 bg-surface-container-high relative overflow-hidden group">
        <img
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            product.id === "sekal" ? "object-[center_65%] scale-[1.12]" : "object-center"
          }`}
          alt={product.alt}
          src={product.image}
        />
        {product.badge && (
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full font-label-sm text-xs font-bold uppercase tracking-wider shadow-sm ${product.badge.className}`}
          >
            {product.badge.label}
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs font-semibold">
          {product.gujaratiName}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-title-md text-xl text-primary font-bold">{product.name}</h3>
          </div>
          <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
            {product.localName}
          </p>
        </div>

        <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Wholesale Rate
            </span>
            <span className="text-2xl font-bold text-secondary">
              {product.price}
              <span className="text-sm font-normal text-on-surface-variant">/kg</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenOrder(product)}
            aria-label={`Order ${product.name} on WhatsApp`}
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all font-semibold text-sm cursor-pointer group"
          >
            <span className="material-symbols-outlined text-white text-lg transition-transform group-hover:scale-110">
              chat
            </span>
            <span>Order / Price</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Products Section
// ------------------------------------------------------------------
function ProductsSection({ onOpenOrder }) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest" id="products">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-sm">verified</span>
            Direct Wholesale Mandi Rates
          </div>
          <h2 className="font-headline-lg text-3xl sm:text-4xl text-primary font-bold">
            Signature Supari Selection
          </h2>
          <p className="text-base text-on-surface-variant">
            Our highest grade betel nuts, carefully sourced, dried, and prepared for discerning
            retailers and paan shop owners. Click &apos;Order / Price&apos; to calculate instant weight rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} onOpenOrder={onOpenOrder} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Additional Supplies / Inventory
// ------------------------------------------------------------------
function InventoryItem({ item, onOpenOrder }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 soft-shadow hover:border-secondary/40 transition-colors">
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-2xl">{item.icon}</span>
        </div>
        <div>
          <h4 className="font-title-md text-base text-on-surface font-bold">{item.title}</h4>
          <p className="text-xs text-on-surface-variant mt-0.5">{item.subtitle}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onOpenOrder()}
        className="text-[#25D366] hover:bg-[#25D366]/10 p-2 rounded-lg transition-colors cursor-pointer"
        title="Inquire on WhatsApp"
      >
        <span className="material-symbols-outlined text-2xl">chat</span>
      </button>
    </div>
  );
}

function InventorySection({ onOpenOrder }) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface heritage-pattern" id="supplies">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-outline-variant/20 pb-4 gap-4">
          <div>
            <span className="text-xs font-bold text-tertiary uppercase tracking-wider block mb-1">
              One-Stop Paan Shop Supplies
            </span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl text-primary font-bold">
              Additional Shop Materials
            </h2>
            <p className="text-base text-on-surface-variant mt-1">
              Complete your wholesale order with our essential paan shop materials and tobacco supplies.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenOrder()}
            className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
          >
            Inquire Supplies
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INVENTORY_ITEMS.map((item) => (
            <InventoryItem key={item.title} item={item} onOpenOrder={onOpenOrder} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Contact Section
// ------------------------------------------------------------------
function ContactSection({ onOpenOrder }) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest" id="contact">
      <div className="max-w-7xl mx-auto bg-surface-container-low rounded-3xl overflow-hidden soft-shadow border border-outline-variant/20 flex flex-col lg:flex-row">
        <div className="p-6 sm:p-10 lg:w-1/2 space-y-6">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
              Visit or Call Us
            </span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl text-primary font-bold">
              Visit Our Store
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
              For bulk wholesale orders, custom cutting requirements, or general inquiries, contact us
              directly on WhatsApp or visit our shop in Rajkot.
            </p>
          </div>

          <div className="space-y-5 pt-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
              </div>
              <div>
                <h4 className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                  Shop Address
                </h4>
                <p className="text-sm font-semibold text-on-surface">
                  Nehru Nagar 80 Feet Road, Ahir Chowk,
                  <br />
                  Rajkot, Gujarat - 360002
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  call
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                  Contact Phone Numbers
                </h4>
                <div className="space-y-1.5">
                  {CONTACTS.map((contact) => (
                    <p
                      key={contact.name}
                      className="text-sm text-on-surface font-semibold flex items-center justify-between gap-4"
                    >
                      <span>{contact.name}</span>
                      <a
                        className="text-primary hover:underline font-bold"
                        href={`tel:${contact.phoneHref}`}
                      >
                        {contact.phoneDisplay}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenOrder()}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">chat</span>
              <span>Open WhatsApp Order Form</span>
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 min-h-[320px] bg-surface-variant relative">
          <iframe
            title="Hari Om Paan & Coldrinks location in Rajkot"
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Nehru%20Nagar%2080%20Feet%20Road%20Ahir%20Chowk%20Rajkot&t=&z=15&ie=UTF8&iwloc=&output=embed"
          />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Footer
// ------------------------------------------------------------------
function Footer({ onOpenOrder }) {
  return (
    <footer className="bg-primary text-on-primary w-full border-t border-tertiary-container/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.jpg"
              alt="Hari Om Logo"
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <h2 className="font-headline-lg text-xl font-bold text-white">
              Hari Om Paan &amp; Coldrinks
            </h2>
          </div>
          <p className="text-sm text-on-primary/80 leading-relaxed">
            Crafted tradition in every cut. Gujarat&apos;s trusted wholesale supplier of premium
            cured supari, custom cutting, and paan shop materials.
          </p>
        </div>

        <div className="flex flex-col space-y-2 md:items-center">
          <h3 className="text-xs uppercase tracking-wider text-tertiary-container font-bold mb-1">
            Quick Links
          </h3>
          <a
            className="text-sm text-on-primary/80 hover:text-white transition-colors"
            href="#products"
          >
            Supari Products
          </a>
          <a
            className="text-sm text-on-primary/80 hover:text-white transition-colors"
            href="#about"
          >
            About Wholesale
          </a>
          <a
            className="text-sm text-on-primary/80 hover:text-white transition-colors"
            href="#contact"
          >
            Store Location
          </a>
          <button
            type="button"
            onClick={() => onOpenOrder()}
            className="text-sm text-left text-tertiary-container hover:underline font-semibold cursor-pointer"
          >
            WhatsApp Order Calculator
          </button>
        </div>

        <div className="flex flex-col justify-between md:items-end text-left md:text-right space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-tertiary-container font-bold mb-1">
              Rajkot Headquarters
            </h4>
            <p className="text-xs text-on-primary/70">
              Nehru Nagar 80 Feet Road, Ahir Chowk,
              <br />
              Rajkot, Gujarat - 360002
            </p>
          </div>
          <p className="text-xs text-on-primary/60">
            © {new Date().getFullYear()} Hari Om Paan &amp; Coldrinks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ------------------------------------------------------------------
// Main Application Component
// ------------------------------------------------------------------
export default function HariOmPaanApp() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalInitialProduct, setModalInitialProduct] = useState(null);

  const handleOpenOrder = (product = null) => {
    setModalInitialProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderModalOpen(false);
  };

  return (
    <div
      id="top"
      className="bg-background text-on-background font-body-md antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col"
    >
      <TopNavBar onOpenOrder={handleOpenOrder} />
      <main className="flex-1">
        <HeroSection onOpenOrder={handleOpenOrder} />
        <AvailabilityBanner onOpenOrder={handleOpenOrder} />
        <ProductsSection onOpenOrder={handleOpenOrder} />
        <InventorySection onOpenOrder={handleOpenOrder} />
        <ContactSection onOpenOrder={handleOpenOrder} />
      </main>
      <Footer onOpenOrder={handleOpenOrder} />

      {/* Floating Action Button */}
      <FloatingWhatsAppButton onOpenOrder={handleOpenOrder} />

      {/* Interactive WhatsApp Order & Price Calculation Modal */}
      {isOrderModalOpen && (
        <WhatsAppOrderModal
          key={modalInitialProduct?.id || "default-modal"}
          isOpen={isOrderModalOpen}
          onClose={handleCloseOrder}
          initialProduct={modalInitialProduct}
        />
      )}
    </div>
  );
}
