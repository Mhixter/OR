import {
  ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Bell, BookOpen,
  BriefcaseBusiness, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp,
  Clock3, Copy, CreditCard, Download, Eye, FileCheck2, Filter, Gift, Grid2X2, Home, LayoutDashboard,
  LoaderCircle, LockKeyhole, LogOut, MoreHorizontal, QrCode, ReceiptText,
  Pencil, ScanLine, Search, Send, Settings2, ShieldCheck, ShoppingBag, ShoppingCart, Smartphone, Store, UserRound,
  UsersRound, WalletCards, WalletMinimal, X, Zap,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import orangeLogoAsset from "../attached_assets/image_1787793543086.png";

const navItems = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "collections", label: "Collections", icon: ArrowDownLeft },
  { id: "transfers", label: "Transfers", icon: ArrowUpRight },
  { id: "qr", label: "QR payments", icon: QrCode },
  { id: "register", label: "Cash register", icon: WalletMinimal },
  { id: "revenue", label: "Revenue", icon: BarChart3 },
  { id: "activity", label: "Activity", icon: Clock3 },
  { id: "verify", label: "Scan & verify", icon: ScanLine },
];

const formatNumber = (value) => new Intl.NumberFormat("fr-FR").format(Number(value || 0));
const normalizePhone = (value) => String(value || "").replace(/\D/g, "");
const isValidAmount = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
const isValidPhone = (value) => /^\d{8}$/.test(normalizePhone(value));
const merchantAccount = {
  name: "Sahel Market",
  number: "713034670",
  displayNumber: "713 034 670",
  balance: 348500,
};
const merchantQrPayload = `orange-money://merchant?account=${merchantAccount.number}&name=${encodeURIComponent(merchantAccount.name)}`;
const formatAccountNumber = (value) => String(value || "").replace(/(\d{3})(?=\d)/g, "$1 ").trim();
const formatTransactionDate = (date) => date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
const currentMonthTransactionDate = (day, hour, minute) => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return new Date(now.getFullYear(), now.getMonth(), Math.min(day, lastDay), hour, minute);
};
const makeCurrentMonthTransaction = ({ day, hour, minute, name, type, amount, reference, icon, tone = "success", details = {} }) => {
  const date = currentMonthTransactionDate(day, hour, minute);
  return {
    id: reference,
    name,
    type,
    amount: `${amount < 0 ? "−" : "+"} ${formatNumber(Math.abs(amount))}`,
    amountValue: amount,
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: formatTransactionDate(date),
    timestamp: date.getTime(),
    status: "Current-month history",
    tone,
    channel: "Merchant account",
    reference,
    isIllustrative: true,
    details: { "Account number": merchantAccount.displayNumber, ...details },
    icon,
  };
};
const currentMonthHistory = [
  makeCurrentMonthTransaction({ day: 5, hour: 9, minute: 18, name: "Mariam Ouédraogo", type: "QR payment", amount: 18500, reference: "OM-PAY-260805", icon: QrCode, details: { "Payment method": "Merchant QR" } }),
  makeCurrentMonthTransaction({ day: 11, hour: 13, minute: 42, name: "Issouf Kaboré", type: "Collection", amount: 42000, reference: "OM-COL-260811", icon: ArrowDownLeft, details: { "Payment method": "Merchant collection" } }),
  makeCurrentMonthTransaction({ day: 18, hour: 15, minute: 6, name: "Airtel distribution", type: "Transfer", amount: -200000, reference: "OM-TRF-260818", icon: ArrowUpRight, tone: "neutral", details: { "Beneficiary account": "75318231" } }),
  makeCurrentMonthTransaction({ day: 24, hour: 10, minute: 27, name: "Sahel Market", type: "Purchase payment", amount: -7500, reference: "OM-PAY-260824", icon: ShoppingCart, tone: "neutral", details: { "Payment method": "Merchant account" } }),
  makeCurrentMonthTransaction({ day: 27, hour: 17, minute: 12, name: "Mariam Ouédraogo", type: "QR payment", amount: 27500, reference: "OM-PAY-260827", icon: QrCode, details: { "Payment method": "Merchant QR" } }),
  makeCurrentMonthTransaction({ day: 1, hour: 8, minute: 15, name: "Binta Traoré", type: "Collection", amount: 12500, reference: "OM-COL-260801", icon: ArrowDownLeft, details: { "Payment method": "Merchant collection" } }),
  makeCurrentMonthTransaction({ day: 2, hour: 11, minute: 40, name: "Awa Kaboré", type: "QR payment", amount: 9800, reference: "OM-PAY-260802", icon: QrCode, details: { "Payment method": "Merchant QR" } }),
  makeCurrentMonthTransaction({ day: 3, hour: 14, minute: 22, name: "Ouaga Café", type: "Purchase payment", amount: -6300, reference: "OM-PAY-260803", icon: ShoppingCart, tone: "neutral", details: { "Payment method": "Merchant account" } }),
  makeCurrentMonthTransaction({ day: 4, hour: 16, minute: 50, name: "Issa Yaméogo", type: "Collection", amount: 27500, reference: "OM-COL-260804", icon: ArrowDownLeft, details: { "Payment method": "Merchant collection" } }),
  makeCurrentMonthTransaction({ day: 7, hour: 9, minute: 5, name: "Boutique Wendpanga", type: "QR payment", amount: 15000, reference: "OM-PAY-260807", icon: QrCode, details: { "Payment method": "Merchant QR" } }),
  makeCurrentMonthTransaction({ day: 8, hour: 12, minute: 18, name: "Orange distribution", type: "Transfer", amount: -85000, reference: "OM-TRF-260808", icon: ArrowUpRight, tone: "neutral", details: { "Beneficiary account": "75264018" } }),
  makeCurrentMonthTransaction({ day: 9, hour: 10, minute: 32, name: "Fatoumata Diallo", type: "Collection", amount: 32100, reference: "OM-COL-260809", icon: ArrowDownLeft, details: { "Payment method": "Merchant collection" } }),
  makeCurrentMonthTransaction({ day: 10, hour: 18, minute: 6, name: "Sahel Market", type: "Purchase payment", amount: -12400, reference: "OM-PAY-260810", icon: ShoppingCart, tone: "neutral", details: { "Payment method": "Merchant account" } }),
  makeCurrentMonthTransaction({ day: 12, hour: 8, minute: 46, name: "Mariam Ouédraogo", type: "QR payment", amount: 22000, reference: "OM-PAY-260812", icon: QrCode, details: { "Payment method": "Merchant QR" } }),
  makeCurrentMonthTransaction({ day: 13, hour: 13, minute: 15, name: "Koudougou Supplies", type: "Collection", amount: 48750, reference: "OM-COL-260813", icon: ArrowDownLeft, details: { "Payment method": "Merchant collection" } }),
  makeCurrentMonthTransaction({ day: 14, hour: 15, minute: 44, name: "Issouf Kaboré", type: "Transfer", amount: -120000, reference: "OM-TRF-260814", icon: ArrowUpRight, tone: "neutral", details: { "Beneficiary account": "70118452" } }),
  makeCurrentMonthTransaction({ day: 15, hour: 9, minute: 27, name: "Bobo Fresh", type: "QR payment", amount: 7600, reference: "OM-PAY-260815", icon: QrCode, details: { "Payment method": "Merchant QR" } }),
  makeCurrentMonthTransaction({ day: 16, hour: 17, minute: 38, name: "Airtel distribution", type: "Transfer", amount: -65000, reference: "OM-TRF-260816", icon: ArrowUpRight, tone: "neutral", details: { "Beneficiary account": "75318231" } }),
  makeCurrentMonthTransaction({ day: 17, hour: 11, minute: 11, name: "Nadia Sawadogo", type: "Collection", amount: 18300, reference: "OM-COL-260817", icon: ArrowDownLeft, details: { "Payment method": "Merchant collection" } }),
  makeCurrentMonthTransaction({ day: 19, hour: 14, minute: 5, name: "Sahel Market", type: "Purchase payment", amount: -8900, reference: "OM-PAY-260819", icon: ShoppingCart, tone: "neutral", details: { "Payment method": "Merchant account" } }),
  makeCurrentMonthTransaction({ day: 20, hour: 10, minute: 20, name: "Mariam Ouédraogo", type: "QR payment", amount: 31500, reference: "OM-PAY-260820", icon: QrCode, details: { "Payment method": "Merchant QR" } }),
  makeCurrentMonthTransaction({ day: 21, hour: 16, minute: 12, name: "Wend-Kuni Services", type: "Collection", amount: 26700, reference: "OM-COL-260821", icon: ArrowDownLeft, details: { "Payment method": "Merchant collection" } }),
  makeCurrentMonthTransaction({ day: 22, hour: 9, minute: 54, name: "Awa Kaboré", type: "QR payment", amount: 11400, reference: "OM-PAY-260822", icon: QrCode, details: { "Payment method": "Merchant QR" } }),
  makeCurrentMonthTransaction({ day: 23, hour: 12, minute: 41, name: "Issouf Kaboré", type: "Collection", amount: 52000, reference: "OM-COL-260823", icon: ArrowDownLeft, details: { "Payment method": "Merchant collection" } }),
  makeCurrentMonthTransaction({ day: 26, hour: 18, minute: 25, name: "Orange distribution", type: "Transfer", amount: -95000, reference: "OM-TRF-260826", icon: ArrowUpRight, tone: "neutral", details: { "Beneficiary account": "75264018" } }),
];
const transactions = currentMonthHistory;
const activityEvents = [];
const mergeTransactions = (savedTransactions) => [...savedTransactions, ...currentMonthHistory].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
const persistEvent = async ({ eventType, viewId, payload = {} }) => {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, viewId, payload }),
  });
  if (!response.ok) throw new Error(`Event save failed with status ${response.status}`);
  return response.json();
};

const persistSetting = async (key, value) => {
  const response = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!response.ok) throw new Error(`Setting save failed with status ${response.status}`);
  return response.json();
};

