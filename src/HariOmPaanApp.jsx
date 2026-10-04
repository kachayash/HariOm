import { useState, useEffect, useRef } from "react";

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

const PAAN_SUPPLIES = [
  {
    id: "tobacco-138",
    title: "138 Tobacco",
    gujaratiTitle: "૧૩૮ તમાકુ (138 Tobacco)",
    subtitle: "Available With / Without Work (કામવાળું / વગર કામનું)",
    price: 350,
    unit: "pkt",
    unitLabel: "packet (પેકેટ)",
    icon: "smoking_rooms",
    badge: "₹350",
  },
  {
    id: "chuna",
    title: "Limestone (Chuna)",
    gujaratiTitle: "ચૂનો (Edible Chuna)",
    subtitle: "High-grade edible quality chuna for paan shops",
    price: 40,
    unit: "dabi",
    unitLabel: "dabi / pc (ડબ્બી)",
    icon: "science",
    badge: "₹40",
  },
  {
    id: "plastic-50",
    title: "Plastic Bags - Type 1",
    gujaratiTitle: "પ્લાસ્ટિક થેલી - ટાઇપ ૧",
    subtitle: "Heavy quality plastic packaging bags (50 Rs)",
    price: 50,
    unit: "pkt",
    unitLabel: "packet (પેકેટ)",
    icon: "shopping_bag",
    badge: "₹50",
  },
  {
    id: "plastic-40",
    title: "Plastic Bags - Type 2",
    gujaratiTitle: "પ્લાસ્ટિક થેલી - ટાઇપ ૨",
    subtitle: "Standard regular packaging plastic bags (40 Rs)",
    price: 40,
    unit: "pkt",
    unitLabel: "packet (પેકેટ)",
    icon: "shopping_bag",
    badge: "₹40",
  },
  {
    id: "rubber",
    title: "Rubber Bands",
    gujaratiTitle: "રબર બેન્ડ (Rubber)",
    subtitle: "High stretch elastic rubber bands for paan packing",
    price: 20,
    unit: "pkt",
    unitLabel: "packet (પેકેટ)",
    icon: "all_inclusive",
    badge: "₹20",
  },
];

const CONTACTS = [
  { name: "Jayeshbhai Sapariya", phoneDisplay: "98793 33913", phoneHref: "9879333913" },
  { name: "Diyanbhai Siddhapura (Kano)", phoneDisplay: "91048 30377", phoneHref: "9104830377" },
];