const localWorkflowConfigs = {
  transfers: {
    title: "Transfer funds",
    eyebrow: "Workspace record",
    description: "Prepare a transfer record with a review step.",
    recordType: "Transfer",
    icon: ArrowUpRight,
    fields: [
      { name: "beneficiary", label: "Beneficiary", type: "text", placeholder: "Name or phone number" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
      { name: "note", label: "Reference", type: "text", placeholder: "Optional reference", optional: true },
    ],
  },
  qr: {
    title: "QR payment record",
    eyebrow: "Payment record",
    description: "Record a QR payment for your own operations.",
    recordType: "QR payment",
    icon: QrCode,
    fields: [
      { name: "merchant", label: "Merchant or customer", type: "text", placeholder: "Name or store" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
      { name: "reference", label: "Reference", type: "text", placeholder: "Optional reference", optional: true },
    ],
  },
  register: {
    title: "Cash register entry",
    eyebrow: "Daily operations",
    description: "Save a cash movement entry with an auditable review step.",
    recordType: "Register entry",
    icon: WalletMinimal,
    fields: [
      { name: "movement", label: "Movement type", type: "select", options: ["Cash in", "Cash out"] },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
      { name: "note", label: "Reason or reference", type: "text", placeholder: "Optional note", optional: true },
    ],
  },
  revenue: {
    title: "Revenue entry",
    eyebrow: "Business performance",
    description: "Add a revenue entry to your workspace report.",
    recordType: "Revenue entry",
    icon: BarChart3,
    fields: [
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
      { name: "source", label: "Revenue source", type: "text", placeholder: "e.g. Counter sale" },
      { name: "note", label: "Reference", type: "text", placeholder: "Optional note", optional: true },
    ],
  },
  verify: {
    title: "Payment verification record",
    eyebrow: "Payment verification",
    description: "Record a reference you checked.",
    recordType: "Verification",
    icon: ScanLine,
    fields: [
      { name: "reference", label: "Transaction reference", type: "text", placeholder: "Enter the reference" },
      { name: "amount", label: "Amount shown", type: "amount", placeholder: "0" },
      { name: "note", label: "Verification note", type: "text", placeholder: "Optional note", optional: true },
    ],
  },
  "orange-send-money": {
    title: "Send money",
    eyebrow: "Wallet record",
    description: "Prepare a send-money record without contacting a wallet provider.",
    recordType: "Send money",
    icon: Send,
    fields: [
      { name: "phone", label: "Recipient phone number", type: "phone", placeholder: "70 00 00 00" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
      { name: "note", label: "Reason", type: "text", placeholder: "Optional reason", optional: true },
    ],
  },
  "orange-withdraw-money": {
    title: "Withdraw money",
    eyebrow: "Wallet record",
    description: "Prepare a withdrawal record without contacting a wallet provider.",
    recordType: "Withdrawal",
    icon: ArrowDownLeft,
    fields: [
      { name: "location", label: "Withdrawal point", type: "select", options: ["Ouagadougou · Patte d’Oie", "Ouagadougou · 1200 Logements", "Bobo-Dioulasso · Centre"] },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
      { name: "note", label: "Reference", type: "text", placeholder: "Optional reference", optional: true },
    ],
  },
  "orange-pay-purchases": {
    title: "Purchase payment",
    eyebrow: "Wallet record",
    description: "Prepare a purchase record without charging a wallet.",
    recordType: "Purchase payment",
    icon: ShoppingCart,
    fields: [
      { name: "merchant", label: "Merchant or store", type: "text", placeholder: "e.g. Sahel Market" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
      { name: "note", label: "Order reference", type: "text", placeholder: "Optional reference", optional: true },
    ],
  },
  "orange-buy-credit": {
    title: "Buy credit",
    eyebrow: "Wallet record",
    description: "Prepare an airtime record without topping up a phone.",
    recordType: "Airtime top up",
    icon: Smartphone,
    fields: [
      { name: "phone", label: "Phone number to top up", type: "phone", placeholder: "70 00 00 00" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
      { name: "note", label: "Bundle", type: "text", placeholder: "Optional bundle name", optional: true },
    ],
  },
  "orange-virtual-card": {
    title: "Virtual card record",
    eyebrow: "Wallet record",
    description: "Save a card request for reference.",
    recordType: "Virtual card",
    icon: CreditCard,
    fields: [
      { name: "nickname", label: "Card nickname", type: "text", placeholder: "e.g. Online shopping" },
    ],
  },
};

const serviceFields = {
  "orange-service-loyalty": [],
  "orange-service-manage-money": [
    { name: "destination", label: "Destination account", type: "select", options: ["Savings account", "Primary account", "Family account"] },
    { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
  ],
  "orange-service-boost": [],
  "orange-service-loans": [
    { name: "amount", label: "Requested amount", type: "amount", placeholder: "0" },
    { name: "term", label: "Repayment period", type: "select", options: ["7 days", "14 days", "30 days"] },
  ],
  "orange-service-bills": [
    { name: "biller", label: "Bill provider", type: "select", options: ["ONEA water", "SONABEL electricity", "Canal+"] },
    { name: "customer", label: "Customer or contract number", type: "text", placeholder: "Enter the number" },
    { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
  ],
  "orange-service-airtime": [
    { name: "phone", label: "Phone number to top up", type: "phone", placeholder: "70 00 00 00" },
    { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
  ],
  "orange-service-data": [
    { name: "phone", label: "Phone number to top up", type: "phone", placeholder: "70 00 00 00" },
    { name: "bundle", label: "Choose a bundle", type: "select", options: ["500 MB · 500 FCFA", "2 GB · 2,000 FCFA", "5 GB · 5,000 FCFA"] },
  ],
  "orange-service-tv": [
    { name: "provider", label: "Provider", type: "select", options: ["Canal+", "Orange Internet", "A+"] },
    { name: "customer", label: "Subscriber number", type: "text", placeholder: "Enter the subscriber number" },
    { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
  ],
  "orange-service-school": [
    { name: "student", label: "Student reference", type: "text", placeholder: "Enter the student reference" },
    { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
  ],
  "orange-service-insurance": [
    { name: "plan", label: "Choose a plan", type: "select", options: ["Mobile protection", "Family cover", "Travel cover"] },
  ],
};

const localTransactionFromEvent = (event) => {
  const payload = event.payload || {};
  const flowId = payload.flowId || event.view_id;
  const config = localWorkflowConfigs[flowId];
  const title = payload.title || config?.title || payload.service || (flowId === "deposit-local" ? "Deposit" : "Workspace record");
  const recordType = payload.recordType || (flowId === "deposit-local" ? "Deposit" : title);
  const isOutflow = ["Transfer", "Withdrawal", "Purchase payment", "Airtime top up"].includes(recordType) || ["transfer", "orange-send-money", "orange-withdraw-money", "orange-pay-purchases", "orange-buy-credit"].includes(flowId);
  const amountNumber = Number(payload.amount || payload.fields?.amount || 0);
  const storedReference = payload.reference || `LOCAL-${event.id}`;
  const reference = storedReference.replace(/^LOCAL-/i, "REC-");
  const timestamp = new Date(event.created_at).getTime();
  return {
    id: reference,
    name: payload.beneficiary || payload.merchant || payload.phone || payload.fields?.beneficiary || title,
    type: recordType,
    amount: `${isOutflow ? "−" : "+"} ${formatNumber(amountNumber)}`,
    time: new Date(event.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: formatTransactionDate(new Date(event.created_at)),
    timestamp,
    status: payload.status === "Saved locally" ? "Saved" : (payload.status || "Saved"),
    tone: isOutflow ? "neutral" : "success",
    channel: payload.channel || "Merchant workspace",
    reference,
    isIllustrative: false,
    details: {
      "Account number": formatAccountNumber(payload.accountNumber || merchantAccount.number),
      ...(payload.source ? { "Source account": payload.source } : {}),
      ...(payload.phone ? { "Phone number": `+226 ${payload.phone}` } : {}),
      ...(payload.fields?.phone ? { "Phone number": `+226 ${payload.fields.phone}` } : {}),
      ...(payload.note ? { Reference: payload.note } : {}),
    },
    icon: config?.icon || ReceiptText,
  };
};

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const record = (eventType, viewId, payload) => {
    persistEvent({ eventType, viewId, payload }).catch((error) => console.error(error));
  };
  const showToast = (message, event = {}) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
    record(event.type || "ui_action", activeView, { message, ...(event.payload || {}) });
  };
  const goTo = (view) => {
    record("navigation", view, { from: activeView });
    setActiveView(view);
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
  };
  const openTransaction = (transaction) => {
    setSelectedTransaction({ ...transaction, origin: activeView });
    goTo("transaction-detail");
  };
  const isOrangeExperience = activeView === "orange-money" || activeView === "services" || activeView.startsWith("orange-");

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} goTo={goTo} showToast={showToast} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main className={`main-shell ${activeView === "dashboard" ? "dashboard-shell" : ""} ${isOrangeExperience ? "orange-money-shell" : ""}`}>
        <Topbar activeView={activeView} onMenu={() => setMobileMenuOpen((open) => !open)}
          profileOpen={profileOpen} setProfileOpen={setProfileOpen}
          notificationsOpen={notificationsOpen} setNotificationsOpen={setNotificationsOpen} goTo={goTo} showToast={showToast} />
        <div className="main-content">
          <ViewRenderer activeView={activeView} goTo={goTo} showToast={showToast} openTransaction={openTransaction} selectedTransaction={selectedTransaction} />
        </div>
      </main>
      <MobileNav activeView={activeView} goTo={goTo} />
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function Sidebar({ activeView, goTo, showToast, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <>
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <OrangeLogo />
          <div><strong>orange</strong><span className="brand-word">money</span><small>Merchant workspace</small></div>
          <button className="sidebar-close mobile-only" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
          <button className="sidebar-account" onClick={() => showToast("A live merchant account is required")} aria-label="Open business account switcher">
          <div className="account-avatar">M</div>
          <div><span>Merchant account</span><small>Account preview</small></div><ChevronDown size={16} />
        </button>
        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.slice(0, 6).map((item) => <NavItem key={item.id} item={item} activeView={activeView} goTo={goTo} />)}
          <p className="nav-label nav-label-spaced">Manage</p>
          {navItems.slice(6).map((item) => <NavItem key={item.id} item={item} activeView={activeView} goTo={goTo} />)}
        </nav>
        <div className="sidebar-bottom">
          <button className="sidebar-link" onClick={() => goTo("profile")}><Settings2 size={18} /><span>Settings</span></button>
          <button className="sidebar-help" onClick={() => showToast("Support center opened")}><CircleHelp size={17} /><div><strong>Need help?</strong><span>Visit support center</span></div><ChevronRight size={15} /></button>
          <div className="sidebar-footer">© 2024 Orange Money Pay <span>·</span> v2.9.1</div>
        </div>
      </aside>
      {mobileMenuOpen && <button className="mobile-scrim" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" />}
    </>
  );
}

function NavItem({ item, activeView, goTo }) {
  const Icon = item.icon;
  return <button className={`nav-item ${activeView === item.id ? "active" : ""}`} onClick={() => goTo(item.id)}>
    <Icon size={18} strokeWidth={activeView === item.id ? 2.4 : 1.9} /><span>{item.label}</span>
  </button>;
}

function Topbar({ activeView, onMenu, profileOpen, setProfileOpen, notificationsOpen, setNotificationsOpen, goTo, showToast }) {
  const [notificationCount] = useState(0);
  const orangeTitles = { "orange-send-money": "Send money", "orange-withdraw-money": "Withdraw money", "orange-pay-purchases": "Pay for purchases", "orange-buy-credit": "Buy credit", "orange-virtual-card": "Virtual card", "orange-card-receipt": "Receipt", services: "Services" };
  const title = activeView === "dashboard" ? "Overview" : activeView === "orange-money" ? "Orange Money" : orangeTitles[activeView] || orangeServiceConfigs[activeView]?.title || navItems.find((item) => item.id === activeView)?.label || "Settings";
  const isOrangeExperience = activeView === "orange-money" || activeView === "services" || activeView.startsWith("orange-");
  const displayedNotificationCount = isOrangeExperience && notificationCount > 0 ? 11 : notificationCount;
  return (
    <header className={`topbar ${activeView === "dashboard" ? "dashboard-topbar" : ""} ${isOrangeExperience ? "orange-money-topbar" : ""}`}>
      <div className="topbar-title"><button className="menu-trigger mobile-only" onClick={onMenu} aria-label="Open navigation"><Grid2X2 size={20} /></button><div className="mobile-topbar-brand mobile-only" aria-label="Merchant workspace"><OrangeLogo /></div>
        <div className="topbar-heading"><span className="eyebrow">Merchant workspace</span><h1>{title}</h1></div></div>
      <div className="topbar-actions">
        <button className="icon-button mobile-only" onClick={() => goTo("activity")} aria-label="Search activity"><Search size={18} /></button>
        <button className={`icon-button ${notificationsOpen ? "selected" : ""}`} onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false); }} aria-label={`Notifications${displayedNotificationCount ? `, ${displayedNotificationCount} unread` : ""}`}><Bell size={19} />{displayedNotificationCount > 0 && <span className="notification-badge">{displayedNotificationCount}</span>}</button>
        <button className="icon-button mobile-only" onClick={() => showToast("Help center opened")} aria-label="Help"><CircleHelp size={18} /></button>
        <div className="profile-wrap">
          <button className="profile-button" onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false); }} aria-expanded={profileOpen}><span className="profile-avatar"><UserRound className="mobile-avatar-icon" size={20} /><span className="profile-initials">M</span></span><span className="profile-name">Merchant</span><ChevronDown size={15} /></button>
          {profileOpen && <div className="popover profile-popover">
            <div className="popover-user"><div className="profile-avatar large">M</div><div><strong>Merchant profile</strong><span>Account preview</span></div></div>
            <button onClick={() => goTo("profile")}><UserRound size={16} /> My profile</button><button onClick={() => goTo("profile")}><Settings2 size={16} /> Settings</button>
            <div className="popover-divider" /><button className="danger-text" onClick={() => { setProfileOpen(false); showToast("Sign out is unavailable until authentication is configured"); }}><LogOut size={16} /> Sign out</button>
          </div>}
        </div>
        {notificationsOpen && <div className="popover notification-popover">
           <div className="popover-heading"><strong>Notifications</strong></div>
           <div className="notification-empty"><CircleHelp size={16} /><span>No new notifications.</span></div>
        </div>}
      </div>
    </header>
  );
}

function MobileNav({ activeView, goTo }) {
  const items = [
    { id: "dashboard", label: "Home", icon: Home }, { id: "orange-money", label: "Orange Money", logo: true },
    { id: "profile", label: "My line", icon: UserRound }, { id: "qr", label: "Marketplace", icon: ShoppingBag },
  ];
  const orangeMoneyActive = activeView === "orange-money" || activeView === "services" || activeView.startsWith("orange-");
  return <nav className="mobile-nav mobile-only" aria-label="Mobile navigation">{items.map((item) => { const Icon = item.icon; const itemActive = item.id === "orange-money" ? orangeMoneyActive : activeView === item.id; return <button key={item.id} className={itemActive ? "active" : ""} onClick={() => goTo(item.id)} aria-label={item.label}>{item.logo ? <OrangeQrLogo /> : <Icon size={20} />}<span>{item.label}</span></button>; })}</nav>;
}

function ViewRenderer({ activeView, goTo, showToast, openTransaction, selectedTransaction }) {
  switch (activeView) {
    case "orange-money": return <OrangeMoneyView goTo={goTo} showToast={showToast} />;
    case "orange-send-money":
    case "orange-withdraw-money":
    case "orange-pay-purchases":
    case "orange-buy-credit":
    case "orange-virtual-card":
      return <LocalWorkflowView flowId={activeView} goTo={goTo} showToast={showToast} openTransaction={openTransaction} />;
    case "orange-card-receipt": return <LocalReceiptsView goTo={goTo} showToast={showToast} openTransaction={openTransaction} />;
    case "services": return <LocalServicesView goTo={goTo} />;
    case "orange-service-loyalty":
    case "orange-service-manage-money":
    case "orange-service-boost":
    case "orange-service-loans":
    case "orange-service-bills":
    case "orange-service-airtime":
    case "orange-service-data":
    case "orange-service-tv":
    case "orange-service-school":
    case "orange-service-insurance":
      return <LocalWorkflowView flowId={activeView} goTo={goTo} showToast={showToast} openTransaction={openTransaction} />;
    case "collections": return <CollectionsView showToast={showToast} openTransaction={openTransaction} />;
    case "transfers":
    case "qr":
    case "register":
    case "revenue":
      return <LocalWorkflowView flowId={activeView} goTo={goTo} showToast={showToast} openTransaction={openTransaction} />;
    case "activity": return <ActivityView showToast={showToast} openTransaction={openTransaction} />;
    case "verify": return <LocalWorkflowView flowId="verify" goTo={goTo} showToast={showToast} openTransaction={openTransaction} />;
    case "profile": return <ProfileView showToast={showToast} />;
    case "transaction-detail": return <TransactionDetailView transaction={selectedTransaction} goTo={goTo} showToast={showToast} />;
    default: return <Dashboard goTo={goTo} showToast={showToast} openTransaction={openTransaction} />;
  }
}

function UnavailableState({ title, description, action, onAction }) {
  return <div className="standard-view"><div className="panel empty-state unavailable-state"><span className="empty-icon"><CircleHelp size={22} /></span><span className="eyebrow">Workspace tools</span><h3>{title}</h3><p>{description}</p>{action && <button className="primary-button" onClick={onAction}>{action}<ArrowRight size={15} /></button>}</div></div>;
}

function getLocalWorkflowConfig(flowId) {
  if (localWorkflowConfigs[flowId]) return localWorkflowConfigs[flowId];
  const service = orangeServiceConfigs[flowId];
  if (!service) return null;
  return {
    title: service.title,
    eyebrow: service.eyebrow,
    description: service.description,
    recordType: "Service record",
    icon: service.icon,
    fields: serviceFields[flowId] || [],
  };
}

function LocalWorkflowView({ flowId, goTo, showToast, openTransaction }) {
  const config = getLocalWorkflowConfig(flowId);
  const [step, setStep] = useState("form");
  const [values, setValues] = useState({});
  const [formMessage, setFormMessage] = useState("");
  const [savedTransaction, setSavedTransaction] = useState(null);

  if (!config) return <UnavailableState title="Workspace action unavailable" description="This action is not configured for workspace records." />;

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setFormMessage("");
  };
  const reset = () => {
    setStep("form");
    setValues({});
    setFormMessage("");
    setSavedTransaction(null);
  };
  const validate = () => {
    const missing = config.fields.find((field) => {
      const value = String(values[field.name] || "").trim();
      if (!value && !field.optional) return true;
      if (field.type === "phone" && value && !isValidPhone(value)) return true;
      if (field.type === "amount" && value && !isValidAmount(value)) return true;
      return false;
    });
    if (!missing) return true;
    if (missing.type === "phone") setFormMessage("Enter an 8-digit Burkina Faso phone number.");
    else if (missing.type === "amount") setFormMessage("Enter an amount greater than 0.");
    else setFormMessage(`Complete ${missing.label.toLowerCase()}.`);
    return false;
  };
  const review = () => {
    if (validate()) setStep("review");
  };
  const confirm = async () => {
    setStep("saving");
    const reference = `LOCAL-${Date.now().toString().slice(-8)}`;
    const payload = {
      flowId,
      recordType: config.recordType,
      title: config.title,
      reference,
      amount: values.amount || null,
      phone: values.phone || null,
      merchant: values.merchant || null,
      beneficiary: values.beneficiary || null,
      accountNumber: merchantAccount.number,
      note: values.note || null,
      fields: values,
      status: "Saved locally",
    };
    try {
      await persistEvent({ eventType: "local_record_saved", viewId: flowId, payload });
      const transaction = localTransactionFromEvent({ id: reference, view_id: flowId, payload, created_at: new Date().toISOString() });
      setSavedTransaction(transaction);
      setStep("success");
      showToast(`${config.title} saved to the workspace`);
    } catch (error) {
      console.error(error);
      setFormMessage("This record could not be saved. Try again.");
      setStep("review");
    }
  };
  const displayValue = (field) => {
    const value = values[field.name] || "";
    if (field.type === "amount") return `${formatNumber(value)} FCFA`;
    if (field.type === "phone") return `+226 ${value}`;
    return value;
  };
  const Icon = config.icon || ReceiptText;

  return <div className="flow-view">
    <PageIntro eyebrow={config.eyebrow} title={config.title} description={config.description} action={<button className="soft-button" onClick={reset}><ReceiptText size={16} /> New record</button>} />
    <FlowSteps active={step === "form" ? 0 : step === "review" ? 1 : 2} labels={["Details", "Review", "Saved"]} />
    {step === "saving" && <ProcessingState label="Saving workspace record" detail="Writing this record to the workspace." />}
    {step === "success" && <div className="panel state-panel success-panel"><span className="state-symbol success-symbol"><Check size={30} /></span><span className="eyebrow">Record saved</span><h3>{config.title} is ready</h3><p>No provider was contacted and no real funds were moved.</p><div className="success-receipt"><div><span>Type</span><strong>{config.recordType}</strong></div><div><span>Status</span><strong>Saved</strong></div><div><span>Reference</span><strong>{savedTransaction?.reference}</strong></div></div><div className="review-actions"><button className="outline-button" onClick={reset}>Make another record</button><button className="primary-button" onClick={() => savedTransaction && openTransaction(savedTransaction)}><ReceiptText size={16} /> View details</button></div></div>}
    {step === "review" && <div className="panel review-panel"><div className="review-icon orange-bg"><Icon size={24} /></div><span className="eyebrow">Review record</span><h3>Check before saving</h3><p className="review-lead">This creates a factual workspace record. It does not contact a payment provider.</p><div className="review-amount">{values.amount ? formatNumber(values.amount) : "—"} <small>{values.amount ? "FCFA" : "No amount"}</small></div><div className="detail-list">{config.fields.map((field) => <div key={field.name}><span>{field.label}</span><strong>{displayValue(field) || "Not provided"}</strong></div>)}</div>{formMessage && <p className="form-error" role="alert">{formMessage}</p>}<div className="review-actions"><button className="outline-button" onClick={() => setStep("form")}><ArrowLeft size={16} /> Edit details</button><button className="primary-button" onClick={confirm}>Save record <ArrowRight size={16} /></button></div></div>}
    {step === "form" && <div className="flow-grid"><div className="panel form-panel"><div className="panel-header"><div><span className="eyebrow">Step 1 of 2</span><h3>Record details</h3></div><span className="required-note">Required fields are marked *</span></div>{config.fields.length ? config.fields.map((field) => <label className="field-label" key={field.name} htmlFor={`local-${flowId}-${field.name}`}>{field.label} {!field.optional && <span>*</span>}{field.optional && <small>Optional</small>}{field.type === "select" ? <div className="select-wrap"><select id={`local-${flowId}-${field.name}`} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)}><option value="">Choose an option</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={16} /></div> : field.type === "amount" ? <div className="input-with-suffix"><input id={`local-${flowId}-${field.name}`} type="number" inputMode="decimal" min="1" placeholder={field.placeholder} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)} /><span>FCFA</span></div> : field.type === "phone" ? <div className="input-with-prefix"><span>+226</span><input id={`local-${flowId}-${field.name}`} type="tel" inputMode="tel" placeholder={field.placeholder} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, normalizePhone(event.target.value).slice(0, 8))} /></div> : <input id={`local-${flowId}-${field.name}`} type="text" placeholder={field.placeholder} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)} />}</label>) : <div className="local-action-intro"><span className="info-symbol orange-bg"><Icon size={20} /></span><h3>Ready to save this record?</h3><p>Use this action to keep a clear note for your team.</p></div>}{formMessage && <p className="form-error" role="alert">{formMessage}</p>}<button className="primary-button form-submit" onClick={review}>{config.fields.length ? "Continue to review" : "Save record"} <ArrowRight size={16} /></button><p className="secure-note"><ShieldCheck size={15} /> Stored in this workspace; no provider is contacted.</p></div><div className="panel side-info-panel"><span className="info-symbol blue-bg"><ReceiptText size={19} /></span><h3>Record details</h3><ol><li><span>1</span><div><strong>Enter details</strong><p>Add the information your team needs.</p></div></li><li><span>2</span><div><strong>Review the record</strong><p>Check the values before saving.</p></div></li><li><span>3</span><div><strong>Find it in Activity</strong><p>Saved records can be opened later.</p></div></li></ol><div className="info-callout">Saved records remain available in Activity and Receipts.</div></div></div>}
  </div>;
}

function LocalServicesView({ goTo }) {
  return <div className="standard-view"><PageIntro eyebrow="Workspace tools" title="Services" description="Keep service requests and notes organized in one place." /><div className="local-services-grid">{orangeServices.map(({ label, icon: Icon, route }) => <button className="local-service-card" key={label} onClick={() => goTo(route)}><span className="info-symbol orange-bg"><Icon size={20} /></span><strong>{label}</strong><small>Save a record</small><ChevronRight size={16} /></button>)}</div></div>;
}

function LocalReceiptsView({ goTo, showToast, openTransaction }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    fetch("/api/events?limit=100").then((response) => {
      if (!response.ok) throw new Error("Receipt load failed");
      return response.json();
    }).then((data) => {
      if (mounted) setEvents((data.events || []).filter((event) => event.payload?.flowId));
    }).catch((error) => {
      console.error(error);
      if (mounted) showToast("Receipts could not be loaded");
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);
   const records = mergeTransactions(events.map((event) => localTransactionFromEvent(event)));
   return <div className="standard-view"><PageIntro eyebrow="Account history" title="Receipts" description="Review and open this month’s account records." action={<button className="outline-button" onClick={() => goTo("activity")}><Clock3 size={16} /> View activity</button>} />{loading ? <ActivitySkeleton /> : records.length ? <div className="panel receipt-list">{records.map((transaction) => <button className="history-row" key={transaction.id} onClick={() => openTransaction(transaction)}><span className="history-date"><ReceiptText size={18} /></span><div><strong>{transaction.type}</strong><p>{transaction.name} · {transaction.date}</p></div><div className="history-balance"><span>Amount</span><strong>{transaction.amount} <small>FCFA</small></strong></div><span className={`status-chip ${transaction.isIllustrative ? "neutral" : "success"}`}>{transaction.isIllustrative ? "Preview" : "Saved"}</span><ChevronRight size={16} /></button>)}</div> : <div className="panel empty-state"><span className="empty-icon"><ReceiptText size={22} /></span><h3>No account history</h3><p>Complete a workspace action to create the first record.</p><button className="primary-button" onClick={() => goTo("collections")}>Create a deposit record <ArrowRight size={15} /></button></div>}</div>;
}

function PageIntro({ eyebrow, title, description, action }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{action}</div>;
}

function LoadingSkeleton({ className = "" }) {
  return <span className={`skeleton-block ${className}`} aria-hidden="true" />;
}

function DashboardSkeleton() {
  return <div className="dashboard-view loading-view" role="status" aria-label="Loading dashboard">
    <section className="welcome-row"><div><LoadingSkeleton className="skeleton-eyebrow" /><LoadingSkeleton className="skeleton-title" /><LoadingSkeleton className="skeleton-copy" /></div><LoadingSkeleton className="skeleton-button" /></section>
    <section className="dashboard-grid"><LoadingSkeleton className="skeleton-card" /><LoadingSkeleton className="skeleton-card" /></section>
    <section className="stats-row"><LoadingSkeleton className="skeleton-stat" /><LoadingSkeleton className="skeleton-stat" /><LoadingSkeleton className="skeleton-stat" /></section>
    <section className="content-grid"><LoadingSkeleton className="skeleton-panel" /><LoadingSkeleton className="skeleton-panel" /></section>
  </div>;
}

function TransactionDetailView({ transaction, goTo, showToast }) {
  if (!transaction) {
    return <div className="standard-view"><div className="panel empty-state"><span className="empty-icon"><ReceiptText size={22} /></span><h3>Transaction not found</h3><p>Return to Activity to choose a transaction.</p><button className="primary-button" onClick={() => goTo("activity")}>Back to activity <ArrowRight size={15} /></button></div></div>;
  }
  const Icon = transaction.icon || ReceiptText;
  const isPositive = transaction.amount?.startsWith("+");
  return <div className="standard-view transaction-detail-view">
    <button className="back-link" onClick={() => goTo(transaction.origin || "activity")}><ArrowLeft size={16} /> Back to {transaction.origin === "dashboard" ? "overview" : transaction.origin === "orange-card-receipt" ? "receipt" : "activity"}</button>
    <div className="transaction-detail-header"><div><span className="eyebrow">Transaction details</span><h2>{transaction.type}</h2><p>Review the complete record for this merchant activity.</p></div></div>
    <div className="transaction-detail-grid">
      <section className="panel transaction-summary-card"><span className={`transaction-detail-icon ${transaction.tone}`}><Icon size={22} /></span><span className="eyebrow">{transaction.status}</span><h3>{transaction.name}</h3><strong className={`transaction-detail-amount ${isPositive ? "positive" : ""}`}>{transaction.amount} <small>FCFA</small></strong><span className={`status-chip ${transaction.tone}`}>{transaction.status}</span></section>
      <section className="panel transaction-information"><div className="panel-header"><div><span className="eyebrow">Receipt information</span><h3>Transaction record</h3></div><ReceiptText size={20} className="heading-icon" /></div><div className="detail-list"><div><span>Reference</span><strong>{transaction.reference || transaction.id}</strong></div><div><span>Date</span><strong>{transaction.date || transaction.time}</strong></div><div><span>Channel</span><strong>{transaction.channel || "Merchant workspace"}</strong></div><div><span>Counterparty</span><strong>{transaction.name}</strong></div>{Object.entries(transaction.details || {}).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
    </div>
  </div>;
}

function Dashboard({ goTo, showToast, openTransaction }) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [localEvents, setLocalEvents] = useState([]);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    let mounted = true;
    fetch("/api/events?limit=100").then((response) => response.ok ? response.json() : Promise.reject(new Error("Dashboard records failed")))
      .then((data) => { if (mounted) setLocalEvents((data.events || []).filter((event) => event.payload?.flowId)); })
      .catch((error) => console.error(error));
    return () => { mounted = false; };
  }, []);
  if (loading) return <DashboardSkeleton />;
  const localTransactions = localEvents.map((event) => localTransactionFromEvent(event));
  const historyTransactions = mergeTransactions(localTransactions);
  const deposits = localEvents.filter((event) => event.payload?.flowId === "deposit-local");
  const depositTotal = deposits.reduce((total, event) => total + Number(event.payload?.amount || 0), 0);
  const revenueEntries = localEvents.filter((event) => ["Revenue entry", "QR payment"].includes(event.payload?.recordType));
  const revenueTotal = revenueEntries.reduce((total, event) => total + Number(event.payload?.amount || event.payload?.fields?.amount || 0), 0);
  return <div className="dashboard-view">
    <div className="desktop-dashboard">
     <section className="welcome-row"><div><span className="eyebrow">Merchant overview</span><h2>Track your account</h2><p>Review your balance, recent payments, and this month’s activity.</p></div><button className="outline-button date-button" onClick={() => showToast("Showing this month’s activity")}><CalendarDays size={17} /> This month <ChevronDown size={15} /></button></section>
    <section className="dashboard-grid">
        <div className="balance-card"><div className="card-topline"><span>Primary account</span><button onClick={() => setBalanceVisible((visible) => !visible)}>{balanceVisible ? "Hide balance" : "Show balance"} <span className="eye-toggle">{balanceVisible ? "◉" : "○"}</span></button></div>
           <div className="balance-main"><span className="balance-amount">{balanceVisible ? formatNumber(merchantAccount.balance) : "••••••"} <small>FCFA</small></span><span className="balance-status"><span className="live-dot" /> Account preview</span></div>
           <div className="balance-meta"><span>Account number <strong>{merchantAccount.displayNumber}</strong></span><span>{historyTransactions.length} records this month</span></div>
         <div className="balance-actions"><button onClick={() => goTo("transfers")}><ArrowUpRight size={16} /> Transfer</button><button onClick={() => goTo("collections")}><ArrowDownLeft size={16} /> Deposit</button></div>
      </div>
      <div className="quick-actions-card"><div className="section-heading"><div><span className="eyebrow">Quick actions</span><h3>Move money faster</h3></div><Zap size={20} className="heading-icon" /></div>
           <div className="quick-action-grid"><button onClick={() => goTo("collections")}><span className="action-icon orange-icon"><ArrowDownLeft size={20} /></span><strong>Deposit</strong><small>Saves to workspace</small></button><button onClick={() => goTo("transfers")}><span className="action-icon blue-icon"><ArrowUpRight size={20} /></span><strong>Transfer</strong><small>Record a transfer</small></button><button onClick={() => goTo("qr")}><span className="action-icon dark-icon"><QrCode size={20} /></span><strong>My QR</strong><small>Account QR code</small></button></div>
      </div>
    </section>
      <section className="stats-row"><StatCard label="Deposits" value={formatNumber(depositTotal)} suffix="FCFA" trend={deposits.length ? `${deposits.length}` : "0"} trendText="saved records" icon={ArrowDownLeft} tone="green" /><StatCard label="Records" value={formatNumber(localTransactions.length)} suffix="" trend={localTransactions.length ? "Active" : "0"} trendText="in this workspace" icon={ReceiptText} tone="blue" /><StatCard label="Revenue entries" value={formatNumber(revenueTotal)} suffix="FCFA" trend={revenueEntries.length ? `${revenueEntries.length}` : "0"} trendText="saved records" icon={BarChart3} tone="orange" /></section>
       <section className="content-grid"><div className="panel recent-panel"><div className="panel-header"><div><span className="eyebrow">Latest activity</span><h3>Recent account history</h3></div><button className="text-button" onClick={() => goTo("activity")}>View activity <ArrowRight size={15} /></button></div><TransactionList items={historyTransactions.slice(0, 5)} compact showToast={showToast} openTransaction={openTransaction} /></div>
         <div className="panel register-summary"><div className="panel-header"><div><span className="eyebrow">Account snapshot</span><h3>Activity this month</h3></div><button className="more-button" onClick={() => goTo("activity")} aria-label="View account activity"><MoreHorizontal size={18} /></button></div><div className="register-status"><span className="status-check"><Check size={18} /></span><div><strong>{historyTransactions.length} recorded transactions</strong><p>Payments and transfers are listed in Activity.</p></div></div><div className="register-total"><span>Current account balance</span><strong>{formatNumber(merchantAccount.balance)} <small>FCFA</small></strong></div><div className="register-breakdown"><div><span>Account number</span><strong>{merchantAccount.displayNumber}</strong></div><div><span>Illustrative entries</span><strong>{currentMonthHistory.length}</strong></div></div><button className="wide-outline-button" onClick={() => goTo("activity")}>Open account history <ArrowRight size={15} /></button></div>
    </section>
    </div>
    <MobileDashboard goTo={goTo} showToast={showToast} />
  </div>;
}