// ------------------------------------------------------------------
// WhatsApp Order & Automatic Price Calculation Modal
// ------------------------------------------------------------------
function WhatsAppOrderModal({
  isOpen,
  onClose,
  initialProduct = null,
  initialSupplyId = null,
}) {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [city, setCity] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(() => {
    if (initialProduct?.id) return initialProduct.id;
    if (initialProduct === "none" || initialSupplyId) return "none";
    return PRODUCTS[0].id;
  });
  const [weightOption, setWeightOption] = useState("1kg"); // "250gm", "500gm", "1kg", "2kg", "5kg", "custom"
  const [customKg, setCustomKg] = useState("10");
  const [cuttingType, setCuttingType] = useState("machine"); // "machine", "sarota", "whole"
  const [suppliesQty, setSuppliesQty] = useState(() => {
    if (initialSupplyId) {
      return { [initialSupplyId]: 1 };
    }
    return {};
  });
  const [specialNotes, setSpecialNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [errorTarget, setErrorTarget] = useState(null); // "name" | "phone" | "products"

  const formRef = useRef(null);
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const productsSectionRef = useRef(null);

  const scrollToField = (target) => {
    if (target === "phone" && phoneInputRef.current) {
      phoneInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      phoneInputRef.current.focus();
    } else if (target === "name" && nameInputRef.current) {
      nameInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      nameInputRef.current.focus();
    } else if (target === "products" && productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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

  const hasSupari = selectedProductId !== "none";
  const currentProduct = hasSupari
    ? PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0]
    : null;
  const pricePerKg = currentProduct ? currentProduct.pricePerKg : 0;

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

  const calculatedSupariPrice = hasSupari ? Math.round(pricePerKg * weightInKg) : 0;
  const cleanDigits = mobileNumber.replace(/\D/g, "");

  const cuttingLabels = {
    machine: "Machine Cut / Sancha Cutting (સંચા કટિંગ)",
    sarota: "Sarota Cut / Sudi Cutting (સૂડી કટિંગ)",
    whole: "Whole Supari (આખી સોપારી)",
  };

  const handleToggleSupply = (supplyId) => {
    setSuppliesQty((prev) => {
      const next = { ...prev };
      if (next[supplyId] > 0) {
        delete next[supplyId];
      } else {
        next[supplyId] = 1;
      }
      return next;
    });
  };

  const handleQtyChange = (supplyId, newQty) => {
    setSuppliesQty((prev) => {
      const next = { ...prev };
      if (newQty <= 0) {
        delete next[supplyId];
      } else {
        next[supplyId] = Math.min(999, Math.max(1, newQty));
      }
      return next;
    });
  };

  const handleQtyInput = (supplyId, rawVal) => {
    const parsed = parseInt(rawVal, 10);
    setSuppliesQty((prev) => {
      const next = { ...prev };
      if (isNaN(parsed) || parsed <= 0) {
        next[supplyId] = 1;
      } else {
        next[supplyId] = Math.min(999, parsed);
      }
      return next;
    });
  };

  const selectedSuppliesList = PAAN_SUPPLIES.filter(
    (s) => (suppliesQty[s.id] || 0) > 0
  ).map((s) => ({
    ...s,
    qty: suppliesQty[s.id],
    itemTotal: suppliesQty[s.id] * s.price,
  }));

  const suppliesTotalPrice = selectedSuppliesList.reduce(
    (sum, item) => sum + item.itemTotal,
    0
  );

  const finalGrandTotal = calculatedSupariPrice + suppliesTotalPrice;

  const handleSendToWhatsApp = (e) => {
    e.preventDefault();

    // Reset previous errors
    setNameError("");
    setPhoneError("");

    if (!customerName.trim()) {
      const msg = "Please enter your full name (કૃપા કરીને તમારું નામ દાખલ કરો).";
      setNameError(msg);
      setErrorMessage(msg);
      setErrorTarget("name");
      setTimeout(() => {
        scrollToField("name");
      }, 50);
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      const countMsg =
        cleanPhone.length === 0
          ? "Please enter your 10-digit mobile number (મોબાઈલ નંબર દાખલ કરો)."
          : `Mobile number must be exactly 10 digits. You entered ${cleanPhone.length} digit${cleanPhone.length === 1 ? "" : "s"} (૧૦ અંકનો સાચો નંબર લખો - અત્યારે ${cleanPhone.length} અંક છે).`;
      setPhoneError(countMsg);
      setErrorMessage(countMsg);
      setErrorTarget("phone");
      setTimeout(() => {
        scrollToField("phone");
      }, 50);
      return;
    }

    if (!hasSupari && selectedSuppliesList.length === 0) {
      const msg =
        "Please select at least one Supari product or Paan Supply item (સોપારી અથવા સામગ્રી પસંદ કરો).";
      setErrorMessage(msg);
      setErrorTarget("products");
      setTimeout(() => {
        scrollToField("products");
      }, 50);
      return;
    }

    setErrorMessage("");
    setNameError("");
    setPhoneError("");
    setErrorTarget(null);

    const messageLines = [
      "🛒 *NEW ORDER / PRICE INQUIRY*",
      "*Hari Om Paan & Coldrinks - Rajkot*",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      `👤 *Customer Name:* ${customerName.trim()}`,
      `📱 *Mobile Number:* ${mobileNumber.trim()}`,
      city.trim() ? `📍 *City / Area:* ${city.trim()}` : null,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      hasSupari ? "📦 *SUPARI ORDER:*" : null,
      hasSupari ? `• Product: ${currentProduct.name} (${currentProduct.gujaratiName})` : null,
      hasSupari ? `• Selected Weight: ${weightLabel}` : null,
      hasSupari ? `• Base Rate: ₹${pricePerKg} / kg` : null,
      hasSupari ? `• Cutting: ${cuttingLabels[cuttingType]}` : null,
      hasSupari ? `• Supari Subtotal: ₹${calculatedSupariPrice.toLocaleString("en-IN")}` : null,
      hasSupari && selectedSuppliesList.length > 0 ? "────────────────────────" : null,
      selectedSuppliesList.length > 0 ? "🌿 *PAAN SUPPLIES (અન્ય સામગ્રી):*" : null,
      ...selectedSuppliesList.map(
        (s) =>
          `• ${s.title} (${s.gujaratiTitle}): ${s.qty} × ₹${s.price} = ₹${s.itemTotal.toLocaleString("en-IN")}`
      ),
      selectedSuppliesList.length > 0
        ? `• Supplies Subtotal: ₹${suppliesTotalPrice.toLocaleString("en-IN")}`
        : null,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      `💰 *FINAL ORDER TOTAL: ₹${finalGrandTotal.toLocaleString("en-IN")}*`,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      specialNotes.trim() ? `📝 *Notes:* ${specialNotes.trim()}` : null,
      specialNotes.trim() ? "━━━━━━━━━━━━━━━━━━━━━━━━" : null,
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
                ઓર્ડર ફોર્મ • સોપારી અને અન્ય સામગ્રી ગણતરી
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
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSendToWhatsApp}
          className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto"
        >
          {errorMessage && (
            <div
              onClick={() => scrollToField(errorTarget)}
              className="bg-red-50 border border-red-300 text-red-700 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-2 animate-shake cursor-pointer shadow-xs transition-all hover:bg-red-100/70"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-lg shrink-0">error</span>
                <span className="font-semibold">{errorMessage}</span>
              </div>
              {errorTarget && (
                <span className="text-[11px] font-bold text-red-600 underline shrink-0 whitespace-nowrap">
                  Click to fix ↑
                </span>
              )}
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
                  <span
                    className={`material-symbols-outlined absolute left-3 top-2.5 text-lg transition-colors ${
                      nameError ? "text-red-500" : "text-on-surface-variant/60"
                    }`}
                  >
                    person
                  </span>
                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="e.g. Rajeshbhai Patel"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (nameError) setNameError("");
                      if (errorMessage && errorTarget === "name") setErrorMessage("");
                    }}
                    className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-sm text-on-surface focus:outline-hidden transition-all ${
                      nameError
                        ? "border-red-500 ring-2 ring-red-500/30 bg-red-50/20 animate-shake"
                        : "border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary"
                    }`}
                  />
                </div>
                {nameError && (
                  <p className="text-red-600 text-[11px] font-semibold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {nameError}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-on-surface-variant">
                    Mobile / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  {/* Live digit counter feedback */}
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded transition-all ${
                      cleanDigits.length === 10
                        ? "text-green-700 bg-green-100"
                        : cleanDigits.length > 10
                        ? "text-red-700 bg-red-100"
                        : cleanDigits.length > 0
                        ? "text-amber-800 bg-amber-100"
                        : "text-on-surface-variant/60"
                    }`}
                  >
                    {cleanDigits.length === 0
                      ? "10 digits"
                      : cleanDigits.length === 10
                      ? "✓ 10 digits"
                      : `${cleanDigits.length}/10 digits`}
                  </span>
                </div>
                <div className="relative">
                  <span
                    className={`material-symbols-outlined absolute left-3 top-2.5 text-lg transition-colors ${
                      phoneError ? "text-red-500" : "text-on-surface-variant/60"
                    }`}
                  >
                    call
                  </span>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    maxLength={14}
                    placeholder="e.g. 98793 33913"
                    value={mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMobileNumber(val);
                      const currentClean = val.replace(/\D/g, "");
                      if (currentClean.length === 10) {
                        setPhoneError("");
                        if (errorTarget === "phone") setErrorMessage("");
                      } else if (phoneError) {
                        setPhoneError(`Entered ${currentClean.length}/10 digits (૧૦ અંક પૂરા કરો)`);
                      }
                    }}
                    className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-sm text-on-surface focus:outline-hidden transition-all ${
                      phoneError
                        ? "border-red-500 ring-2 ring-red-500/30 bg-red-50/20 animate-shake"
                        : "border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary"
                    }`}
                  />
                </div>
                {phoneError ? (
                  <p className="text-red-600 text-[11px] font-semibold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {phoneError}
                  </p>
                ) : cleanDigits.length > 0 && cleanDigits.length < 10 ? (
                  <p className="text-amber-700 text-[11px] font-medium flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-xs">info</span>
                    Need {10 - cleanDigits.length} more digit{10 - cleanDigits.length === 1 ? "" : "s"} ({10 - cleanDigits.length} અંક બાકી છે)
                  </p>
                ) : null}
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
          <div ref={productsSectionRef} className="space-y-2 pt-1 border-t border-outline-variant/20">
            <div className="flex items-center justify-between pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-secondary">inventory_2</span>
                2. Select Supari Product (સોપારી પસંદ કરો)
              </h4>
              {hasSupari ? (
                <button
                  type="button"
                  onClick={() => setSelectedProductId("none")}
                  className="text-[11px] text-tertiary hover:underline font-semibold cursor-pointer"
                >
                  Skip Supari (સોપારી વગર)
                </button>
              ) : (
                <span className="text-[11px] bg-secondary/10 text-secondary font-bold px-2 py-0.5 rounded-full">
                  Only Supplies
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRODUCTS.map((prod) => {
                const isSelected = prod.id === selectedProductId;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-start gap-1.5 ${
                      isSelected
                        ? "bg-secondary-container/30 border-secondary ring-1 ring-secondary shadow-xs"
                        : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container-high"
                    }`}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-14 sm:h-16 rounded-lg object-cover"
                    />
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-primary truncate block">
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
                      <span className="text-[10px] text-tertiary block font-medium truncate">
                        {prod.gujaratiName}
                      </span>
                      <span className="font-bold text-xs text-secondary mt-0.5 block">
                        {prod.price}/kg
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* No Supari Card Option */}
              <button
                type="button"
                onClick={() => setSelectedProductId("none")}
                className={`text-center p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  selectedProductId === "none"
                    ? "bg-primary text-white border-primary ring-1 ring-primary shadow-xs"
                    : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container-high text-on-surface"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedProductId === "none" ? "bg-white/20 text-white" : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">block</span>
                </div>
                <div>
                  <span className="font-bold text-xs block leading-tight">No Supari</span>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      selectedProductId === "none" ? "text-white/80" : "text-on-surface-variant"
                    }`}
                  >
                    સોપારી નથી જોઈતી
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Select Weight / Quantity (Only if Supari is selected) */}
          {hasSupari && (
            <div className="space-y-2 pt-1 border-t border-outline-variant/20">
              <div className="flex items-center justify-between pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-secondary">scale</span>
                  3. Select Supari Weight (કેટલા કિલો જોઈએ?)
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
          )}

          {/* Section 4: Cutting Preference (Only if Supari is selected) */}
          {hasSupari && (
            <div className="space-y-2 pt-1 border-t border-outline-variant/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 pt-2">
                <span className="material-symbols-outlined text-base text-secondary">content_cut</span>
                4. Cutting Preference (કટિંગ પસંદગી)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "machine", label: "Machine Cut (મશીન)", icon: "precision_manufacturing" },
                  { id: "sarota", label: "Suda Cut (સૂડી)", icon: "content_cut" },
                  { id: "whole", label: "Whole nuts (આખી સોપારી)", icon: "circle" },
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
          )}

          {/* Section 5: Paan Supplies with Quantity and Live Price Calculation */}
          <div className="space-y-3 pt-1 border-t border-outline-variant/20">
            <div className="flex items-center justify-between pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-secondary">add_shopping_cart</span>
                {hasSupari ? "5. Also Need Paan Supplies? (અન્ય સામગ્રી)" : "Paan Supplies Selection (અન્ય સામગ્રી)"}
              </h4>
              <span className="text-xs font-semibold text-secondary">
                {selectedSuppliesList.length > 0 ? `${selectedSuppliesList.length} Selected` : "Optional"}
              </span>
            </div>

            <div className="space-y-2.5">
              {PAAN_SUPPLIES.map((supply) => {
                const qty = suppliesQty[supply.id] || 0;
                const isSelected = qty > 0;
                const itemSubtotal = qty * supply.price;

                return (
                  <div
                    key={supply.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-secondary-container/20 border-secondary ring-1 ring-secondary/50 shadow-xs"
                        : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container-high/60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      {/* Left: Checkbox, Icon, Title and Price tag */}
                      <div
                        className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleToggleSupply(supply.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSupply(supply.id)}
                          className="rounded text-primary focus:ring-primary h-4 w-4 accent-secondary cursor-pointer shrink-0"
                        />
                        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-lg">{supply.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-on-surface">
                              {supply.title}
                            </span>
                            <span className="bg-secondary/15 text-secondary font-extrabold text-[11px] px-2 py-0.5 rounded-full shrink-0">
                              ₹{supply.price}
                            </span>
                          </div>
                          <span className="text-[11px] text-tertiary block font-medium truncate">
                            {supply.gujaratiTitle}
                          </span>
                        </div>
                      </div>

                      {/* Right: Quantity Stepper & Price Calculation */}
                      {isSelected ? (
                        <div className="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-outline-variant/30">
                          <div className="flex items-center border border-outline-variant/60 rounded-lg bg-surface overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQtyChange(supply.id, qty - 1);
                              }}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-base text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer select-none"
                              aria-label={`Decrease ${supply.title} quantity`}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="999"
                              value={qty}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleQtyInput(supply.id, e.target.value)}
                              className="w-10 sm:w-12 text-center text-xs sm:text-sm font-bold text-primary focus:outline-hidden py-1 border-x border-outline-variant/30"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQtyChange(supply.id, qty + 1);
                              }}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-base text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer select-none"
                              aria-label={`Increase ${supply.title} quantity`}
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right min-w-[70px]">
                            <span className="text-xs sm:text-sm font-extrabold text-secondary block">
                              ₹{itemSubtotal.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-on-surface-variant block">
                              {qty} × ₹{supply.price}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleSupply(supply.id)}
                          className="self-end sm:self-center text-xs font-semibold text-secondary hover:text-white hover:bg-secondary border border-secondary/40 hover:border-secondary px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          + Add (ઉમેરો)
                        </button>
                      )}
                    </div>
                  </div>
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
              placeholder="e.g. Urgent delivery needed, tobacco cutting preference, or specific notes..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-secondary"
            />
          </div>

          {/* Section 7: Live Automatic Calculated Price Card */}
          <div className="bg-gradient-to-br from-primary via-primary-container to-[#0e3b2b] text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-tertiary-container/30 space-y-3">
            <div className="flex items-center justify-between text-xs text-on-primary/80 pb-2.5 border-b border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary-container text-base">
                    calculate
                  </span>
                </div>
                <span className="font-bold text-white text-sm">
                  Live Bill &amp; Order Total (કુલ હિસાબ)
                </span>
              </div>
              <span className="bg-tertiary-container/20 text-tertiary-container border border-tertiary-container/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                Auto-Calculated
              </span>
            </div>

            {/* Itemized Order Breakdown */}
            <div className="space-y-2 py-1 text-xs sm:text-sm">
              {hasSupari && (
                <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10">
                  <div>
                    <span className="font-semibold text-white block">
                      {currentProduct.name} ({currentProduct.gujaratiName})
                    </span>
                    <span className="text-[11px] text-tertiary-container">
                      {weightLabel} • ₹{pricePerKg}/kg
                    </span>
                  </div>
                  <span className="font-bold text-base text-white">
                    ₹{calculatedSupariPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {selectedSuppliesList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/10"
                >
                  <div>
                    <span className="font-semibold text-white block">
                      {item.title} ({item.gujaratiTitle})
                    </span>
                    <span className="text-[11px] text-tertiary-container">
                      {item.qty} {item.unit} × ₹{item.price}
                    </span>
                  </div>
                  <span className="font-bold text-base text-white">
                    ₹{item.itemTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}

              {!hasSupari && selectedSuppliesList.length === 0 && (
                <div className="text-center py-3 text-white/70 text-xs italic bg-white/5 rounded-lg border border-dashed border-white/20">
                  Select a Supari product or at least one Paan Supply item above.
                </div>
              )}
            </div>

            {/* Grand Total Summary */}
            <div className="pt-2.5 border-t border-white/15 flex items-end justify-between gap-2">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-tertiary-container font-bold block">
                  Final Order Total (કુલ રકમ)
                </span>
                <span className="text-xs text-white/80">
                  {hasSupari ? `Supari (₹${calculatedSupariPrice.toLocaleString("en-IN")})` : ""}
                  {hasSupari && selectedSuppliesList.length > 0 ? " + " : ""}
                  {selectedSuppliesList.length > 0
                    ? `Supplies (₹${suppliesTotalPrice.toLocaleString("en-IN")})`
                    : ""}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#55f28c] tracking-tight drop-shadow-xs">
                  ₹{finalGrandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-on-primary/70 italic pt-1">
              * Wholesale rates directly from Rajkot Mandi. Final stock confirmation &amp; transport details on WhatsApp.
            </p>
          </div>

          {/* Bottom Error Banner: Immediately visible when user clicks submit at the bottom */}
          {errorMessage && (
            <div
              onClick={() => scrollToField(errorTarget)}
              className="bg-red-500/10 border-2 border-red-500 text-red-700 dark:text-red-400 p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer animate-shake shadow-xs hover:bg-red-500/15 transition-all"
              role="alert"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-red-600 text-2xl shrink-0">error</span>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-red-700 leading-tight">
                    {errorMessage}
                  </div>
                  <div className="text-[11px] text-red-600 font-medium mt-0.5">
                    {errorTarget === "phone"
                      ? "Tap here to correct mobile number (નંબર સુધારવા અહીં ક્લિક કરો)"
                      : errorTarget === "name"
                      ? "Tap here to enter your name (નામ દાખલ કરવા અહીં ક્લિક કરો)"
                      : "Tap here to choose products (સોપારી પસંદ કરવા અહીં ક્લિક કરો)"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToField(errorTarget);
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <span>Fix Now</span>
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              disabled={!hasSupari && selectedSuppliesList.length === 0}
              className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                chat
              </span>
              <span>
                Send Order on WhatsApp • ₹{finalGrandTotal.toLocaleString("en-IN")}
              </span>
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
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 soft-shadow hover:border-secondary/40 hover:shadow-md transition-all">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
          </div>
          <span className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            ₹{item.price} / {item.unit}
          </span>
        </div>

        <h4 className="font-title-md text-base sm:text-lg text-on-surface font-bold leading-tight">
          {item.title}
        </h4>
        <p className="text-xs font-semibold text-tertiary mt-0.5">
          {item.gujaratiTitle}
        </p>
        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
          {item.subtitle}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2">
        <div>
          <span className="block text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
            Wholesale Price
          </span>
          <span className="text-xl font-extrabold text-secondary">
            ₹{item.price}
            <span className="text-xs font-normal text-on-surface-variant ml-1">
              /{item.unit}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenOrder(null, item.id)}
          className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs hover:shadow transition-all font-semibold text-xs cursor-pointer group"
          title={`Order ${item.title} on WhatsApp`}
        >
          <span className="material-symbols-outlined text-white text-base transition-transform group-hover:scale-110">
            chat
          </span>
          <span>Order / Calc</span>
        </button>
      </div>
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
              One-Stop Paan Shop Supplies • અન્ય સામગ્રી
            </span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl text-primary font-bold">
              Essential Paan Supplies &amp; Prices
            </h2>
            <p className="text-base text-on-surface-variant mt-1 max-w-2xl">
              138 Tobacco, Edible Limestone (Chuna), Packaging Plastics, and Elastic Rubber Bands with live instant price calculation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenOrder(null, "tobacco-138")}
            className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
            <span>Order Paan Supplies</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PAAN_SUPPLIES.map((item) => (
            <InventoryItem key={item.id} item={item} onOpenOrder={onOpenOrder} />
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
  const [modalInitialSupplyId, setModalInitialSupplyId] = useState(null);

  const handleOpenOrder = (product = null, supplyId = null) => {
    setModalInitialProduct(product);
    setModalInitialSupplyId(supplyId);
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
          key={`${modalInitialProduct?.id || "product"}-${modalInitialSupplyId || "supply"}`}
          isOpen={isOrderModalOpen}
          onClose={handleCloseOrder}
          initialProduct={modalInitialProduct}
          initialSupplyId={modalInitialSupplyId}
        />
      )}
    </div>
  );
}