function MobileDashboard({ goTo, showToast }) {
  return <div className="mobile-dashboard">
    <section className="mobile-greeting"><span>Merchant workspace</span><strong>Track your account</strong></section>
    <div className="mobile-balance-card">
      <button className="mobile-qr-thumb" onClick={() => goTo("qr")} aria-label={`Open QR payments for account ${merchantAccount.displayNumber}`}><QrGraphic payload={merchantQrPayload} /><div className="qr-center-mark orange-qr-center"><OrangeQrLogo /></div></button>
      <div className="mobile-balance-copy"><span className="mobile-balance-label"><span className="mobile-mini-mark" /> Account preview</span><span className="mobile-balance-value">{formatNumber(merchantAccount.balance)} FCFA</span><span className="mobile-transactions" onClick={() => goTo("activity")}>{currentMonthHistory.length} illustrative transactions <ChevronRight size={13} /></span></div>
      <span className="mobile-qr-caption">Account QR</span>
    </div>
     <button className="mobile-credit-row" onClick={() => goTo("activity")}><span>Account</span><span className="mobile-credit-value">{merchantAccount.displayNumber}</span><ChevronRight size={18} /></button>
    <section className="mobile-shortcuts" aria-label="Quick actions">
      <button onClick={() => goTo("collections")}><span className="mobile-shortcut-icon"><ArrowDownLeft size={20} /></span><span>Deposit</span></button>
       <button onClick={() => goTo("transfers")}><span className="mobile-shortcut-icon"><ArrowUpRight size={20} /></span><span>Transfer</span></button>
       <button onClick={() => goTo("orange-service-bills")}><span className="mobile-shortcut-icon"><ReceiptText size={20} /></span><span>Pay bills</span></button>
       <button onClick={() => goTo("orange-service-airtime")}><span className="mobile-shortcut-icon"><Smartphone size={20} /></span><span>Airtime</span></button>
    </section>
      <section className="mobile-offers panel"><span className="eyebrow">This month</span><h3>Account activity</h3><p>{currentMonthHistory.length} illustrative transactions are available in Activity.</p><button className="text-button" onClick={() => goTo("activity")}>View activity <ArrowRight size={15} /></button></section>
  </div>;
}

function OrangeMoneyView({ goTo, showToast }) {
  return <>
    <div className="desktop-orange-money-page"><CollectionsView showToast={showToast} /></div>
    <MobileOrangeMoneyPage goTo={goTo} showToast={showToast} />
  </>;
}

const orangeServices = [
  { label: "OM Loyalty", icon: Gift, route: "orange-service-loyalty", message: "OM Loyalty opened" },
  { label: "Manage money", icon: WalletCards, route: "orange-service-manage-money", message: "Manage money opened" },
  { label: "OM Boost", icon: Zap, route: "orange-service-boost", message: "OM Boost opened" },
  { label: "Loans", icon: FileCheck2, route: "orange-service-loans", message: "Loans opened" },
  { label: "Bills", icon: ReceiptText, route: "orange-service-bills", message: "Bills opened" },
  { label: "Buy airtime", icon: Smartphone, route: "orange-service-airtime", message: "Buy airtime opened" },
  { label: "Data bundles", icon: Smartphone, route: "orange-service-data", message: "Data bundles opened" },
  { label: "TV & internet", icon: WalletCards, route: "orange-service-tv", message: "TV and internet opened" },
  { label: "School fees", icon: BriefcaseBusiness, route: "orange-service-school", message: "School fees opened" },
  { label: "Insurance", icon: ShieldCheck, route: "orange-service-insurance", message: "Insurance opened" },
];

const orangeServiceConfigs = {
  "orange-service-loyalty": {
    title: "OM Loyalty",
    eyebrow: "Rewards",
    description: "Earn points and unlock more benefits with your Orange Money payments.",
    icon: Gift,
    action: "View my rewards",
    success: "Your loyalty rewards are ready to explore.",
    fields: [],
  },
  "orange-service-manage-money": {
    title: "Manage money",
    eyebrow: "Money management",
    description: "Move money between your accounts and keep control of your balance.",
    icon: WalletCards,
    action: "Continue",
    success: "Your money management request is ready in the workspace.",
    fields: [
      { name: "destination", label: "Destination account", type: "select", options: ["Savings account", "Primary account", "Family account"] },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
    ],
  },
  "orange-service-boost": {
    title: "OM Boost",
    eyebrow: "Flexible advance",
    description: "Get a quick balance boost when you need a little extra flexibility.",
    icon: Zap,
    action: "Check eligibility",
    success: "You are eligible to check an OM Boost offer in the workspace.",
    fields: [],
  },
  "orange-service-loans": {
    title: "Loans",
    eyebrow: "Borrow money",
    description: "Review an Orange Money loan request with a simple, transparent summary.",
    icon: FileCheck2,
    action: "Review loan request",
    success: "Your loan request is ready for review in the workspace.",
    fields: [
      { name: "amount", label: "Requested amount", type: "amount", placeholder: "0" },
      { name: "term", label: "Repayment period", type: "select", options: ["7 days", "14 days", "30 days"] },
    ],
  },
  "orange-service-bills": {
    title: "Bills",
    eyebrow: "Pay a bill",
    description: "Pay electricity, water, internet, and other bills from your Orange Money account.",
    icon: ReceiptText,
    action: "Review bill payment",
    success: "Your bill payment is ready for confirmation in the workspace.",
    fields: [
      { name: "biller", label: "Bill provider", type: "select", options: ["ONEA water", "SONABEL electricity", "Canal+"] },
      { name: "customer", label: "Customer or contract number", type: "text", placeholder: "Enter the number" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
    ],
  },
  "orange-service-data": {
    title: "Data bundles",
    eyebrow: "Choose your bundle",
    description: "Choose a data bundle and top up an Orange number instantly.",
    icon: Smartphone,
    action: "Review bundle",
    success: "Your data bundle purchase is ready in the workspace.",
    fields: [
      { name: "phone", label: "Phone number to top up", type: "phone", placeholder: "70 00 00 00" },
      { name: "bundle", label: "Choose a bundle", type: "select", options: ["500 MB · 500 FCFA", "2 GB · 2,000 FCFA", "5 GB · 5,000 FCFA"] },
    ],
  },
  "orange-service-airtime": {
    title: "Buy airtime",
    eyebrow: "Airtime top up",
    description: "Top up your line or another Orange number in a few simple steps.",
    icon: Smartphone,
    action: "Review airtime purchase",
    success: "Your airtime purchase is ready in the workspace.",
    fields: [
      { name: "phone", label: "Phone number to top up", type: "phone", placeholder: "70 00 00 00" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
    ],
  },
  "orange-service-tv": {
    title: "TV & internet",
    eyebrow: "Subscriptions",
    description: "Renew your TV or internet subscription without leaving your wallet.",
    icon: WalletCards,
    action: "Review subscription",
    success: "Your subscription payment is ready in the workspace.",
    fields: [
      { name: "provider", label: "Provider", type: "select", options: ["Canal+", "Orange Internet", "A+"] },
      { name: "customer", label: "Subscriber number", type: "text", placeholder: "Enter the subscriber number" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
    ],
  },
  "orange-service-school": {
    title: "School fees",
    eyebrow: "Education",
    description: "Pay school fees securely with a clear record for your family.",
    icon: BriefcaseBusiness,
    action: "Review school payment",
    success: "Your school fee payment is ready in the workspace.",
    fields: [
      { name: "student", label: "Student reference", type: "text", placeholder: "Enter the student reference" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
    ],
  },
  "orange-service-insurance": {
    title: "Insurance",
    eyebrow: "Protect what matters",
    description: "Explore simple insurance options and manage your cover from Orange Money.",
    icon: ShieldCheck,
    action: "Explore insurance",
    success: "Insurance options are ready to explore in the workspace.",
    fields: [
      { name: "plan", label: "Choose a plan", type: "select", options: ["Mobile protection", "Family cover", "Travel cover"] },
    ],
  },
};

const orangeFlowConfigs = {
  "orange-send-money": {
    title: "Send money",
    description: "Send money securely to an Orange Money number.",
    visual: "send",
    eyebrow: "Transfer money",
    primary: "Review transfer",
    phoneLabel: "Recipient phone number",
    phonePlaceholder: "70 00 00 00",
    noteLabel: "Reason",
    notePlaceholder: "e.g. Stock payment",
  },
  "orange-withdraw-money": {
    title: "Withdraw money",
    description: "Prepare a cash withdrawal from your Orange Money account.",
    visual: "withdraw",
    eyebrow: "Cash withdrawal",
    primary: "Review withdrawal",
    selectLabel: "Withdrawal point",
    noteLabel: "Reference",
    notePlaceholder: "Optional reference",
  },
  "orange-pay-purchases": {
    title: "Pay for purchases",
    description: "Pay a merchant using your Orange Money balance.",
    visual: "purchases",
    eyebrow: "Merchant payment",
    primary: "Review payment",
    merchantLabel: "Merchant or store",
    merchantPlaceholder: "e.g. Sahel Market",
    noteLabel: "Order reference",
    notePlaceholder: "e.g. Order #1042",
  },
  "orange-buy-credit": {
    title: "Buy credit",
    description: "Top up airtime for your line or another Orange number.",
    visual: "credit",
    eyebrow: "Airtime top up",
    primary: "Review purchase",
    phoneLabel: "Phone number to top up",
    phonePlaceholder: "70 00 00 00",
    noteLabel: "Bundle",
    notePlaceholder: "Optional bundle name",
  },
  "orange-virtual-card": {
    title: "Virtual card",
    description: "Create a virtual card for safer online payments.",
    visual: "card",
    eyebrow: "Digital card",
    primary: "Create virtual card",
    noteLabel: "Card nickname",
    notePlaceholder: "e.g. Online shopping",
  },
};

function OrangeMoneyFlowView({ flowId, goTo, showToast }) {
  if (flowId === "orange-virtual-card") return <OrangeMoneyVirtualCardView goTo={goTo} showToast={showToast} />;
  return <>
    <MobileOrangeMoneyFlowPage flowId={flowId} goTo={goTo} showToast={showToast} />
  </>;
}

function MobileOrangeMoneyFlowPage({ flowId, goTo, showToast }) {
  const config = orangeFlowConfigs[flowId];
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [merchant, setMerchant] = useState("");
  const [location, setLocation] = useState("Ouagadougou · Patte d’Oie");
  const [note, setNote] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const isCard = flowId === "orange-virtual-card";

  const reset = () => { setStep("form"); setAmount(""); setPhone(""); setMerchant(""); setNote(""); setFormMessage(""); };
  const handleContinue = () => {
    if (!isCard && !isValidAmount(amount)) {
      setFormMessage("Enter an amount greater than 0.");
      return;
    }
    if (config.phoneLabel && !isValidPhone(phone)) {
      setFormMessage("Enter an 8-digit Burkina Faso phone number.");
      return;
    }
    if (config.merchantLabel && !merchant.trim()) {
      setFormMessage("Enter the merchant or store name.");
      return;
    }
    setFormMessage("");
    if (isCard) setStep("success");
    else setStep("review");
  };
  const confirm = () => {
    setStep("success");
    showToast(`${config.title} saved to the workspace`, {
      type: "transaction_completed",
      payload: { flowId, amount: amount || null, phone: phone || null, merchant: merchant || null, note: note || null, location: location || null },
    });
  };

  return <div className="mobile-orange-flow-page">
    <div className="mobile-flow-header"><button onClick={() => goTo("orange-money")}><ArrowLeft size={18} /> Orange Money</button><OrangeQrLogo /></div>
    <section className="mobile-flow-title"><span className={`mobile-flow-icon flow-icon-${config.visual}`}><MobileMoneyFavoriteArt type={config.visual} /></span><div><span>{config.eyebrow}</span><h1>{config.title}</h1><p>{config.description}</p></div></section>
    <div className="mobile-flow-balance"><span><OrangeQrLogo /> Account preview</span><strong>{formatNumber(merchantAccount.balance)} <small>FCFA</small></strong></div>
        {step === "success" ? <MobileMoneyFlowSuccess config={config} amount={amount} phone={phone} merchant={merchant} reset={reset} goTo={goTo} /> : step === "review" ? <section className="mobile-flow-card"><div className="mobile-flow-card-heading"><span>Review details</span><strong>Check before confirming</strong></div><div className="mobile-flow-summary">{config.phoneLabel && <div><span>{config.phoneLabel}</span><strong>+226 {phone}</strong></div>}{config.merchantLabel && <div><span>{config.merchantLabel}</span><strong>{merchant}</strong></div>}{flowId === "orange-withdraw-money" && <div><span>Withdrawal point</span><strong>{location}</strong></div>}<div><span>Amount</span><strong>{formatNumber(amount)} FCFA</strong></div>{note && <div><span>{config.noteLabel}</span><strong>{note}</strong></div>}</div><div className="mobile-flow-actions"><button className="mobile-flow-secondary" onClick={() => setStep("form")}><ArrowLeft size={16} /> Edit</button><button className="mobile-flow-primary" onClick={confirm}>Confirm {config.title.toLowerCase()} <ArrowRight size={16} /></button></div></section> : <section className="mobile-flow-card"><div className="mobile-flow-card-heading"><span>Enter details</span><strong>Step 1 of 2</strong></div>{!isCard && <label className="mobile-flow-field">Amount <em>*</em><div className={`mobile-flow-input-suffix ${formMessage && !isValidAmount(amount) ? "has-error" : ""}`}><input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(event) => { setAmount(event.target.value); setFormMessage(""); }} /><span>FCFA</span></div></label>}{config.phoneLabel && <label className="mobile-flow-field">{config.phoneLabel} <em>*</em><div className="mobile-flow-input-prefix"><span>+226</span><input type="tel" inputMode="tel" placeholder={config.phonePlaceholder} value={phone} onChange={(event) => { setPhone(normalizePhone(event.target.value).slice(0, 8)); setFormMessage(""); }} /></div></label>}{config.merchantLabel && <label className="mobile-flow-field">{config.merchantLabel} <em>*</em><input type="text" placeholder={config.merchantPlaceholder} value={merchant} onChange={(event) => { setMerchant(event.target.value); setFormMessage(""); }} /></label>}{flowId === "orange-withdraw-money" && <label className="mobile-flow-field">{config.selectLabel}<select value={location} onChange={(event) => setLocation(event.target.value)}><option>Ouagadougou · Patte d’Oie</option><option>Ouagadougou · 1200 Logements</option><option>Bobo-Dioulasso · Centre</option></select></label>}<label className="mobile-flow-field">{config.noteLabel} <small>Optional</small><input type="text" placeholder={config.notePlaceholder} value={note} onChange={(event) => setNote(event.target.value)} /></label>{formMessage && <p className="mobile-flow-error" role="alert">{formMessage}</p>}<button className="mobile-flow-primary mobile-flow-submit" onClick={handleContinue}>{config.primary} <ArrowRight size={16} /></button><p className="mobile-flow-secure"><ShieldCheck size={15} /> Saved records stay in this workspace.</p></section>}
  </div>;
}

function MobileMoneyFlowSuccess({ config, amount, phone, merchant, reset, goTo }) {
  return <section className="mobile-flow-success"><span className="mobile-flow-success-icon"><Check size={26} /></span><span className="eyebrow">Record saved</span><h2>{config.title} is ready</h2><p>{config.title === "Virtual card" ? "Your card request is ready to view in the workspace." : `${formatNumber(amount)} FCFA is saved as a workspace record for ${config.title.toLowerCase()}.`}</p><div className="mobile-flow-success-detail">{phone && <span><small>Number</small><strong>+226 {phone}</strong></span>}{merchant && <span><small>Merchant</small><strong>{merchant}</strong></span>}<span><small>Status</small><strong>Saved</strong></span></div><button className="mobile-flow-primary" onClick={() => { reset(); goTo("orange-money"); }}>Back to Orange Money <ArrowRight size={16} /></button></section>;
}

function OrangeMoneyServicesView({ goTo, showToast }) {
  return <MobileOrangeMoneyServicesPage goTo={goTo} showToast={showToast} />;
}

function OrangeMoneyVirtualCardView({ goTo, showToast }) {
  return <MobileOrangeVirtualCardPage goTo={goTo} showToast={showToast} />;
}

function MobileOrangeVirtualCardPage({ goTo, showToast }) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  return <div className="mobile-orange-card-page">
    <div className="mobile-flow-header"><button onClick={() => goTo("orange-money")}><ArrowLeft size={18} /> Orange Money</button><OrangeQrLogo /></div>
    <section className="mobile-card-page-title"><div><span>Orange Money</span><h1>Virtual card</h1></div><Search size={22} /></section>
    <section className="prepaid-card-visual">
      <div className="prepaid-card-top"><span className="prepaid-card-brand"><OrangeQrLogo /><strong>Orange Money</strong></span><span className="prepaid-card-access"><span>◇</span> access</span></div>
      <div className="prepaid-card-balance"><span>Card balance</span><strong>{balanceVisible ? formatNumber(merchantAccount.balance) : "••••••••"} <small>FCFA</small></strong></div>
      <span className="prepaid-card-rainbow" />
      <div className="prepaid-card-bottom"><span>••••</span><span>••••</span><span>••••</span><span>••••</span><span>••••••••••••</span><span>CVC •••</span><span className="mastercard-circles"><i /><i /></span></div>
      <button className="prepaid-card-eye" onClick={() => setBalanceVisible((visible) => !visible)} aria-label={balanceVisible ? "Hide card balance" : "Show card balance"}><Eye size={17} /></button>
    </section>
    <div className="prepaid-card-actions">
       <button onClick={() => showToast("Card details opened")}><span className="prepaid-action-icon eye-art"><Eye size={22} /></span><span>View card<br />details</span></button>
      <button onClick={() => goTo("orange-send-money")}><span className="prepaid-action-icon transfer-art"><ArrowUpRight size={22} /></span><span>Transfer to<br />my account</span></button>
       <button onClick={() => showToast("Card recharge opened")}><span className="prepaid-action-icon recharge-art"><CreditCard size={21} /><PlusBadge /></span><span>Recharge<br />my card</span></button>
       <button onClick={() => showToast("Card management opened")}><span className="prepaid-action-icon settings-art"><Settings2 size={22} /></span><span>Manage<br />my card</span></button>
    </div>
    <section className="card-transactions-section">
       <div className="mobile-card-section-heading"><h2>My transactions</h2><button onClick={() => showToast("All card transactions opened")}>View all <ChevronRight size={17} /></button></div>
      <div className="card-transaction-list">
        <button onClick={() => goTo("orange-card-receipt")}><span className="card-transaction-icon"><ReceiptText size={22} /></span><span><strong>Card recharge</strong><small>Today at 17:39</small></span><b>+2,500 FCFA</b><ChevronRight size={18} /></button>
        <button onClick={() => goTo("orange-card-receipt")}><span className="card-transaction-icon"><ReceiptText size={22} /></span><span><strong>Card recharge</strong><small>Today at 17:03</small></span><b>+119,000 FCFA</b><ChevronRight size={18} /></button>
      </div>
    </section>
       <button className="card-security-note" onClick={() => showToast("Card security information opened")}><span><LockKeyhole size={22} /></span><div><strong>Keep your card safe</strong><p>Never share your card details with anyone.</p></div><ChevronRight size={19} /></button>
  </div>;
}

function PlusBadge() {
  return <span className="plus-badge">+</span>;
}

function OrangeMoneyReceiptView({ goTo, showToast, openTransaction }) {
  const [pdfState, setPdfState] = useState("idle");
  const downloadReceipt = () => {
    setPdfState("loading");
    window.setTimeout(() => {
      try {
        downloadTransactionPdf(cardReceiptTransaction);
        setPdfState("success");
        showToast("Receipt PDF downloaded");
      } catch (error) {
        console.error(error);
        setPdfState("error");
        showToast("Receipt PDF could not be created");
      }
    }, 260);
  };
  return <div className="mobile-orange-receipt-page">
    <div className="mobile-flow-header"><button onClick={() => goTo("orange-virtual-card")}><ArrowLeft size={18} /> Virtual card</button><button className="receipt-download" onClick={downloadReceipt} disabled={pdfState === "loading"} aria-label="Download receipt PDF">{pdfState === "loading" ? <LoaderCircle className="spin" size={19} /> : <Download size={19} />}</button></div>
    <div className="receipt-brand"><OrangeQrLogo /><span>Orange<br />Money</span></div>
    <section className="receipt-heading"><h1>Receipt</h1><p>Edition date: June 18, 2025</p></section>
    <div className="receipt-rule" />
    <ReceiptSection title="Transaction"><ReceiptRow label="Type" value="Cash in" /><ReceiptRow label="Amount" value="1,000 Le" /><ReceiptRow label="Date" value="06/16/25 · 12:17" /><ReceiptRow label="Reference" value="CI250616.1217.B95780" /><ReceiptRow label="Status" value="Success" success /></ReceiptSection>
    <ReceiptSection title="Retailer"><ReceiptRow label="Agent code" value="219492" /><ReceiptRow label="Phone number" value="74 741337" /></ReceiptSection>
    <ReceiptSection title="Customer"><ReceiptRow label="Phone number" value="78 973040" /></ReceiptSection>
    {pdfState === "success" && <p className="download-success" role="status"><Check size={14} /> PDF saved to downloads</p>}{pdfState === "error" && <p className="form-error" role="alert">The PDF could not be prepared. Try again.</p>}
    <div className="receipt-actions"><button className="mobile-flow-secondary" onClick={() => openTransaction ? openTransaction(cardReceiptTransaction) : goTo("orange-virtual-card")}>View full details <ArrowRight size={16} /></button><button className="mobile-flow-primary receipt-done" onClick={downloadReceipt}><Download size={16} /> Download PDF</button></div>
  </div>;
}

function ReceiptSection({ title, children }) {
  return <section className="receipt-section"><h2>{title}</h2>{children}</section>;
}

function ReceiptRow({ label, value, success }) {
  return <div className="receipt-row"><span>{label}</span><strong className={success ? "receipt-success" : ""}>{success && <Check size={13} />}{value}</strong></div>;
}

function MobileOrangeMoneyServicesPage({ goTo, showToast }) {
  return <div className="mobile-orange-services-page">
    <div className="mobile-flow-header"><button onClick={() => goTo("orange-money")}><ArrowLeft size={18} /> Orange Money</button><OrangeQrLogo /></div>
    <section className="mobile-flow-title services-title"><span className="mobile-flow-icon flow-icon-services"><Zap size={24} /></span><div><span>Orange Money</span><h1>Services</h1><p>Everything you need, in one place.</p></div></section>
     <div className="mobile-flow-balance"><span><OrangeQrLogo /> Account balance</span><strong>{formatNumber(merchantAccount.balance)} <small>FCFA</small></strong></div>
    <div className="mobile-services-all-grid">{orangeServices.map(({ label, icon: Icon, route, message }) => <button key={label} onClick={() => route ? goTo(route) : showToast(message)}><span className={`mobile-money-service-icon service-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}><Icon size={25} /></span><strong>{label}</strong><ChevronRight size={15} /></button>)}</div>
  </div>;
}

function OrangeMoneyServiceDetailView({ serviceId, goTo, showToast }) {
  const config = orangeServiceConfigs[serviceId];
  const Icon = config.icon;
  const [step, setStep] = useState("form");
  const [values, setValues] = useState({});
  const [formMessage, setFormMessage] = useState("");

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setFormMessage("");
  };

  const reset = () => {
    setStep("form");
    setValues({});
    setFormMessage("");
  };

  const handleContinue = () => {
    const missing = config.fields.find((field) => {
      const value = values[field.name] || "";
      if (!value.trim()) return true;
      if (field.type === "phone" && !isValidPhone(value)) return true;
      if (field.type === "amount" && !isValidAmount(value)) return true;
      return false;
    });
    if (missing) {
      setFormMessage(missing.type === "phone" ? "Enter an 8-digit Burkina Faso phone number." : missing.type === "amount" ? "Enter an amount greater than 0." : `Complete ${missing.label.toLowerCase()}.`);
      return;
    }
    setFormMessage("");
    setStep(config.fields.length ? "review" : "success");
  };

  const confirm = () => {
    setStep("success");
    showToast(`${config.title} saved to the workspace`, {
      type: "service_completed",
      payload: { serviceId, service: config.title, values },
    });
  };

  const displayValue = (field) => {
    const value = values[field.name] || "";
    if (field.type === "amount") return `${formatNumber(value)} FCFA`;
    if (field.type === "phone") return `+226 ${value}`;
    return value;
  };

  return <div className="mobile-orange-flow-page mobile-orange-service-page">
    <div className="mobile-flow-header"><button onClick={() => goTo("services")}><ArrowLeft size={18} /> Services</button><OrangeQrLogo /></div>
    <section className="mobile-flow-title">
      <span className="mobile-flow-icon flow-icon-services"><Icon size={26} /></span>
      <div><span>{config.eyebrow}</span><h1>{config.title}</h1><p>{config.description}</p></div>
    </section>
    <div className="mobile-flow-balance"><span><OrangeQrLogo /> Account balance</span><strong>{formatNumber(merchantAccount.balance)} <small>FCFA</small></strong></div>
    {step === "success" ? <section className="mobile-flow-success">
      <span className="mobile-flow-success-icon"><Check size={26} /></span>
       <span className="eyebrow">Record saved</span>
      <h2>{config.title} ready</h2>
      <p>{config.success}</p>
        <div className="mobile-flow-success-detail"><span><small>Service</small><strong>{config.title}</strong></span><span><small>Status</small><strong>Saved</strong></span></div>
      <button className="mobile-flow-primary" onClick={() => { reset(); goTo("services"); }}>Back to Services <ArrowRight size={16} /></button>
    </section> : step === "review" ? <section className="mobile-flow-card">
      <div className="mobile-flow-card-heading"><span>Review details</span><strong>Check before confirming</strong></div>
      <div className="mobile-flow-summary">{config.fields.map((field) => <div key={field.name}><span>{field.label}</span><strong>{displayValue(field)}</strong></div>)}</div>
      <div className="mobile-flow-actions"><button className="mobile-flow-secondary" onClick={() => setStep("form")}><ArrowLeft size={16} /> Edit</button><button className="mobile-flow-primary" onClick={confirm}>Confirm <ArrowRight size={16} /></button></div>
    </section> : <section className="mobile-flow-card">
      <div className="mobile-flow-card-heading"><span>{config.fields.length ? "Enter details" : "Explore this service"}</span><strong>{config.fields.length ? "Step 1 of 2" : "Ready when you are"}</strong></div>
      {config.fields.map((field) => <label className="mobile-flow-field" key={field.name} htmlFor={`service-${field.name}`}>{field.label} <em>*</em>
        {field.type === "select" ? <select id={`service-${field.name}`} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)}><option value="">Choose an option</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select>
          : field.type === "amount" ? <div className="mobile-flow-input-suffix"><input id={`service-${field.name}`} type="number" inputMode="decimal" placeholder={field.placeholder} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)} /><span>FCFA</span></div>
            : <input id={`service-${field.name}`} type={field.type === "phone" ? "tel" : "text"} inputMode={field.type === "phone" ? "tel" : "text"} placeholder={field.placeholder} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, field.type === "phone" ? normalizePhone(event.target.value).slice(0, 8) : event.target.value)} />}
      </label>)}
      {formMessage && <p className="mobile-flow-error" role="alert">{formMessage}</p>}
      <button className="mobile-flow-primary mobile-flow-submit" onClick={handleContinue}>{config.action} <ArrowRight size={16} /></button>
       <p className="mobile-flow-secure"><ShieldCheck size={15} /> Saved records stay in this workspace.</p>
    </section>}
  </div>;
}

function MobileOrangeMoneyPage({ goTo }) {
  return <div className="mobile-orange-money-page"><section className="panel local-wallet-home"><span className="eyebrow">Wallet workspace</span><h2>Keep wallet actions organized</h2><p>Save account action records here and review them in Activity.</p><div className="local-wallet-actions"><button className="primary-button" onClick={() => goTo("collections")}><ArrowDownLeft size={16} /> Create deposit</button><button className="outline-button" onClick={() => goTo("orange-send-money")}><ArrowUpRight size={16} /> Prepare transfer</button><button className="outline-button" onClick={() => goTo("services")}><Zap size={16} /> Open services</button><button className="outline-button" onClick={() => goTo("orange-card-receipt")}><ReceiptText size={16} /> View receipts</button></div><div className="local-wallet-status"><span className="live-dot" /> Account preview · {merchantAccount.displayNumber}</div></section></div>;
}

function OrangeLogo() {
  return <span className="orange-money-logo" aria-label="Orange Money logo"><img src={orangeLogoAsset} alt="" /></span>;
}

function OrangeQrLogo() {
  return <img className="orange-qr-logo" src={orangeLogoAsset} alt="" aria-hidden="true" />;
}

function MobileMoneyFavoriteArt({ type }) {
  if (type === "send") return <Send size={27} strokeWidth={2.5} />;
  if (type === "withdraw") return <span className="favorite-withdraw-art"><Smartphone size={27} /><ArrowDownLeft size={15} /></span>;
  if (type === "purchases") return <span className="favorite-purchases-art"><UserRound size={18} /><ShoppingCart size={27} /></span>;
  if (type === "credit") return <span className="favorite-credit-art"><ArrowUpRight size={26} /><i /></span>;
  return <span className="favorite-card-art"><span /><span /></span>;
}

function StatCard({ label, value, suffix, trend, trendText, icon: Icon, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}-icon`}><Icon size={18} /></div><div className="stat-copy"><span>{label}</span><strong>{value} <small>{suffix}</small></strong><p><b className={tone === "orange" ? "orange-text" : "green-text"}>{trend}</b> {trendText}</p></div></div>;
}

function TransactionList({ items = transactions, showToast, openTransaction }) {
  if (!items.length) return <div className="empty-state compact-empty"><span className="empty-icon"><ReceiptText size={20} /></span><h3>No records yet</h3><p>Complete a workspace action to see its record here.</p></div>;
  return <div className="transaction-list">{items.map((transaction) => { const Icon = transaction.icon; return <button className="transaction-row" key={transaction.id} onClick={() => openTransaction ? openTransaction(transaction) : showToast(`Opened ${transaction.id}`)}><span className={`transaction-icon ${transaction.tone}`}><Icon size={16} /></span><span className="transaction-copy"><strong>{transaction.name}</strong><small>{transaction.type} <span>·</span> {transaction.time}</small></span><span className={`transaction-amount ${transaction.amount.startsWith("+") ? "positive" : ""}`}>{transaction.amount} <small>FCFA</small><em className={`status-chip ${transaction.tone}`}>{transaction.status}</em></span><ChevronRight size={16} className="row-chevron" /></button>; })}</div>;
}

function CollectionsView({ showToast, openTransaction }) {
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("");
  const [customer, setCustomer] = useState("");
  const [note, setNote] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [savedTransaction, setSavedTransaction] = useState(null);
  const amountInvalid = amount !== "" && !isValidAmount(amount);
  const customerInvalid = customer !== "" && !isValidPhone(customer);
  const reset = () => { setStep("form"); setAmount(""); setCustomer(""); setNote(""); setFormMessage(""); setSavedTransaction(null); };
  const handleContinue = () => {
    if (!isValidAmount(amount)) {
      setFormMessage("Enter an amount greater than 0.");
      return;
    }
    if (!isValidPhone(customer)) {
      setFormMessage("Enter an 8-digit Burkina Faso phone number.");
      return;
    }
    setFormMessage("");
    setStep("review");
  };
  const saveDeposit = async () => {
    setStep("processing");
    const reference = `LOCAL-${Date.now().toString().slice(-8)}`;
    const payload = { flowId: "deposit-local", recordType: "Deposit", title: "Deposit funds", reference, amount, phone: customer, accountNumber: merchantAccount.number, note: note || null, status: "Saved locally" };
    try {
      const result = await persistEvent({ eventType: "local_record_saved", viewId: "collections", payload });
      setSavedTransaction(localTransactionFromEvent(result.event));
      setStep("success");
      showToast("Deposit saved");
    } catch (error) {
      console.error(error);
      setFormMessage("This deposit could not be saved. Try again.");
      setStep("review");
    }
  };
  if (step === "success") return <SuccessState transaction={savedTransaction} type="collection" amount={amount} customer={customer || "Customer"} reset={reset} showToast={showToast} openTransaction={openTransaction} />;
  return <div className="flow-view">
     <PageIntro eyebrow="Deposit" title="Deposit funds" description="Save a deposit record to this workspace." action={<button className="soft-button" onClick={reset}><ReceiptText size={16} /> New deposit</button>} />
    <FlowSteps active={step === "form" ? 0 : step === "review" ? 1 : 2} labels={["Payment details", "Review", "Complete"]} />
       {step === "processing" ? <ProcessingState label="Saving deposit" detail="Writing this deposit record to the workspace." /> : step === "review" ? <CollectionReview amount={amount} customer={customer} note={note} onBack={() => setStep("form")} onConfirm={saveDeposit} /> : <div className="flow-grid"><div className="panel form-panel"><div className="panel-header"><div><span className="eyebrow">Step 1 of 2</span><h3>Deposit details</h3></div><span className="required-note">All fields marked * are required</span></div><label className="field-label">Amount <span>*</span><div className={`input-with-suffix ${amountInvalid ? "has-error" : ""}`}><input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(event) => { setAmount(event.target.value); setFormMessage(""); }} min="1" aria-invalid={amountInvalid} /><span>FCFA</span></div>{amountInvalid && <small className="field-error">Amount must be greater than 0.</small>}</label><label className="field-label">Customer phone number <span>*</span><div className={`input-with-prefix ${customerInvalid ? "has-error" : ""}`}><span>+226</span><input type="tel" inputMode="tel" autoComplete="tel-national" placeholder="70 00 00 00" value={customer} onChange={(event) => { setCustomer(event.target.value); setFormMessage(""); }} aria-invalid={customerInvalid} /></div>{customerInvalid && <small className="field-error">Use 8 digits, for example 70 00 00 00.</small>}</label><label className="field-label">Reference <small>Optional</small><input type="text" placeholder="e.g. Deposit reference" value={note} onChange={(event) => setNote(event.target.value)} /></label><button className="primary-button form-submit" disabled={!amount || !customer} onClick={handleContinue}>Continue to review <ArrowRight size={16} /></button>{formMessage && <p className="form-error" role="alert">{formMessage}</p>}<p className="secure-note"><ShieldCheck size={15} /> Saves a record; no provider is contacted.</p></div><div className="panel side-info-panel"><span className="info-symbol"><Smartphone size={19} /></span><h3>About this flow</h3><ol><li><span>1</span><div><strong>Enter the amount</strong><p>Add the information your team needs.</p></div></li><li><span>2</span><div><strong>Review the details</strong><p>Check the deposit information before saving.</p></div></li><li><span>3</span><div><strong>Save the record</strong><p>The entry is stored in the workspace.</p></div></li></ol><div className="info-callout">Saved deposits remain available in Activity and Receipts.</div></div></div>}
  </div>;
}

function CollectionReview({ amount, customer, note, onBack, onConfirm }) {
  return <div className="panel review-panel"><div className="review-icon orange-bg"><ArrowDownLeft size={24} /></div><span className="eyebrow">Review deposit</span><h3>Check the deposit details</h3><p className="review-lead">This saves a deposit record to the workspace. No payment provider will be contacted.</p><div className="review-amount">{formatNumber(amount)} <small>FCFA</small></div><div className="detail-list"><div><span>Customer</span><strong>+226 {customer}</strong></div><div><span>Reference</span><strong>{note || "No reference"}</strong></div><div><span>Processing fee</span><strong>0 FCFA</strong></div></div><div className="review-actions"><button className="outline-button" onClick={onBack}><ArrowLeft size={16} /> Edit details</button><button className="primary-button" onClick={onConfirm}>Save deposit <ArrowRight size={16} /></button></div></div>;
}

function TransfersView({ showToast, openTransaction }) {
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState("Airtel distribution");
  const [source, setSource] = useState(`Main account · ${formatNumber(merchantAccount.balance)} FCFA`);
  const [formMessage, setFormMessage] = useState("");
  const [savedTransaction, setSavedTransaction] = useState(null);
  const amountInvalid = amount !== "" && !isValidAmount(amount);
  const reset = () => { setStep("form"); setAmount(""); setFormMessage(""); setSavedTransaction(null); };
  const handleContinue = () => {
    if (!isValidAmount(amount)) {
      setFormMessage("Enter an amount greater than 0.");
      return;
    }
    setFormMessage("");
    setStep("review");
  };
  const saveTransfer = async () => {
    setStep("processing");
    const reference = `LOCAL-${Date.now().toString().slice(-8)}`;
    const payload = { flowId: "transfers", recordType: "Transfer", title: "Transfer funds", reference, amount, beneficiary, source, accountNumber: merchantAccount.number, fee: 100, status: "Saved locally" };
    try {
      const result = await persistEvent({ eventType: "local_record_saved", viewId: "transfers", payload });
      setSavedTransaction(localTransactionFromEvent(result.event));
      setStep("success");
      showToast("Transfer saved");
    } catch (error) {
      console.error(error);
      setFormMessage("This transfer could not be saved. Try again.");
      setStep("review");
    }
  };
  if (step === "success") return <SuccessState transaction={savedTransaction} type="transfer" amount={amount} customer={beneficiary} reset={reset} showToast={showToast} openTransaction={openTransaction} />;
  return <div className="flow-view"><PageIntro eyebrow="Money movement" title="Transfer funds" description="Send money from your merchant accounts to a beneficiary." action={<button className="soft-button" onClick={() => showToast("Transfer history opened")}><BookOpen size={16} /> Transfer history</button>} /><FlowSteps active={step === "form" ? 0 : step === "review" ? 1 : 2} labels={["Transfer details", "Review", "Complete"]} />{step === "processing" ? <ProcessingState label="Processing transfer" detail="This usually takes a few seconds." /> : step === "review" ? <TransferReview amount={amount} beneficiary={beneficiary} source={source} onBack={() => setStep("form")} onConfirm={saveTransfer} /> : <div className="flow-grid"><div className="panel form-panel"><div className="panel-header"><div><span className="eyebrow">Step 1 of 2</span><h3>Transfer details</h3></div></div><label className="field-label">From account <span>*</span><div className="select-wrap"><WalletCards size={17} /><select value={source} onChange={(event) => setSource(event.target.value)}><option>{`Main account · ${formatNumber(merchantAccount.balance)} FCFA`}</option><option>Settlement account · 814,200 FCFA</option></select><ChevronDown size={16} /></div></label><label className="field-label">Beneficiary <span>*</span><div className="select-wrap"><UsersRound size={17} /><select value={beneficiary} onChange={(event) => setBeneficiary(event.target.value)}><option>Airtel distribution</option><option>Issouf Kaboré · +226 70 82 11 04</option><option>New beneficiary</option></select><ChevronDown size={16} /></div></label><label className="field-label">Amount <span>*</span><div className={`input-with-suffix ${amountInvalid ? "has-error" : ""}`}><input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(event) => { setAmount(event.target.value); setFormMessage(""); }} min="1" aria-invalid={amountInvalid} /><span>FCFA</span></div>{amountInvalid && <small className="field-error">Amount must be greater than 0.</small>}</label><button className="primary-button form-submit" disabled={!amount} onClick={handleContinue}>Continue to review <ArrowRight size={16} /></button>{formMessage && <p className="form-error" role="alert">{formMessage}</p>}<p className="secure-note"><LockKeyhole size={15} /> Transfers are protected by merchant verification.</p></div><div className="panel side-info-panel transfer-side"><span className="info-symbol blue-bg"><ArrowUpRight size={19} /></span><h3>Transfer safely</h3><p>Choose the right account before sending funds. You can review the recipient and fees before confirming.</p><div className="limit-card"><span>Daily transfer limit</span><strong>2,000,000 FCFA</strong><div className="limit-bar"><span /></div><small>1,714,000 FCFA remaining today</small></div></div></div>}</div>;
}

function TransferReview({ amount, beneficiary, source, onBack, onConfirm }) {
  return <div className="panel review-panel"><div className="review-icon blue-bg"><ArrowUpRight size={24} /></div><span className="eyebrow">Review transfer</span><h3>Confirm the transfer</h3><p className="review-lead">Review the details before you send the funds.</p><div className="review-amount">{formatNumber(amount)} <small>FCFA</small></div><div className="detail-list"><div><span>From</span><strong>{source}</strong></div><div><span>Beneficiary</span><strong>{beneficiary}</strong></div><div><span>Transfer fee</span><strong>100 FCFA</strong></div><div className="total-row"><span>Total debit</span><strong>{formatNumber(Number(amount || 0) + 100)} FCFA</strong></div></div><div className="review-actions"><button className="outline-button" onClick={onBack}><ArrowLeft size={16} /> Edit details</button><button className="primary-button" onClick={onConfirm}>Confirm transfer <ArrowRight size={16} /></button></div></div>;
}

function FlowSteps({ active, labels }) {
  return <div className="flow-steps">{labels.map((label, index) => <div className={`flow-step ${index <= active ? "active" : ""}`} key={label}><span>{index < active ? <Check size={13} /> : index + 1}</span><strong>{label}</strong>{index < labels.length - 1 && <i />}</div>)}</div>;
}

function ProcessingState({ label, detail }) {
  return <div className="panel state-panel"><span className="loading-symbol"><LoaderCircle size={30} /></span><h3>{label}</h3><p>{detail}</p></div>;
}

function SuccessState({ transaction: savedTransaction, type, amount, customer, reset, showToast, openTransaction }) {
  const transaction = savedTransaction || { id: "OM-DEP-845291", name: customer, type: "Deposit", amount: `+ ${formatNumber(amount)}`, time: "Just now", date: "Just now", status: "Saved", tone: "success", channel: "Workspace deposit", reference: "OM-DEP-845291", details: { "Customer phone": `+226 ${customer}`, "Processing fee": "0 FCFA" }, icon: ArrowDownLeft };
  return <div className="panel state-panel success-panel"><span className="state-symbol success-symbol"><Check size={30} /></span><span className="eyebrow">Deposit saved</span><h3>Your deposit record is ready</h3><p>No provider was contacted and no real funds were moved.</p><div className="success-receipt"><div><span>Amount</span><strong>{formatNumber(amount)} <small>FCFA</small></strong></div><div><span>Customer</span><strong>{customer}</strong></div><div><span>Reference</span><strong>{transaction.reference}</strong></div></div><div className="review-actions"><button className="outline-button" onClick={reset}>Make another deposit</button><button className="outline-button" onClick={() => openTransaction ? openTransaction(transaction) : showToast("Transaction details opened")}><ReceiptText size={16} /> View details</button></div></div>;
}

function QrView({ showToast }) {
  const [tab, setTab] = useState("display");
  const copyPayload = async () => {
    try {
      await navigator.clipboard?.writeText(merchantQrPayload);
      showToast("QR account payload copied");
    } catch {
      showToast("QR account payload ready to share");
    }
  };
  return <div className="standard-view"><PageIntro eyebrow="Payments" title="QR payments" description="Let customers pay instantly by scanning your merchant QR code." action={<button className="soft-button" onClick={() => showToast("QR image ready to save")}><Download size={16} /> Download QR</button>} /><div className="tab-bar"><button className={tab === "display" ? "active" : ""} onClick={() => setTab("display")}><QrCode size={16} /> My merchant QR</button><button className={tab === "scan" ? "active" : ""} onClick={() => setTab("scan")}><ScanLine size={16} /> Scan to verify</button></div>{tab === "display" ? <div className="qr-layout"><div className="panel qr-card"><div className="qr-card-top"><div><span className="eyebrow">Your payment code</span><h3>{merchantAccount.name}</h3><p>Customers can scan this code to pay you.</p></div><span className="verified-badge"><ShieldCheck size={14} /> Account QR</span></div><div className="qr-frame"><QrGraphic payload={merchantQrPayload} /><div className="qr-center-mark orange-qr-center"><OrangeQrLogo /></div></div><div className="qr-code-label">Account <strong>{merchantAccount.displayNumber}</strong><span>·</span> Encoded account number</div><div className="qr-actions"><button className="primary-button" onClick={copyPayload}><Copy size={16} /> Share QR</button><button className="outline-button" onClick={() => showToast("QR image ready to save")}><Download size={16} /> Save image</button></div></div><div className="panel qr-guide"><span className="info-symbol dark-bg"><QrCode size={19} /></span><h3>How customers pay</h3><div className="qr-guide-step"><span>01</span><div><strong>Open their payment app</strong><p>They select “Pay by QR” on their phone.</p></div></div><div className="qr-guide-step"><span>02</span><div><strong>Scan your code</strong><p>Your store details appear immediately.</p></div></div><div className="qr-guide-step"><span>03</span><div><strong>Confirm the amount</strong><p>You’ll see the payment in Activity.</p></div></div><button className="text-button" onClick={() => setTab("scan")}>Verify a payment <ArrowRight size={15} /></button></div></div> : <VerifyView showToast={showToast} embedded />}</div>;
}

function QrGraphic({ payload = merchantQrPayload }) {
  const qrCode = QRCode.create(payload, { errorCorrectionLevel: "M" });
  const { size, data } = qrCode.modules;
  return <div className="qr-graphic" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)` }} data-qr-payload={payload} aria-label={`Merchant QR code for account ${merchantAccount.displayNumber}`}>{data.map((filled, index) => <span key={index} className={filled ? "filled" : ""} />)}</div>;
}

function RegisterView({ showToast }) {
  const [isOpen, setIsOpen] = useState(true);
  const [showClose, setShowClose] = useState(false);
  const [countedCash, setCountedCash] = useState("124500");
  const expectedCash = 124500;
  const openCloseModal = () => {
    setCountedCash(String(expectedCash));
    setShowClose(true);
  };
  const closeRegister = () => {
    if (Number(countedCash) !== expectedCash) {
      showToast(`Count should match ${formatNumber(expectedCash)} FCFA`);
      return;
    }
    setIsOpen(false);
    setShowClose(false);
    showToast("Register closed successfully");
  };

  return (
    <div className="standard-view">
      <PageIntro eyebrow="Daily operations" title="Cash register" description="Keep track of cash on hand, movements, and end-of-day differences." action={<button className="soft-button" onClick={openCloseModal} disabled={!isOpen}><FileCheck2 size={16} /> {isOpen ? "Close register" : "Register closed"}</button>} />
      <div className="register-top-grid">
        <div className={`panel register-hero ${isOpen ? "open" : "closed"}`}>
          <div className="register-hero-top"><div><span className="eyebrow">Current session</span><h3>{isOpen ? "Register is open" : "Register is closed"}</h3></div><span className={`status-pill ${isOpen ? "success" : "neutral"}`}><span />{isOpen ? "Active" : "Closed"}</span></div>
          <div className="register-hero-amount">{isOpen ? "124,500" : "0"} <small>FCFA</small></div>
          <p>{isOpen ? "Expected cash balance" : "Open a register to start tracking today."}</p>
          {isOpen ? <div className="register-hero-meta"><span><Clock3 size={14} /> Opened today at <strong>08:01</strong></span><span>By Seydou M.</span></div> : <button className="primary-button" onClick={() => { setIsOpen(true); setCountedCash("124500"); showToast("Cash register opened"); }}>Open register <ArrowRight size={16} /></button>}
        </div>
        <div className="panel register-totals">
          <div className="panel-header"><div><span className="eyebrow">Today at a glance</span><h3>Cash movement</h3></div><button className="more-button" onClick={() => showToast("Register actions are available in this view")} aria-label="More cash movement actions"><MoreHorizontal size={18} /></button></div>
          <div className="movement-row"><span className="movement-icon green-icon"><ArrowDownLeft size={16} /></span><div><span>Cash in</span><strong>+ 74,500 FCFA</strong></div></div>
          <div className="movement-row"><span className="movement-icon orange-icon"><ArrowUpRight size={16} /></span><div><span>Cash out</span><strong>0 FCFA</strong></div></div>
          <div className="movement-row"><span className="movement-icon blue-icon"><ReceiptText size={16} /></span><div><span>Transactions</span><strong>18</strong></div></div>
        </div>
      </div>
      <div className="panel register-history">
         <div className="panel-header"><div><span className="eyebrow">Past sessions</span><h3>Register history</h3></div><button className="text-button" onClick={() => showToast("Showing all register sessions")}>View all <ArrowRight size={15} /></button></div>
        <button className="history-row" onClick={() => showToast("Opened register session from 23 April")}><span className="history-date">23 <small>APR</small></span><div><strong>Tuesday, 23 April</strong><p>08:12 – 19:04 · Seydou M.</p></div><div className="history-balance"><span>Closing balance</span><strong>98,250 FCFA</strong></div><span className="status-chip success">Balanced</span><ChevronRight size={16} /></button>
        <button className="history-row" onClick={() => showToast("Opened register session from 22 April")}><span className="history-date">22 <small>APR</small></span><div><strong>Monday, 22 April</strong><p>08:05 – 18:47 · Seydou M.</p></div><div className="history-balance"><span>Closing balance</span><strong>112,800 FCFA</strong></div><span className="status-chip warning">− 1,200 gap</span><ChevronRight size={16} /></button>
      </div>
      {showClose && <div className="modal-scrim" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="close-register-title"><button className="modal-close" onClick={() => setShowClose(false)} aria-label="Close dialog"><X size={18} /></button><span className="modal-icon orange-bg"><FileCheck2 size={20} /></span><span className="eyebrow">End of day</span><h3 id="close-register-title">Close your register?</h3><p>Make sure your cash count matches the expected balance before closing.</p><div className="closing-input"><label htmlFor="counted-cash">Counted cash</label><div className={`input-with-suffix ${Number(countedCash) !== expectedCash ? "has-error" : ""}`}><input id="counted-cash" value={countedCash} onChange={(event) => setCountedCash(event.target.value)} type="number" inputMode="decimal" min="0" /><span>FCFA</span></div>{Number(countedCash) !== expectedCash && <small className="field-error">Enter {formatNumber(expectedCash)} FCFA to close this register.</small>}</div><div className="modal-actions"><button className="outline-button" onClick={() => setShowClose(false)}>Cancel</button><button className="primary-button" onClick={closeRegister} disabled={!countedCash}>Close register</button></div></div></div>}
    </div>
  );
}

function RevenueView({ showToast }) {
  const [period, setPeriod] = useState("30 days");
  const values = period === "7 days" ? ["42", "56", "49", "73", "62", "80", "67"] : period === "90 days" ? ["38", "51", "47", "68", "57", "71", "64", "83", "76", "92", "81", "96"] : ["35", "48", "44", "62", "57", "75", "69", "88", "72", "91", "82", "96"];
  const points = values.map((value, index) => `${index === 0 ? "M" : "L"} ${(index / (values.length - 1)) * 760} ${220 - Number(value) * 1.9}`).join(" ");
  return <div className="standard-view"><PageIntro eyebrow="Business performance" title="Revenue & performance" description="Understand how your collections are growing over time." action={<button className="outline-button" onClick={() => showToast(`Revenue report for ${period} export requested`)}><Download size={16} /> Export report</button>} /><div className="revenue-stats"><div className="panel revenue-total"><span className="eyebrow">Total revenue</span><strong>1,842,500 <small>FCFA</small></strong><p><span className="trend-up">↗ 8.4%</span> vs previous period</p><div className="revenue-mini-bars">{values.slice(-7).map((value, index) => <span key={index} style={{ height: `${Number(value) * .62}px` }} />)}</div></div><StatCard label="Completed payments" value="418" suffix="" trend="+11.2%" trendText="vs last period" icon={Check} tone="green" /><StatCard label="Average transaction" value="4,408" suffix="FCFA" trend="+3.6%" trendText="vs last period" icon={BarChart3} tone="blue" /></div><div className="panel chart-panel"><div className="panel-header chart-header"><div><span className="eyebrow">Collection volume</span><h3>Revenue over time</h3></div><div className="segmented-control" role="tablist" aria-label="Revenue period">{["7 days", "30 days", "90 days"].map((item) => <button key={item} role="tab" aria-selected={period === item} className={period === item ? "active" : ""} onClick={() => setPeriod(item)}>{item}</button>)}</div></div><div className="chart-wrap"><div className="chart-y-labels"><span>100k</span><span>75k</span><span>50k</span><span>25k</span><span>0</span></div><div className="chart"><div className="chart-gridlines"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 760 240" preserveAspectRatio="none" role="img" aria-label={`Revenue chart for ${period}`}><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f56b2a" stopOpacity=".22" /><stop offset="1" stopColor="#f56b2a" stopOpacity="0" /></linearGradient></defs><path d={`M 0 206 ${values.map((v, i) => `L ${(i / (values.length - 1)) * 760} ${220 - Number(v) * 1.9}`).join(" ")} L 760 240 L 0 240 Z`} fill="url(#areaFill)" /><path d={points} fill="none" stroke="#f56b2a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{values.map((v, i) => <circle key={i} cx={(i / (values.length - 1)) * 760} cy={220 - Number(v) * 1.9} r="4" fill="#fff" stroke="#f56b2a" strokeWidth="2" />)}</svg><div className="chart-x-labels"><span>Apr 01</span><span>Apr 08</span><span>Apr 15</span><span>Apr 22</span><span>Today</span></div></div></div></div></div>;
}

function ActivityView({ showToast, openTransaction }) {
  const [filter, setFilter] = useState("All activity");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState("All dates");
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setLoadError("");
    fetch("/api/events?limit=12")
      .then((response) => {
        if (!response.ok) throw new Error(`Activity load failed with status ${response.status}`);
        return response.json();
      })
      .then((data) => { if (mounted) setSavedEvents(data.events || []); })
      .catch((error) => { console.error(error); if (mounted) setLoadError("Activity could not be loaded."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [loadAttempt]);
  const savedItems = savedEvents.filter((event) => event.payload?.flowId).map((event) => {
    const payload = event.payload || {};
    const amountNumber = Number(payload.amount || payload.fields?.amount || 0);
    const title = payload.title || payload.message || payload.recordType || event.event_type.replaceAll("_", " ");
    const eventTransaction = localTransactionFromEvent(event);
    const amount = eventTransaction.amount || (amountNumber > 0 ? `${formatNumber(amountNumber)} FCFA` : "");
    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      detail: `${payload.status === "Saved locally" ? "Saved" : (payload.status || "Saved")} · ${event.view_id}`,
      amount,
      time: new Date(event.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      icon: eventTransaction.icon || Check,
      tone: eventTransaction.tone || "success",
      transaction: eventTransaction,
    };
  });
  const illustrativeItems = currentMonthHistory.map((transaction) => ({
    title: transaction.type,
    detail: `${transaction.status} · ${transaction.name}`,
    amount: transaction.amount,
    time: transaction.time,
    icon: transaction.icon,
    tone: transaction.tone,
    transaction,
  }));
  const staticItems = activityEvents.map((group) => ({ ...group, items: group.items.map((item) => ({ ...item, transaction: item.transactionId ? transactions.find((transaction) => transaction.id === item.transactionId) : null })) }));
   const eventGroups = [{ date: "This month · illustrative history", items: illustrativeItems }, ...(savedItems.length ? [{ date: "Saved records", items: savedItems }] : []), ...staticItems];
  const searchQuery = query.trim().toLowerCase();
  const filtered = eventGroups.map((group) => ({ ...group, items: group.items.filter((item) => {
    const matchesCategory = filter === "All activity" || (filter === "Payments" && item.title.includes("Payment")) || (filter === "Transfers" && item.title.includes("Transfer")) || (filter === "Operations" && !item.title.includes("Payment") && !item.title.includes("Transfer"));
    const matchesQuery = !searchQuery || `${item.title} ${item.detail} ${item.amount}`.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesQuery;
  }) })).filter((group) => group.items.length);
  return <div className="standard-view"><PageIntro eyebrow="Merchant activity" title="Activity" description="Review this month’s account history and saved workspace records." action={<button className="outline-button" onClick={() => showToast("Activity export is not available yet")}><Download size={16} /> Export activity</button>} /><div className="activity-toolbar"><div className="search-field"><Search size={17} /><input aria-label="Search activity" placeholder="Search activity" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="filter-pills" role="tablist" aria-label="Activity categories">{["All activity", "Payments", "Transfers", "Operations"].map((item) => <button role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><button className={`outline-button filter-button ${filtersOpen ? "selected" : ""}`} onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}><Filter size={16} /> Filters</button></div>{filtersOpen && <div className="filter-panel"><label>Date range<select value={dateRange} onChange={(event) => { setDateRange(event.target.value); showToast(`Date range set to ${event.target.value}`); }}><option>All dates</option><option>Today</option><option>Last 7 days</option><option>This month</option></select></label><button className="text-button" onClick={() => { setDateRange("All dates"); setFilter("All activity"); setQuery(""); showToast("Activity filters cleared"); }}>Clear filters <X size={14} /></button></div>}{loading ? <ActivitySkeleton /> : loadError ? <div className="panel error-state" role="alert"><CircleHelp size={20} /><h3>We couldn’t load activity</h3><p>{loadError}</p><button className="outline-button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Try again</button></div> : <div className="activity-timeline">{filtered.length ? filtered.map((group) => <div className="timeline-group" key={group.date}><h3>{group.date}</h3>{group.items.map((item, index) => { const Icon = item.icon; return <button className="timeline-item" key={`${group.date}-${index}`} onClick={() => item.transaction ? openTransaction(item.transaction) : showToast(`${item.title} details opened`)}><div className={`timeline-icon ${item.tone}`}><Icon size={16} /></div><div className="timeline-copy"><strong>{item.title}</strong><p>{item.detail}</p></div><div className="timeline-amount"><strong className={item.amount.startsWith("+") ? "positive" : ""}>{item.amount}</strong><span>{item.time}</span></div><ChevronRight size={16} /></button>; })}</div>) : <div className="panel empty-state"><span className="empty-icon"><Search size={22} /></span><h3>No activity found</h3><p>Create a record from Collections, Transfers, QR, or another workspace tool.</p></div>}</div>}</div>;
}

function ActivitySkeleton() {
  return <div className="activity-timeline loading-view" role="status" aria-label="Loading activity">{[1, 2, 3, 4].map((item) => <div className="timeline-item skeleton-row" key={item}><LoadingSkeleton className="skeleton-circle" /><span className="skeleton-lines"><LoadingSkeleton /><LoadingSkeleton /></span><LoadingSkeleton className="skeleton-amount" /></div>)}</div>;
}

function VerifyView({ showToast, embedded = false }) {
  const [state, setState] = useState("idle");
  const [manualOpen, setManualOpen] = useState(false);
  const [manualReference, setManualReference] = useState("");
  const begin = () => { setState("scanning"); window.setTimeout(() => setState("success"), 1200); };
  const submitManualReference = () => {
    if (!manualReference.trim()) return;
    setManualOpen(false);
    setManualReference("");
    setState("success");
  };
  return <div className={embedded ? "verify-embedded" : "standard-view"}>{!embedded && <PageIntro eyebrow="Verification" title="Scan & verify" description="Check a payment QR code or transaction reference before handing over goods." action={<button className="outline-button" onClick={() => showToast("Verification history opened")}><BookOpen size={16} /> Verification history</button>} />}{state === "success" ? <div className="panel verify-result"><span className="state-symbol success-symbol"><Check size={28} /></span><span className="eyebrow">Payment verified</span><h3>This payment is valid</h3><p>The transaction has been confirmed and the funds are available to the merchant.</p><div className="verify-detail"><div><span>Amount</span><strong>42,000 FCFA</strong></div><div><span>From</span><strong>Mariam Ouédraogo</strong></div><div><span>Reference</span><strong>OM-PAY-845101</strong></div><div><span>Verified</span><strong>Just now</strong></div></div><div className="review-actions"><button className="outline-button" onClick={() => setState("idle")}>Scan another</button><button className="primary-button" onClick={() => { setState("idle"); showToast("Payment marked as verified"); }}><Check size={16} /> Done</button></div></div> : <div className="verify-layout"><div className="panel scanner-panel"><div className={`scanner-viewport ${state === "scanning" ? "is-scanning" : ""}`}><div className="scanner-corner top-left" /><div className="scanner-corner top-right" /><div className="scanner-corner bottom-left" /><div className="scanner-corner bottom-right" />{state === "scanning" && <span className="scan-line" />}{state === "scanning" ? <LoaderCircle className="scanner-loader" size={30} /> : <ScanLine className="scanner-placeholder" size={48} />}</div><h3>{state === "scanning" ? "Looking for a code…" : "Scan a payment QR code"}</h3><p>Position the customer’s QR code inside the frame.</p><button className="primary-button" onClick={begin} disabled={state === "scanning"}>{state === "scanning" ? "Scanning…" : "Start scanner"} <ScanLine size={16} /></button><button className="text-button manual-button" onClick={() => setManualOpen(true)}>Enter reference manually <ArrowRight size={15} /></button></div><div className="panel verify-side"><span className="info-symbol green-bg"><ShieldCheck size={19} /></span><h3>Verify before delivery</h3><p>Only hand over goods once a payment shows as verified in this workspace.</p><div className="verify-note"><Check size={15} /><span>Real-time confirmation</span></div><div className="verify-note"><Check size={15} /><span>Protected transaction details</span></div><div className="verify-note"><Check size={15} /><span>Works with merchant QR codes</span></div></div></div>}{manualOpen && <div className="modal-scrim"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="manual-reference-title"><button className="modal-close" onClick={() => setManualOpen(false)} aria-label="Close dialog"><X size={18} /></button><span className="modal-icon blue-bg"><FileCheck2 size={20} /></span><span className="eyebrow">Manual verification</span><h3 id="manual-reference-title">Enter a transaction reference</h3><p>Use the reference shown on the customer’s receipt as the verification reference.</p><label className="field-label" htmlFor="manual-reference">Transaction reference<input id="manual-reference" type="text" placeholder="e.g. OM-PAY-845101" value={manualReference} onChange={(event) => setManualReference(event.target.value)} autoFocus /></label><div className="modal-actions"><button className="outline-button" onClick={() => setManualOpen(false)}>Cancel</button><button className="primary-button" onClick={submitManualReference} disabled={!manualReference.trim()}>Verify reference <Check size={16} /></button></div></div></div>}</div>;
}

function ProfileView({ showToast }) {
  const [language, setLanguage] = useState("Français");
  const [workspaceName, setWorkspaceName] = useState("Merchant workspace");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("Merchant workspace");
  const [loading, setLoading] = useState(true);
  const [settingsError, setSettingsError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setSettingsError("");
    fetch("/api/settings")
      .then((response) => {
        if (!response.ok) throw new Error(`Settings load failed with status ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const savedLanguage = data.settings?.find((setting) => setting.setting_key === "language")?.setting_value;
        const savedName = data.settings?.find((setting) => setting.setting_key === "workspace_name")?.setting_value;
        if (mounted && typeof savedLanguage === "string") setLanguage(savedLanguage);
        if (mounted && typeof savedName === "string") {
          setWorkspaceName(savedName);
          setNameDraft(savedName);
        }
      })
      .catch((error) => { console.error(error); if (mounted) setSettingsError("Preferences could not be loaded."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [loadAttempt]);
  const showSetting = (name) => {
    const key = `preference_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
    persistSetting(key, { enabled: true, updatedAt: new Date().toISOString() }).then(() => showToast(`${name} preference saved`)).catch((error) => {
      console.error(error);
      showToast(`${name} preference could not be saved`);
    });
  };
  const saveWorkspaceName = () => {
    const nextName = nameDraft.trim();
    if (!nextName) return;
    persistSetting("workspace_name", nextName).then(() => {
      setWorkspaceName(nextName);
      setEditingName(false);
      showToast("Workspace name saved");
    }).catch((error) => {
      console.error(error);
      showToast("Workspace name could not be saved");
    });
  };
  if (loading) return <div className="standard-view"><PageIntro eyebrow="Workspace preferences" title="Profile & settings" description="Manage your merchant identity, security, and notifications." /><ProfileSkeleton /></div>;
  if (settingsError) return <div className="standard-view"><PageIntro eyebrow="Workspace preferences" title="Profile & settings" description="Manage your merchant identity, security, and notifications." /><div className="panel error-state" role="alert"><CircleHelp size={20} /><h3>We couldn’t load settings</h3><p>{settingsError}</p><button className="outline-button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Try again</button></div></div>;
  return <div className="standard-view"><PageIntro eyebrow="Workspace preferences" title="Profile & settings" description="Manage your merchant identity, security, and notifications." action={<button className="outline-button" onClick={() => showToast("Support center opened")}><CircleHelp size={16} /> Help center</button>} /><div className="profile-layout"><div className="panel profile-card"><div className="profile-cover" /><div className="profile-card-body"><div className="profile-avatar xl">M</div><span className="verified-badge"><ShieldCheck size={14} /> Workspace profile</span><h3>{workspaceName}</h3><p>Workspace identity and preferences are saved here.</p>{editingName ? <div className="profile-edit-form"><input aria-label="Workspace name" value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} /><div className="review-actions"><button className="outline-button" onClick={() => { setEditingName(false); setNameDraft(workspaceName); }}>Cancel</button><button className="primary-button" onClick={saveWorkspaceName}>Save</button></div></div> : <button className="outline-button" onClick={() => setEditingName(true)}><Pencil size={15} /> Edit workspace</button>}<div className="profile-contact"><div><Smartphone size={16} /><span>Phone number · Workspace record</span></div><div><BriefcaseBusiness size={16} /><span>Merchant ID · Workspace record</span></div></div></div></div><div className="settings-sections"><SettingsSection title="Business account" items={[["Business details", "Save a preference", Store], ["Account information", "Account details in this workspace", WalletCards], ["Team members", "Save a preference", UsersRound]]} onSelect={showSetting} /></div><div className="settings-sections"><SettingsSection title="Security & preferences" items={[["Security", "Security settings", ShieldCheck], ["Notifications", "Save a preference", Bell]]} onSelect={showSetting} /><div className="setting-row language-row"><span className="setting-icon"><Settings2 size={17} /></span><div><strong>Language</strong><small>Choose your preferred language</small></div><select aria-label="Language" value={language} onChange={(event) => { setLanguage(event.target.value); persistSetting("language", event.target.value).then(() => showToast(`Language set to ${event.target.value}`)).catch((error) => { console.error(error); showToast("Language could not be saved"); }); }}><option>Français</option><option>English</option></select></div></div></div></div>;
}

function ProfileSkeleton() {
  return <div className="profile-layout loading-view" role="status" aria-label="Loading settings"><LoadingSkeleton className="skeleton-profile-card" /><LoadingSkeleton className="skeleton-settings-card" /></div>;
}

function SettingsSection({ title, items, onSelect }) {
  return <div className="settings-block"><span className="eyebrow">{title}</span>{items.map(([name, desc, Icon]) => <button className="setting-row" key={name} onClick={() => onSelect(name)}><span className="setting-icon"><Icon size={17} /></span><div><strong>{name}</strong><small>{desc}</small></div><ChevronRight size={17} /></button>)}</div>;
}

export default App;