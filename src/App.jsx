import {
  ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Bell, BookOpen,
  BriefcaseBusiness, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp,
  Clock3, Copy, CreditCard, Download, Eye, FileCheck2, Filter, Gift, Grid2X2, Home, LayoutDashboard,
  LoaderCircle, LockKeyhole, LogOut, MoreHorizontal, QrCode, ReceiptText,
  Pencil, ScanLine, Search, Send, Settings2, ShieldCheck, ShoppingBag, ShoppingCart, Smartphone, Store, UserRound,
  UsersRound, WalletCards, WalletMinimal, X, Zap,
} from "lucide-react";
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

const transactions = [
  { id: "TX-845210", name: "Binta Traoré", type: "Payment received", amount: "+ 18,500", time: "Today, 10:42", date: "24 April 2024 · 10:42", status: "Completed", tone: "success", channel: "Checkout", reference: "OM-PAY-845210", icon: ArrowDownLeft },
  { id: "TX-845197", name: "Issouf Kaboré", type: "Payment received", amount: "+ 7,250", time: "Today, 09:18", date: "24 April 2024 · 09:18", status: "Completed", tone: "success", channel: "Checkout", reference: "OM-PAY-845197", icon: ArrowDownLeft },
  { id: "TR-110482", name: "Airtel distribution", type: "Transfer sent", amount: "− 25,000", time: "Yesterday, 17:31", date: "23 April 2024 · 17:31", status: "Completed", tone: "neutral", channel: "Merchant transfer", reference: "OM-TRF-110482", icon: ArrowUpRight },
  { id: "TX-845101", name: "Mariam Ouédraogo", type: "Payment received", amount: "+ 42,000", time: "Yesterday, 16:08", date: "23 April 2024 · 16:08", status: "Pending", tone: "warning", channel: "QR payment", reference: "OM-PAY-845101", icon: ArrowDownLeft },
];

const cardReceiptTransaction = {
  id: "CI250616.1217.B95780",
  name: "Orange Money cash in",
  type: "Cash in",
  amount: "+ 1,000",
  time: "16 June 2025, 12:17",
  date: "16 June 2025 · 12:17",
  status: "Success",
  tone: "success",
  channel: "Retailer",
  reference: "CI250616.1217.B95780",
  details: { "Agent code": "219492", "Retailer phone": "74 741337", "Customer phone": "78 973040" },
  icon: ArrowDownLeft,
};

const activityEvents = [
  { date: "Today", items: [
    { title: "Payment received", detail: "Binta Traoré · Checkout", amount: "+ 18,500 FCFA", time: "10:42", icon: ArrowDownLeft, tone: "success", transactionId: "TX-845210" },
    { title: "Cash register opened", detail: "Opening balance · Main counter", amount: "50,000 FCFA", time: "08:01", icon: WalletMinimal, tone: "orange" },
  ]},
  { date: "Yesterday", items: [
    { title: "Transfer sent", detail: "Airtel distribution · Main account", amount: "− 25,000 FCFA", time: "17:31", icon: ArrowUpRight, tone: "neutral", transactionId: "TR-110482" },
    { title: "Payment received", detail: "Mariam Ouédraogo · QR payment", amount: "+ 42,000 FCFA", time: "16:08", icon: QrCode, tone: "success", transactionId: "TX-845101" },
    { title: "Signed in", detail: "Android device · Ouagadougou", amount: "", time: "07:55", icon: ShieldCheck, tone: "blue" },
  ]},
];

const formatNumber = (value) => new Intl.NumberFormat("fr-FR").format(Number(value || 0));
const normalizePhone = (value) => String(value || "").replace(/\D/g, "");
const isValidAmount = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
const isValidPhone = (value) => /^\d{8}$/.test(normalizePhone(value));
const DEMO_PIN = "1234";

const toPdfText = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^\x20-\x7E]/g, "-");

const escapePdfText = (value) => toPdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const downloadTransactionPdf = (transaction) => {
  const lines = [
    "ORANGE MONEY PAY - MERCHANT RECEIPT",
    "Sahel Market",
    "",
    `Transaction: ${transaction.id}`,
    `Type: ${transaction.type}`,
    `Amount: ${transaction.amount} FCFA`,
    `Status: ${transaction.status}`,
    `Date: ${transaction.date || transaction.time}`,
    `Reference: ${transaction.reference || transaction.id}`,
    `Channel: ${transaction.channel || "Merchant workspace"}`,
    `Counterparty: ${transaction.name}`,
    ...Object.entries(transaction.details || {}).map(([label, value]) => `${label}: ${value}`),
    "",
    "Demo receipt - no real funds were moved.",
  ];
  const content = [
    "BT",
    "/F1 12 Tf",
    "50 760 Td",
    ...lines.flatMap((line, index) => [`(${escapePdfText(line)}) Tj`, index < lines.length - 1 ? "0 -20 Td" : ""]),
    "ET",
  ].filter(Boolean).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${toPdfText(transaction.reference || transaction.id)}-receipt.pdf`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

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

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [pinModal, setPinModal] = useState(null);

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
  const openSecurity = () => setPinModal("confirm");
  const lockApp = () => {
    setPinModal(null);
    setIsLocked(true);
  };
  const isOrangeExperience = activeView === "orange-money" || activeView === "services" || activeView.startsWith("orange-");

  if (isLocked) {
    return <LockScreen onUnlock={() => { setIsLocked(false); setToast("App unlocked in demo mode"); }} />;
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} goTo={goTo} showToast={showToast} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main className={`main-shell ${activeView === "dashboard" ? "dashboard-shell" : ""} ${isOrangeExperience ? "orange-money-shell" : ""}`}>
        <Topbar activeView={activeView} onMenu={() => setMobileMenuOpen((open) => !open)}
          profileOpen={profileOpen} setProfileOpen={setProfileOpen}
          notificationsOpen={notificationsOpen} setNotificationsOpen={setNotificationsOpen} goTo={goTo} showToast={showToast} />
        <div className="main-content">
          <ViewRenderer activeView={activeView} goTo={goTo} showToast={showToast} openTransaction={openTransaction} selectedTransaction={selectedTransaction} onSecurity={openSecurity} onLock={lockApp} />
        </div>
      </main>
      <MobileNav activeView={activeView} goTo={goTo} />
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      {pinModal && <PinDialog mode={pinModal} onClose={() => setPinModal(null)} onSuccess={() => { setPinModal(null); showToast("PIN confirmed in demo mode"); }} onLock={lockApp} />}
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
        <button className="sidebar-account" onClick={() => showToast("Business account switcher is simulated in this demo")} aria-label="Open business account switcher">
          <div className="account-avatar">SM</div>
          <div><span>Sahel Market</span><small>Merchant account</small></div><ChevronDown size={16} />
        </button>
        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.slice(0, 6).map((item) => <NavItem key={item.id} item={item} activeView={activeView} goTo={goTo} />)}
          <p className="nav-label nav-label-spaced">Manage</p>
          {navItems.slice(6).map((item) => <NavItem key={item.id} item={item} activeView={activeView} goTo={goTo} />)}
        </nav>
        <div className="sidebar-bottom">
          <button className="sidebar-link" onClick={() => goTo("profile")}><Settings2 size={18} /><span>Settings</span></button>
          <button className="sidebar-help" onClick={() => showToast("Support center opened in demo mode")}><CircleHelp size={17} /><div><strong>Need help?</strong><span>Visit support center</span></div><ChevronRight size={15} /></button>
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
    <Icon size={18} strokeWidth={activeView === item.id ? 2.4 : 1.9} /><span>{item.label}</span>{item.id === "activity" && <span className="nav-dot" />}
  </button>;
}

function Topbar({ activeView, onMenu, profileOpen, setProfileOpen, notificationsOpen, setNotificationsOpen, goTo, showToast }) {
  const [notificationCount, setNotificationCount] = useState(15);
  const orangeTitles = { "orange-send-money": "Send money", "orange-withdraw-money": "Withdraw money", "orange-pay-purchases": "Pay for purchases", "orange-buy-credit": "Buy credit", "orange-virtual-card": "Virtual card", "orange-card-receipt": "Receipt", services: "Services" };
  const title = activeView === "dashboard" ? "Overview" : activeView === "orange-money" ? "Orange Money" : orangeTitles[activeView] || orangeServiceConfigs[activeView]?.title || navItems.find((item) => item.id === activeView)?.label || "Settings";
  const isOrangeExperience = activeView === "orange-money" || activeView === "services" || activeView.startsWith("orange-");
  const displayedNotificationCount = isOrangeExperience && notificationCount > 0 ? 11 : notificationCount;
  return (
    <header className={`topbar ${activeView === "dashboard" ? "dashboard-topbar" : ""} ${isOrangeExperience ? "orange-money-topbar" : ""}`}>
      <div className="topbar-title"><button className="menu-trigger mobile-only" onClick={onMenu} aria-label="Open navigation"><Grid2X2 size={20} /></button><div className="mobile-topbar-brand mobile-only" aria-label="Merchant workspace"><OrangeLogo /></div>
        <div className="topbar-heading"><span className="eyebrow">Merchant workspace</span><h1>{title}</h1></div></div>
      <div className="topbar-actions">
        <div className="connection-pill"><span className="live-dot" /> All systems operational</div>
        <button className="icon-button mobile-only" onClick={() => goTo("activity")} aria-label="Search activity"><Search size={18} /></button>
        <button className={`icon-button ${notificationsOpen ? "selected" : ""}`} onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false); }} aria-label={`Notifications${displayedNotificationCount ? `, ${displayedNotificationCount} unread` : ""}`}><Bell size={19} />{displayedNotificationCount > 0 && <span className="notification-badge">{displayedNotificationCount}</span>}</button>
        <button className="icon-button mobile-only" onClick={() => showToast("Help center opened in demo mode")} aria-label="Help"><CircleHelp size={18} /></button>
        <div className="profile-wrap">
          <button className="profile-button" onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false); }} aria-expanded={profileOpen}><span className="profile-avatar"><span className="profile-initials">SM</span><UserRound className="mobile-avatar-icon" size={20} /></span><span className="profile-name">Seydou M.</span><ChevronDown size={15} /></button>
          {profileOpen && <div className="popover profile-popover">
            <div className="popover-user"><div className="profile-avatar large">SM</div><div><strong>Seydou Maïga</strong><span>Store manager</span></div></div>
            <button onClick={() => goTo("profile")}><UserRound size={16} /> My profile</button><button onClick={() => goTo("profile")}><Settings2 size={16} /> Settings</button>
            <div className="popover-divider" /><button className="danger-text" onClick={() => { setProfileOpen(false); showToast("Sign out is simulated in this demo"); }}><LogOut size={16} /> Sign out</button>
          </div>}
        </div>
        {notificationsOpen && <div className="popover notification-popover">
          <div className="popover-heading"><strong>Notifications</strong><button onClick={() => { setNotificationCount(0); showToast("All notifications marked as read"); }}>Mark all read</button></div>
          <div className="notification-item"><span className="notif-icon orange-bg"><WalletMinimal size={15} /></span><div><strong>Cash register reminder</strong><p>Your register is still open from today.</p><small>18 min ago</small></div></div>
          <div className="notification-item"><span className="notif-icon green-bg"><Check size={15} /></span><div><strong>Payment received</strong><p>42,000 FCFA from Mariam Ouédraogo.</p><small>Yesterday</small></div></div>
          <button className="view-all-button" onClick={() => goTo("activity")}>View all activity <ArrowRight size={14} /></button>
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

function ViewRenderer({ activeView, goTo, showToast, openTransaction, selectedTransaction, onSecurity, onLock }) {
  if (orangeServiceConfigs[activeView]) return <OrangeMoneyServiceDetailView serviceId={activeView} goTo={goTo} showToast={showToast} />;
  switch (activeView) {
    case "orange-money": return <OrangeMoneyView goTo={goTo} showToast={showToast} />;
    case "orange-send-money":
    case "orange-withdraw-money":
    case "orange-pay-purchases":
    case "orange-buy-credit":
    case "orange-virtual-card":
      return <OrangeMoneyFlowView flowId={activeView} goTo={goTo} showToast={showToast} />;
    case "orange-card-receipt": return <OrangeMoneyReceiptView goTo={goTo} showToast={showToast} openTransaction={openTransaction} />;
    case "services": return <OrangeMoneyServicesView goTo={goTo} showToast={showToast} />;
    case "collections": return <CollectionsView showToast={showToast} openTransaction={openTransaction} />;
    case "transfers": return <TransfersView showToast={showToast} openTransaction={openTransaction} />;
    case "qr": return <QrView showToast={showToast} />;
    case "register": return <RegisterView showToast={showToast} />;
    case "revenue": return <RevenueView showToast={showToast} />;
    case "activity": return <ActivityView showToast={showToast} openTransaction={openTransaction} />;
    case "verify": return <VerifyView showToast={showToast} />;
    case "profile": return <ProfileView showToast={showToast} onSecurity={onSecurity} onLock={onLock} />;
    case "transaction-detail": return <TransactionDetailView transaction={selectedTransaction} goTo={goTo} showToast={showToast} />;
    default: return <Dashboard goTo={goTo} showToast={showToast} openTransaction={openTransaction} />;
  }
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
  const [pdfState, setPdfState] = useState("idle");
  if (!transaction) {
    return <div className="standard-view"><div className="panel empty-state"><span className="empty-icon"><ReceiptText size={22} /></span><h3>Transaction not found</h3><p>Return to Activity to choose a transaction.</p><button className="primary-button" onClick={() => goTo("activity")}>Back to activity <ArrowRight size={15} /></button></div></div>;
  }
  const Icon = transaction.icon || ReceiptText;
  const isPositive = transaction.amount?.startsWith("+");
  const handleDownload = () => {
    setPdfState("loading");
    window.setTimeout(() => {
      try {
        downloadTransactionPdf(transaction);
        setPdfState("success");
        showToast("Receipt PDF downloaded");
      } catch (error) {
        console.error(error);
        setPdfState("error");
        showToast("Receipt PDF could not be created");
      }
    }, 260);
  };
  return <div className="standard-view transaction-detail-view">
    <button className="back-link" onClick={() => goTo(transaction.origin || "activity")}><ArrowLeft size={16} /> Back to {transaction.origin === "dashboard" ? "overview" : transaction.origin === "orange-card-receipt" ? "receipt" : "activity"}</button>
    <div className="transaction-detail-header"><div><span className="eyebrow">Transaction details</span><h2>{transaction.type}</h2><p>Review the complete record for this merchant activity.</p></div><button className="primary-button" onClick={handleDownload} disabled={pdfState === "loading"}>{pdfState === "loading" ? <LoaderCircle className="spin" size={16} /> : <Download size={16} />} {pdfState === "loading" ? "Preparing PDF…" : "Download receipt"}</button></div>
    {pdfState === "error" && <p className="form-error" role="alert">The PDF could not be prepared. Please try again.</p>}
    {pdfState === "success" && <p className="download-success" role="status"><Check size={15} /> Receipt PDF is ready in your downloads.</p>}
    <div className="transaction-detail-grid">
      <section className="panel transaction-summary-card"><span className={`transaction-detail-icon ${transaction.tone}`}><Icon size={22} /></span><span className="eyebrow">{transaction.status}</span><h3>{transaction.name}</h3><strong className={`transaction-detail-amount ${isPositive ? "positive" : ""}`}>{transaction.amount} <small>FCFA</small></strong><span className={`status-chip ${transaction.tone}`}>{transaction.status}</span><p className="transaction-detail-note">Demo record — no real funds were moved.</p></section>
      <section className="panel transaction-information"><div className="panel-header"><div><span className="eyebrow">Receipt information</span><h3>Transaction record</h3></div><ReceiptText size={20} className="heading-icon" /></div><div className="detail-list"><div><span>Reference</span><strong>{transaction.reference || transaction.id}</strong></div><div><span>Date</span><strong>{transaction.date || transaction.time}</strong></div><div><span>Channel</span><strong>{transaction.channel || "Merchant workspace"}</strong></div><div><span>Counterparty</span><strong>{transaction.name}</strong></div>{Object.entries(transaction.details || {}).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
    </div>
  </div>;
}

function PinEntry({ title, description, onSuccess, compact = false }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [faceIdLoading, setFaceIdLoading] = useState(false);
  const [showDemoPin, setShowDemoPin] = useState(false);
  const submit = (nextPin) => {
    if (nextPin.length < 4) return;
    if (nextPin === DEMO_PIN) {
      setError("");
      onSuccess();
      return;
    }
    setError("Code incorrect. Try again.");
    setPin("");
  };
  const addDigit = (digit) => {
    if (pin.length >= 4) return;
    const nextPin = `${pin}${digit}`;
    setPin(nextPin);
    setError("");
    if (nextPin.length === 4) window.setTimeout(() => submit(nextPin), 120);
  };
  const useFaceId = () => {
    setFaceIdLoading(true);
    window.setTimeout(() => { setFaceIdLoading(false); onSuccess(); }, 550);
  };
  return <div className={`pin-entry ${compact ? "pin-entry-compact" : ""}`}>
    <div className="pin-lock-mark"><LockKeyhole size={21} /></div>
    <h2>{title}</h2><p>{description}</p>
    <div className={`pin-dots ${error ? "has-error" : ""}`} aria-label={`${pin.length} of 4 digits entered`}>{[0, 1, 2, 3].map((index) => <span className={index < pin.length ? "filled" : ""} key={index}>{index < pin.length && visible ? pin[index] : ""}</span>)}</div>
    {error && <p className="pin-error" role="alert">{error}</p>}
    <button className="pin-visibility" onClick={() => setVisible((value) => !value)}><Eye size={15} /> {visible ? "Hide digits" : "Show digits"}</button>
    <div className="pin-keypad" aria-label="PIN keypad">{["1","2","3","4","5","6","7","8","9"].map((digit) => <button key={digit} onClick={() => addDigit(digit)}>{digit}</button>)}<button className="pin-face-id" onClick={useFaceId} disabled={faceIdLoading} aria-label="Use Face ID demo">{faceIdLoading ? <LoaderCircle className="spin" size={20} /> : <span className="face-id-art">⌁</span>}</button><button onClick={() => addDigit("0")}>0</button><button className="pin-delete" onClick={() => { setPin((value) => value.slice(0, -1)); setError(""); }} aria-label="Delete last digit">⌫</button></div>
    <button className="pin-forgot" onClick={() => setShowDemoPin((value) => !value)}>Code oublié ?</button>
    {showDemoPin && <p className="pin-demo-note">Demo code: <strong>1234</strong></p>}
  </div>;
}

function PinDialog({ mode, onClose, onSuccess, onLock }) {
  return <div className="modal-scrim pin-scrim"><div className="pin-dialog" role="dialog" aria-modal="true" aria-labelledby="pin-title"><button className="modal-close" onClick={onClose} aria-label="Close PIN dialog"><X size={18} /></button><PinEntry title="Confirmez votre code PIN" description="Saisissez votre code à 4 chiffres pour continuer." onSuccess={onSuccess} /><div className="pin-dialog-footer"><span><ShieldCheck size={14} /> Demo only — this is not payment authentication.</span>{mode === "confirm" && <button onClick={onLock}><LockKeyhole size={14} /> Lock app now</button>}</div></div></div>;
}

function LockScreen({ onUnlock }) {
  return <div className="lock-screen"><div className="lock-screen-brand"><OrangeLogo /><span>Merchant workspace</span></div><PinEntry title="Application verrouillée" description="Saisissez votre code PIN pour déverrouiller." onSuccess={onUnlock} compact /><p className="lock-screen-note">Code oublié ? This local demo uses 1234.</p></div>;
}

function Dashboard({ goTo, showToast, openTransaction }) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);
  if (loading) return <DashboardSkeleton />;
  return <div className="dashboard-view">
    <div className="desktop-dashboard">
    <section className="welcome-row"><div><span className="eyebrow">Wednesday, 24 April 2024</span><h2>Good morning, Seydou <span className="wave">✦</span></h2><p>Here’s what’s happening with your business today.</p></div><button className="outline-button date-button" onClick={() => showToast("Showing today’s activity")}><CalendarDays size={17} /> Today <ChevronDown size={15} /></button></section>
    <section className="dashboard-grid">
      <div className="balance-card"><div className="card-topline"><span>Primary account</span><button onClick={() => setBalanceVisible((visible) => !visible)}>{balanceVisible ? "Hide balance" : "Show balance"} <span className="eye-toggle">{balanceVisible ? "◉" : "○"}</span></button></div>
        <div className="balance-main"><span className="balance-amount">{balanceVisible ? "286,450" : "••••••"} <small>FCFA</small></span><span className="balance-status"><span className="live-dot" /> Available</span></div>
        <div className="balance-meta"><span>Account ending in <strong>· 4821</strong></span><span>Updated just now</span></div>
        <div className="balance-actions"><button onClick={() => goTo("transfers")}><ArrowUpRight size={16} /> Transfer</button><button onClick={() => goTo("collections")}><ArrowDownLeft size={16} /> Collect payment</button></div>
      </div>
      <div className="quick-actions-card"><div className="section-heading"><div><span className="eyebrow">Quick actions</span><h3>Move money faster</h3></div><Zap size={20} className="heading-icon" /></div>
        <div className="quick-action-grid"><button onClick={() => goTo("collections")}><span className="action-icon orange-icon"><ArrowDownLeft size={20} /></span><strong>Collect</strong><small>Request a payment</small></button><button onClick={() => goTo("transfers")}><span className="action-icon blue-icon"><ArrowUpRight size={20} /></span><strong>Transfer</strong><small>Send money securely</small></button><button onClick={() => goTo("qr")}><span className="action-icon dark-icon"><QrCode size={20} /></span><strong>My QR</strong><small>Show & share</small></button></div>
      </div>
    </section>
    <section className="stats-row"><StatCard label="Today’s collections" value="67,750" suffix="FCFA" trend="+12.8%" trendText="vs yesterday" icon={ArrowDownLeft} tone="green" /><StatCard label="Transactions" value="24" suffix="" trend="+4" trendText="vs yesterday" icon={ReceiptText} tone="blue" /><StatCard label="This month’s revenue" value="1,842,500" suffix="FCFA" trend="+8.4%" trendText="vs last month" icon={BarChart3} tone="orange" /></section>
     <section className="content-grid"><div className="panel recent-panel"><div className="panel-header"><div><span className="eyebrow">Latest activity</span><h3>Recent transactions</h3></div><button className="text-button" onClick={() => goTo("activity")}>View activity <ArrowRight size={15} /></button></div><TransactionList compact showToast={showToast} openTransaction={openTransaction} /></div>
       <div className="panel register-summary"><div className="panel-header"><div><span className="eyebrow">Today’s operations</span><h3>Cash register</h3></div><button className="more-button" onClick={() => showToast("Register actions are available in Cash register")} aria-label="More cash register actions"><MoreHorizontal size={18} /></button></div><div className="register-status"><span className="status-check"><Check size={18} /></span><div><strong>Register is open</strong><p>Opened at 08:01 by Seydou</p></div></div><div className="register-total"><span>Current cash balance</span><strong>124,500 <small>FCFA</small></strong></div><div className="register-breakdown"><div><span>Opening balance</span><strong>50,000</strong></div><div><span>Cash sales</span><strong className="positive">+ 74,500</strong></div></div><button className="wide-outline-button" onClick={() => goTo("register")}>Manage register <ArrowRight size={15} /></button></div>
    </section>
    </div>
    <MobileDashboard goTo={goTo} showToast={showToast} />
  </div>;
}

function MobileDashboard({ goTo, showToast }) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const shortcuts = [
    { label: "Buy a bundle", icon: Smartphone, action: () => goTo("orange-buy-credit") },
    { label: "Top up credit", icon: ArrowDownLeft, action: () => goTo("orange-buy-credit") },
    { label: "Pay your bills", icon: ReceiptText, action: () => goTo("services") },
    { label: "Send money", icon: ArrowUpRight, action: () => goTo("orange-send-money") },
  ];

  return <div className="mobile-dashboard">
    <section className="mobile-greeting"><span>Welcome,</span><strong>657490618</strong></section>
    <div className="mobile-balance-card">
      <button className="mobile-qr-thumb" onClick={() => goTo("qr")} aria-label="Open merchant QR"><QrGraphic /><span className="qr-center-mark orange-qr-center"><OrangeQrLogo /></span></button>
      <div className="mobile-balance-copy"><span className="mobile-balance-label"><span className="mobile-mini-mark" /> Primary balance</span><span className="mobile-balance-value"><button type="button" className="mobile-eye" onClick={() => setBalanceVisible((visible) => !visible)} aria-label={balanceVisible ? "Hide balance" : "Show balance"}><Eye size={14} /></button>{balanceVisible ? "286,450 FCFA" : "****** FCFA"}</span><button className="mobile-transactions" onClick={() => goTo("activity")}>My transactions <ChevronRight size={15} /></button></div>
      <span className="mobile-qr-caption">Scan and pay</span>
    </div>
    <button className="mobile-credit-row" onClick={() => showToast("Credit balance opened in demo mode")}><span>Credit</span><span className="mobile-credit-value"><span className="mobile-eye"><Eye size={14} /></span> ****** U</span><ChevronRight size={18} /></button>
     <section className="mobile-shortcuts" aria-label="Quick actions">{shortcuts.map(({ label, icon: Icon, message, action }) => <button key={label} onClick={() => action ? action() : showToast(message)}><span className="mobile-shortcut-icon"><Icon size={20} /></span><span>{label}</span></button>)}</section>
    <section className="mobile-offers"><div className="mobile-section-heading"><h2>My Offers</h2><button onClick={() => showToast("More offers opened in demo mode")} aria-label="View more offers"><ChevronRight size={18} /></button></div><button className="mobile-offer-hero" onClick={() => showToast("Max it TV opened in demo mode")}><span className="mobile-offer-mark"><span /><span /><span /></span><span className="mobile-offer-copy"><strong>Max it TV</strong><small>Your favourite entertainment<br />in one place</small></span><span className="mobile-offer-shape" /><ChevronRight className="mobile-offer-arrow" size={21} /></button><div className="mobile-offer-grid"><button className="mobile-offer-tile offer-uefa" onClick={() => showToast("UEFA offer opened in demo mode")}><strong>UEFA<br />CHAMPIONS<br />LEAGUE</strong><span>Watch</span></button><button className="mobile-offer-tile offer-orange" onClick={() => showToast("Exclusive offers opened in demo mode")}><span className="offer-tile-icon">✦</span><strong>Exclusive<br />offers</strong><small>Discover <ChevronRight size={9} /></small></button><button className="mobile-offer-tile offer-market" onClick={() => showToast("Promos and benefits opened in demo mode")}><span className="offer-tile-icon">◆</span><strong>Promos &<br />benefits</strong><small>Discover <ChevronRight size={9} /></small></button></div></section>
  </div>;
}

function OrangeMoneyView({ goTo, showToast }) {
  return <>
    <div className="desktop-orange-money-page"><CollectionsView showToast={showToast} /></div>
    <MobileOrangeMoneyPage goTo={goTo} showToast={showToast} />
  </>;
}

const orangeServices = [
  { label: "OM Loyalty", icon: Gift, route: "orange-service-loyalty", message: "OM Loyalty opened in demo mode" },
  { label: "Manage money", icon: WalletCards, route: "orange-service-manage-money", message: "Manage money opened in demo mode" },
  { label: "OM Boost", icon: Zap, route: "orange-service-boost", message: "OM Boost opened in demo mode" },
  { label: "Loans", icon: FileCheck2, route: "orange-service-loans", message: "Loans opened in demo mode" },
  { label: "Bills", icon: ReceiptText, route: "orange-service-bills", message: "Bills opened in demo mode" },
  { label: "Buy airtime", icon: Smartphone, route: "orange-service-airtime", message: "Buy airtime opened in demo mode" },
  { label: "Data bundles", icon: Smartphone, route: "orange-service-data", message: "Data bundles opened in demo mode" },
  { label: "TV & internet", icon: WalletCards, route: "orange-service-tv", message: "TV and internet opened in demo mode" },
  { label: "School fees", icon: BriefcaseBusiness, route: "orange-service-school", message: "School fees opened in demo mode" },
  { label: "Insurance", icon: ShieldCheck, route: "orange-service-insurance", message: "Insurance opened in demo mode" },
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
    success: "Your money management request is ready in this demo.",
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
    success: "You are eligible to check an OM Boost offer in this demo.",
    fields: [],
  },
  "orange-service-loans": {
    title: "Loans",
    eyebrow: "Borrow money",
    description: "Review an Orange Money loan request with a simple, transparent summary.",
    icon: FileCheck2,
    action: "Review loan request",
    success: "Your loan request is ready for review in this demo.",
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
    success: "Your bill payment is ready for confirmation in this demo.",
    fields: [
      { name: "biller", label: "Bill provider", type: "select", options: ["ONEA water", "SONABEL electricity", "Canal+"] },
      { name: "customer", label: "Customer or contract number", type: "text", placeholder: "Enter the number" },
      { name: "amount", label: "Amount", type: "amount", placeholder: "0" },
    ],
  },
  "orange-service-data": {
    title: "Data bundles",
    eyebrow: "Stay connected",
    description: "Choose a data bundle and top up an Orange number instantly.",
    icon: Smartphone,
    action: "Review bundle",
    success: "Your data bundle purchase is ready in this demo.",
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
    success: "Your airtime purchase is ready in this demo.",
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
    success: "Your subscription payment is ready in this demo.",
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
    success: "Your school fee payment is ready in this demo.",
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
    success: "Insurance options are ready to explore in this demo.",
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
    showToast(`${config.title} completed in demo mode`, {
      type: "transaction_completed",
      payload: { flowId, amount: amount || null, phone: phone || null, merchant: merchant || null, note: note || null, location: location || null },
    });
  };

  return <div className="mobile-orange-flow-page">
    <div className="mobile-flow-header"><button onClick={() => goTo("orange-money")}><ArrowLeft size={18} /> Orange Money</button><OrangeQrLogo /></div>
    <section className="mobile-flow-title"><span className={`mobile-flow-icon flow-icon-${config.visual}`}><MobileMoneyFavoriteArt type={config.visual} /></span><div><span>{config.eyebrow}</span><h1>{config.title}</h1><p>{config.description}</p></div></section>
    <div className="mobile-flow-balance"><span><OrangeQrLogo /> Primary balance</span><strong>286,450 <small>FCFA</small></strong></div>
    {step === "success" ? <MobileMoneyFlowSuccess config={config} amount={amount} phone={phone} merchant={merchant} reset={reset} goTo={goTo} /> : step === "review" ? <section className="mobile-flow-card"><div className="mobile-flow-card-heading"><span>Review details</span><strong>Check before confirming</strong></div><div className="mobile-flow-summary">{config.phoneLabel && <div><span>{config.phoneLabel}</span><strong>+226 {phone}</strong></div>}{config.merchantLabel && <div><span>{config.merchantLabel}</span><strong>{merchant}</strong></div>}{flowId === "orange-withdraw-money" && <div><span>Withdrawal point</span><strong>{location}</strong></div>}<div><span>Amount</span><strong>{formatNumber(amount)} FCFA</strong></div>{note && <div><span>{config.noteLabel}</span><strong>{note}</strong></div>}</div><div className="mobile-flow-actions"><button className="mobile-flow-secondary" onClick={() => setStep("form")}><ArrowLeft size={16} /> Edit</button><button className="mobile-flow-primary" onClick={confirm}>Confirm {config.title.toLowerCase()} <ArrowRight size={16} /></button></div></section> : <section className="mobile-flow-card"><div className="mobile-flow-card-heading"><span>Enter details</span><strong>Step 1 of 2</strong></div>{!isCard && <label className="mobile-flow-field">Amount <em>*</em><div className={`mobile-flow-input-suffix ${formMessage && !isValidAmount(amount) ? "has-error" : ""}`}><input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(event) => { setAmount(event.target.value); setFormMessage(""); }} /><span>FCFA</span></div></label>}{config.phoneLabel && <label className="mobile-flow-field">{config.phoneLabel} <em>*</em><div className="mobile-flow-input-prefix"><span>+226</span><input type="tel" inputMode="tel" placeholder={config.phonePlaceholder} value={phone} onChange={(event) => { setPhone(normalizePhone(event.target.value).slice(0, 8)); setFormMessage(""); }} /></div></label>}{config.merchantLabel && <label className="mobile-flow-field">{config.merchantLabel} <em>*</em><input type="text" placeholder={config.merchantPlaceholder} value={merchant} onChange={(event) => { setMerchant(event.target.value); setFormMessage(""); }} /></label>}{flowId === "orange-withdraw-money" && <label className="mobile-flow-field">{config.selectLabel}<select value={location} onChange={(event) => setLocation(event.target.value)}><option>Ouagadougou · Patte d’Oie</option><option>Ouagadougou · 1200 Logements</option><option>Bobo-Dioulasso · Centre</option></select></label>}<label className="mobile-flow-field">{config.noteLabel} <small>Optional</small><input type="text" placeholder={config.notePlaceholder} value={note} onChange={(event) => setNote(event.target.value)} /></label>{formMessage && <p className="mobile-flow-error" role="alert">{formMessage}</p>}<button className="mobile-flow-primary mobile-flow-submit" onClick={handleContinue}>{config.primary} <ArrowRight size={16} /></button><p className="mobile-flow-secure"><ShieldCheck size={15} /> Demo only — no money will be moved.</p></section>}
  </div>;
}

function MobileMoneyFlowSuccess({ config, amount, phone, merchant, reset, goTo }) {
  return <section className="mobile-flow-success"><span className="mobile-flow-success-icon"><Check size={26} /></span><span className="eyebrow">Demo complete</span><h2>{config.title} ready</h2><p>{config.title === "Virtual card" ? "Your virtual card is ready to view in this demo." : `${formatNumber(amount)} FCFA is ready for this demo ${config.title.toLowerCase()}.`}</p><div className="mobile-flow-success-detail">{phone && <span><small>Number</small><strong>+226 {phone}</strong></span>}{merchant && <span><small>Merchant</small><strong>{merchant}</strong></span>}<span><small>Status</small><strong>Completed</strong></span></div><button className="mobile-flow-primary" onClick={() => { reset(); goTo("orange-money"); }}>Back to Orange Money <ArrowRight size={16} /></button></section>;
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
      <div className="prepaid-card-balance"><span>Card balance</span><strong>{balanceVisible ? "286,450" : "••••••••"} <small>FCFA</small></strong></div>
      <span className="prepaid-card-rainbow" />
      <div className="prepaid-card-bottom"><span>••••</span><span>••••</span><span>••••</span><span>••••</span><span>••••••••••••</span><span>CVC •••</span><span className="mastercard-circles"><i /><i /></span></div>
      <button className="prepaid-card-eye" onClick={() => setBalanceVisible((visible) => !visible)} aria-label={balanceVisible ? "Hide card balance" : "Show card balance"}><Eye size={17} /></button>
    </section>
    <div className="prepaid-card-actions">
      <button onClick={() => showToast("Card details opened in demo mode")}><span className="prepaid-action-icon eye-art"><Eye size={22} /></span><span>View card<br />details</span></button>
      <button onClick={() => goTo("orange-send-money")}><span className="prepaid-action-icon transfer-art"><ArrowUpRight size={22} /></span><span>Transfer to<br />my account</span></button>
      <button onClick={() => showToast("Card recharge opened in demo mode")}><span className="prepaid-action-icon recharge-art"><CreditCard size={21} /><PlusBadge /></span><span>Recharge<br />my card</span></button>
      <button onClick={() => showToast("Card management opened in demo mode")}><span className="prepaid-action-icon settings-art"><Settings2 size={22} /></span><span>Manage<br />my card</span></button>
    </div>
    <section className="card-transactions-section">
      <div className="mobile-card-section-heading"><h2>My transactions</h2><button onClick={() => showToast("All card transactions opened in demo mode")}>View all <ChevronRight size={17} /></button></div>
      <div className="card-transaction-list">
        <button onClick={() => goTo("orange-card-receipt")}><span className="card-transaction-icon"><ReceiptText size={22} /></span><span><strong>Card recharge</strong><small>Today at 17:39</small></span><b>+2,500 FCFA</b><ChevronRight size={18} /></button>
        <button onClick={() => goTo("orange-card-receipt")}><span className="card-transaction-icon"><ReceiptText size={22} /></span><span><strong>Card recharge</strong><small>Today at 17:03</small></span><b>+119,000 FCFA</b><ChevronRight size={18} /></button>
      </div>
    </section>
    <button className="card-security-note" onClick={() => showToast("Card security information opened in demo mode")}><span><LockKeyhole size={22} /></span><div><strong>Keep your card safe</strong><p>Never share your card details with anyone.</p></div><ChevronRight size={19} /></button>
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
    <div className="mobile-flow-balance"><span><OrangeQrLogo /> Primary balance</span><strong>286,450 <small>FCFA</small></strong></div>
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
    showToast(`${config.title} completed in demo mode`, {
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
    <div className="mobile-flow-balance"><span><OrangeQrLogo /> Primary balance</span><strong>286,450 <small>FCFA</small></strong></div>
    {step === "success" ? <section className="mobile-flow-success">
      <span className="mobile-flow-success-icon"><Check size={26} /></span>
      <span className="eyebrow">Demo complete</span>
      <h2>{config.title} ready</h2>
      <p>{config.success}</p>
      <div className="mobile-flow-success-detail"><span><small>Service</small><strong>{config.title}</strong></span><span><small>Status</small><strong>Completed</strong></span></div>
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
      <p className="mobile-flow-secure"><ShieldCheck size={15} /> Demo only — no money will be moved.</p>
    </section>}
  </div>;
}

function MobileOrangeMoneyPage({ goTo, showToast }) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const favoriteItems = [
    { label: "Send money", visual: "send", action: () => goTo("orange-send-money") },
    { label: "Withdraw money", visual: "withdraw", action: () => goTo("orange-withdraw-money") },
    { label: "Pay for purchases", visual: "purchases", action: () => goTo("orange-pay-purchases") },
    { label: "Buy credit", visual: "credit", action: () => goTo("orange-buy-credit") },
    { label: "Virtual card", visual: "card", action: () => goTo("orange-virtual-card") },
  ];
  return <div className="mobile-orange-money-page">
    <section className="mobile-money-number-card">
      <OrangeLogo />
      <div><span>My number</span><strong>237696015584</strong></div>
      <button onClick={() => showToast("Phone number copied to clipboard")} aria-label="Copy phone number"><Copy size={18} /></button>
    </section>
    <section className="mobile-money-balance-card">
      <button className="mobile-money-qr" onClick={() => goTo("qr")} aria-label="Open merchant QR"><QrGraphic /><span className="qr-center-mark orange-qr-center"><OrangeQrLogo /></span></button>
      <div className="mobile-money-balance-copy">
        <span className="mobile-money-balance-label"><OrangeQrLogo /> Primary balance <button className="mobile-money-balance-menu" onClick={() => showToast("Balance accounts opened in demo mode")} aria-label="Open balance accounts"><ChevronDown size={18} /></button></span>
        <span className="mobile-money-balance-value"><button className="mobile-eye-button" onClick={() => setBalanceVisible((visible) => !visible)} aria-label={balanceVisible ? "Hide balance" : "Show balance"}><Eye size={21} /></button>{balanceVisible ? "286,450" : "******"} <small>FCFA</small></span>
        <button className="mobile-money-transactions" onClick={() => goTo("activity")}>My transactions <ChevronRight size={18} /></button>
      </div>
      <span className="mobile-money-qr-caption">Scan and pay</span>
    </section>
    <section className="mobile-money-section">
      <div className="mobile-money-section-heading"><h2>My favorites</h2><button onClick={() => showToast("Favorite shortcuts customization opened in demo mode")}>Customize <Pencil size={14} /></button></div>
      <div className="mobile-money-favorites">{favoriteItems.map(({ label, visual, action, message }) => <button key={label} onClick={() => action ? action() : showToast(message)}><span className={`mobile-money-favorite-icon favorite-${visual}`}><MobileMoneyFavoriteArt type={visual} /></span><span>{label}</span></button>)}</div>
    </section>
    <section className="mobile-money-section mobile-money-services-section">
      <div className="mobile-money-section-heading"><h2>Services</h2><button onClick={() => goTo("services")}>View all <ChevronRight size={17} /></button></div>
      <div className="mobile-money-services">{orangeServices.slice(0, 5).map(({ label, icon: Icon, route, message }) => <button key={label} onClick={() => route ? goTo(route) : showToast(message)}><span className={`mobile-money-service-icon service-${label.toLowerCase().replace(" ", "-")}`}><Icon size={26} /></span><span>{label}</span></button>)}</div>
    </section>
    <section className="mobile-money-promo">
      <div><strong>More than a wallet</strong><p>Pay, save, borrow<br />and much more.</p><button onClick={() => showToast("Orange Money discovery opened in demo mode")}>Discover Orange Money</button></div>
      <span className="mobile-money-promo-phone"><span className="mobile-money-promo-screen"><OrangeLogo /><i /></span></span>
      <span className="mobile-money-promo-orb orb-one" /><span className="mobile-money-promo-orb orb-two" /><span className="mobile-money-promo-coin">●</span>
    </section>
  </div>;
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

function TransactionList({ showToast, openTransaction }) {
  return <div className="transaction-list">{transactions.map((transaction) => { const Icon = transaction.icon; return <button className="transaction-row" key={transaction.id} onClick={() => openTransaction ? openTransaction(transaction) : showToast(`Opened ${transaction.id}`)}><span className={`transaction-icon ${transaction.tone}`}><Icon size={16} /></span><span className="transaction-copy"><strong>{transaction.name}</strong><small>{transaction.type} <span>·</span> {transaction.time}</small></span><span className={`transaction-amount ${transaction.amount.startsWith("+") ? "positive" : ""}`}>{transaction.amount} <small>FCFA</small><em className={`status-chip ${transaction.tone}`}>{transaction.status}</em></span><ChevronRight size={16} className="row-chevron" /></button>; })}</div>;
}

function CollectionsView({ showToast, openTransaction }) {
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("");
  const [customer, setCustomer] = useState("");
  const [note, setNote] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const amountInvalid = amount !== "" && !isValidAmount(amount);
  const customerInvalid = customer !== "" && !isValidPhone(customer);
  const reset = () => { setStep("form"); setAmount(""); setCustomer(""); setNote(""); setFormMessage(""); };
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
  if (step === "success") return <SuccessState type="collection" amount={amount} customer={customer || "Customer"} reset={reset} showToast={showToast} openTransaction={openTransaction} />;
  return <div className="flow-view">
    <PageIntro eyebrow="Payments" title="Collect a payment" description="Create a secure payment request for your customer." action={<button className="soft-button" onClick={reset}><ReceiptText size={16} /> New collection</button>} />
    <FlowSteps active={step === "form" ? 0 : step === "review" ? 1 : 2} labels={["Payment details", "Review", "Complete"]} />
     {step === "processing" ? <ProcessingState label="Waiting for payment" detail="Your customer is completing the payment request." /> : step === "review" ? <CollectionReview amount={amount} customer={customer} note={note} onBack={() => setStep("form")} onConfirm={() => { setStep("processing"); window.setTimeout(() => { setStep("success"); showToast("Payment request saved", { type: "transaction_completed", payload: { flowId: "collect-payment", amount, phone: customer, note: note || null } }); }, 1300); }} /> : <div className="flow-grid"><div className="panel form-panel"><div className="panel-header"><div><span className="eyebrow">Step 1 of 2</span><h3>Payment details</h3></div><span className="required-note">All fields marked * are required</span></div><label className="field-label">Amount <span>*</span><div className={`input-with-suffix ${amountInvalid ? "has-error" : ""}`}><input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(event) => { setAmount(event.target.value); setFormMessage(""); }} min="1" aria-invalid={amountInvalid} /><span>FCFA</span></div>{amountInvalid && <small className="field-error">Amount must be greater than 0.</small>}</label><label className="field-label">Customer phone number <span>*</span><div className={`input-with-prefix ${customerInvalid ? "has-error" : ""}`}><span>+226</span><input type="tel" inputMode="tel" autoComplete="tel-national" placeholder="70 00 00 00" value={customer} onChange={(event) => { setCustomer(event.target.value); setFormMessage(""); }} aria-invalid={customerInvalid} /></div>{customerInvalid && <small className="field-error">Use 8 digits, for example 70 00 00 00.</small>}</label><label className="field-label">Reference <small>Optional</small><input type="text" placeholder="e.g. Order #1042" value={note} onChange={(event) => setNote(event.target.value)} /></label><button className="primary-button form-submit" disabled={!amount || !customer} onClick={handleContinue}>Continue to review <ArrowRight size={16} /></button>{formMessage && <p className="form-error" role="alert">{formMessage}</p>}<p className="secure-note"><ShieldCheck size={15} /> Your customer will receive a secure payment prompt.</p></div><div className="panel side-info-panel"><span className="info-symbol"><Smartphone size={19} /></span><h3>How it works</h3><ol><li><span>1</span><div><strong>Enter the amount</strong><p>Tell us how much your customer needs to pay.</p></div></li><li><span>2</span><div><strong>Send the request</strong><p>They’ll confirm directly from their phone.</p></div></li><li><span>3</span><div><strong>Get notified</strong><p>We’ll confirm when the payment is complete.</p></div></li></ol><div className="info-callout">No fees are charged to your customer for this request.</div></div></div>}
  </div>;
}

function CollectionReview({ amount, customer, note, onBack, onConfirm }) {
  return <div className="panel review-panel"><div className="review-icon orange-bg"><ArrowDownLeft size={24} /></div><span className="eyebrow">Review request</span><h3>Check the payment details</h3><p className="review-lead">You’re about to request a payment from this customer.</p><div className="review-amount">{formatNumber(amount)} <small>FCFA</small></div><div className="detail-list"><div><span>Customer</span><strong>+226 {customer}</strong></div><div><span>Reference</span><strong>{note || "No reference"}</strong></div><div><span>Processing fee</span><strong>0 FCFA</strong></div></div><div className="review-actions"><button className="outline-button" onClick={onBack}><ArrowLeft size={16} /> Edit details</button><button className="primary-button" onClick={onConfirm}>Send payment request <ArrowRight size={16} /></button></div></div>;
}

function TransfersView({ showToast, openTransaction }) {
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState("Airtel distribution");
  const [source, setSource] = useState("Main account · 286,450 FCFA");
  const [formMessage, setFormMessage] = useState("");
  const amountInvalid = amount !== "" && !isValidAmount(amount);
  const reset = () => { setStep("form"); setAmount(""); setFormMessage(""); };
  const handleContinue = () => {
    if (!isValidAmount(amount)) {
      setFormMessage("Enter an amount greater than 0.");
      return;
    }
    setFormMessage("");
    setStep("review");
  };
  if (step === "success") return <SuccessState type="transfer" amount={amount} customer={beneficiary} reset={reset} showToast={showToast} openTransaction={openTransaction} />;
  return <div className="flow-view"><PageIntro eyebrow="Money movement" title="Transfer funds" description="Send money from your merchant accounts to a beneficiary." action={<button className="soft-button" onClick={() => showToast("Transfer history opened in demo mode")}><BookOpen size={16} /> Transfer history</button>} /><FlowSteps active={step === "form" ? 0 : step === "review" ? 1 : 2} labels={["Transfer details", "Review", "Complete"]} />{step === "processing" ? <ProcessingState label="Processing transfer" detail="This usually takes a few seconds." /> : step === "review" ? <TransferReview amount={amount} beneficiary={beneficiary} source={source} onBack={() => setStep("form")} onConfirm={() => { setStep("processing"); window.setTimeout(() => { setStep("success"); showToast("Transfer saved", { type: "transaction_completed", payload: { flowId: "transfer", amount, beneficiary, source, fee: 100 } }); }, 1300); }} /> : <div className="flow-grid"><div className="panel form-panel"><div className="panel-header"><div><span className="eyebrow">Step 1 of 2</span><h3>Transfer details</h3></div></div><label className="field-label">From account <span>*</span><div className="select-wrap"><WalletCards size={17} /><select value={source} onChange={(event) => setSource(event.target.value)}><option>Main account · 286,450 FCFA</option><option>Settlement account · 814,200 FCFA</option></select><ChevronDown size={16} /></div></label><label className="field-label">Beneficiary <span>*</span><div className="select-wrap"><UsersRound size={17} /><select value={beneficiary} onChange={(event) => setBeneficiary(event.target.value)}><option>Airtel distribution</option><option>Issouf Kaboré · +226 70 82 11 04</option><option>New beneficiary</option></select><ChevronDown size={16} /></div></label><label className="field-label">Amount <span>*</span><div className={`input-with-suffix ${amountInvalid ? "has-error" : ""}`}><input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(event) => { setAmount(event.target.value); setFormMessage(""); }} min="1" aria-invalid={amountInvalid} /><span>FCFA</span></div>{amountInvalid && <small className="field-error">Amount must be greater than 0.</small>}</label><button className="primary-button form-submit" disabled={!amount} onClick={handleContinue}>Continue to review <ArrowRight size={16} /></button>{formMessage && <p className="form-error" role="alert">{formMessage}</p>}<p className="secure-note"><LockKeyhole size={15} /> Transfers are protected by merchant verification.</p></div><div className="panel side-info-panel transfer-side"><span className="info-symbol blue-bg"><ArrowUpRight size={19} /></span><h3>Transfer safely</h3><p>Choose the right account before sending funds. You can review the recipient and fees before confirming.</p><div className="limit-card"><span>Daily transfer limit</span><strong>2,000,000 FCFA</strong><div className="limit-bar"><span /></div><small>1,714,000 FCFA remaining today</small></div></div></div>}</div>;
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

function SuccessState({ type, amount, customer, reset, showToast, openTransaction }) {
  const isTransfer = type === "transfer";
  const [pdfState, setPdfState] = useState("idle");
  const transaction = { id: `OM-${isTransfer ? "TRF" : "REQ"}-845291`, name: customer, type: isTransfer ? "Transfer sent" : "Payment request", amount: `${isTransfer ? "−" : "+"} ${formatNumber(amount)}`, time: "Just now", date: "24 April 2024 · Just now", status: "Completed", tone: isTransfer ? "neutral" : "success", channel: isTransfer ? "Merchant transfer" : "Checkout", reference: `OM-${isTransfer ? "TRF" : "REQ"}-845291`, details: isTransfer ? { Beneficiary: customer, "Transfer fee": "100 FCFA" } : { "Customer phone": `+226 ${customer}`, "Processing fee": "0 FCFA" }, icon: isTransfer ? ArrowUpRight : ArrowDownLeft };
  const downloadReceipt = () => {
    setPdfState("loading");
    window.setTimeout(() => {
      try {
        downloadTransactionPdf(transaction);
        setPdfState("success");
        showToast("Receipt PDF downloaded");
      } catch (error) {
        console.error(error);
        setPdfState("error");
        showToast("Receipt PDF could not be created");
      }
    }, 260);
  };
  return <div className="panel state-panel success-panel"><span className="state-symbol success-symbol"><Check size={30} /></span><span className="eyebrow">{isTransfer ? "Transfer complete" : "Payment request sent"}</span><h3>{isTransfer ? "Your transfer was successful" : "Your request is on its way"}</h3><p>{isTransfer ? "The funds have been sent to your beneficiary." : "Your customer will receive a payment prompt on their phone."}</p><div className="success-receipt"><div><span>Amount</span><strong>{formatNumber(amount)} <small>FCFA</small></strong></div><div><span>{isTransfer ? "Beneficiary" : "Customer"}</span><strong>{customer}</strong></div><div><span>Reference</span><strong>{transaction.reference}</strong></div></div>{pdfState === "success" && <p className="download-success" role="status"><Check size={14} /> PDF saved to downloads</p>}{pdfState === "error" && <p className="form-error" role="alert">The PDF could not be prepared. Try again.</p>}<div className="review-actions"><button className="outline-button" onClick={reset}>Make another {isTransfer ? "transfer" : "collection"}</button><button className="outline-button" onClick={() => openTransaction ? openTransaction(transaction) : showToast("Transaction details opened")}><ReceiptText size={16} /> View details</button><button className="primary-button" disabled={pdfState === "loading"} onClick={downloadReceipt}>{pdfState === "loading" ? <LoaderCircle className="spin" size={16} /> : <Download size={16} />} {pdfState === "loading" ? "Preparing PDF…" : "Download receipt"}</button></div></div>;
}

function QrView({ showToast }) {
  const [tab, setTab] = useState("display");
  return <div className="standard-view"><PageIntro eyebrow="Payments" title="QR payments" description="Let customers pay instantly by scanning your merchant QR code." action={<button className="soft-button" onClick={() => showToast("QR image downloaded")}><Download size={16} /> Download QR</button>} /><div className="tab-bar"><button className={tab === "display" ? "active" : ""} onClick={() => setTab("display")}><QrCode size={16} /> My merchant QR</button><button className={tab === "scan" ? "active" : ""} onClick={() => setTab("scan")}><ScanLine size={16} /> Scan to verify</button></div>{tab === "display" ? <div className="qr-layout"><div className="panel qr-card"><div className="qr-card-top"><div><span className="eyebrow">Your payment code</span><h3>Sahel Market</h3><p>Customers can scan this code to pay you.</p></div><span className="verified-badge"><ShieldCheck size={14} /> Verified</span></div><div className="qr-frame"><QrGraphic /><div className="qr-center-mark orange-qr-center"><OrangeQrLogo /></div></div><div className="qr-code-label">sahel.market <span>·</span> 104 82 93</div><div className="qr-actions"><button className="primary-button" onClick={() => showToast("Share link copied to clipboard")}><Copy size={16} /> Share QR</button><button className="outline-button" onClick={() => showToast("QR image downloaded")}><Download size={16} /> Save image</button></div></div><div className="panel qr-guide"><span className="info-symbol dark-bg"><QrCode size={19} /></span><h3>How customers pay</h3><div className="qr-guide-step"><span>01</span><div><strong>Open their payment app</strong><p>They select “Pay by QR” on their phone.</p></div></div><div className="qr-guide-step"><span>02</span><div><strong>Scan your code</strong><p>Your store details appear immediately.</p></div></div><div className="qr-guide-step"><span>03</span><div><strong>Confirm the amount</strong><p>You’ll see the payment in Activity.</p></div></div><button className="text-button" onClick={() => setTab("scan")}>Verify a payment <ArrowRight size={15} /></button></div></div> : <VerifyView showToast={showToast} embedded />}</div>;
}

function QrGraphic() {
  const size = 21;
  const isFinder = (x, y, startX, startY) => x >= startX && x < startX + 7 && y >= startY && y < startY + 7;
  const isFilled = (x, y) => {
    const finders = [[0, 0], [size - 7, 0], [0, size - 7]];
    const finder = finders.find(([startX, startY]) => isFinder(x, y, startX, startY));
    if (finder) {
      const [startX, startY] = finder;
      const edge = x === startX || x === startX + 6 || y === startY || y === startY + 6;
      return edge || (x >= startX + 2 && x <= startX + 4 && y >= startY + 2 && y <= startY + 4);
    }
    return ((x * 17 + y * 29 + x * y * 7 + 11) % 13) < 6;
  };
  const squares = Array.from({ length: size * size });
  return <div className="qr-graphic" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }} aria-label="Merchant QR code">{squares.map((_, index) => { const x = index % size; const y = Math.floor(index / size); return <span key={index} className={isFilled(x, y) ? "filled" : ""} />; })}</div>;
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
        <div className="panel-header"><div><span className="eyebrow">Past sessions</span><h3>Register history</h3></div><button className="text-button" onClick={() => showToast("Showing all register sessions in demo mode")}>View all <ArrowRight size={15} /></button></div>
        <button className="history-row" onClick={() => showToast("Opened register session from 23 April")}><span className="history-date">23 <small>APR</small></span><div><strong>Tuesday, 23 April</strong><p>08:12 – 19:04 · Seydou M.</p></div><div className="history-balance"><span>Closing balance</span><strong>98,250 FCFA</strong></div><span className="status-chip success">Balanced</span><ChevronRight size={16} /></button>
        <button className="history-row" onClick={() => showToast("Opened register session from 22 April")}><span className="history-date">22 <small>APR</small></span><div><strong>Monday, 22 April</strong><p>08:05 – 18:47 · Seydou M.</p></div><div className="history-balance"><span>Closing balance</span><strong>112,800 FCFA</strong></div><span className="status-chip warning">− 1,200 gap</span><ChevronRight size={16} /></button>
      </div>
      {showClose && <div className="modal-scrim" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="close-register-title"><button className="modal-close" onClick={() => setShowClose(false)} aria-label="Close dialog"><X size={18} /></button><span className="modal-icon orange-bg"><FileCheck2 size={20} /></span><span className="eyebrow">End of day</span><h3 id="close-register-title">Close your register?</h3><p>Make sure your cash count matches the expected balance before closing.</p><div className="closing-input"><label htmlFor="counted-cash">Counted cash</label><div className={`input-with-suffix ${Number(countedCash) !== expectedCash ? "has-error" : ""}`}><input id="counted-cash" value={countedCash} onChange={(event) => setCountedCash(event.target.value)} type="number" inputMode="decimal" min="0" /><span>FCFA</span></div>{Number(countedCash) !== expectedCash && <small className="field-error">Enter {formatNumber(expectedCash)} FCFA to close this demo register.</small>}</div><div className="modal-actions"><button className="outline-button" onClick={() => setShowClose(false)}>Cancel</button><button className="primary-button" onClick={closeRegister} disabled={!countedCash}>Close register</button></div></div></div>}
    </div>
  );
}

function RevenueView({ showToast }) {
  const [period, setPeriod] = useState("30 days");
  const values = period === "7 days" ? ["42", "56", "49", "73", "62", "80", "67"] : period === "90 days" ? ["38", "51", "47", "68", "57", "71", "64", "83", "76", "92", "81", "96"] : ["35", "48", "44", "62", "57", "75", "69", "88", "72", "91", "82", "96"];
  const points = values.map((value, index) => `${index === 0 ? "M" : "L"} ${(index / (values.length - 1)) * 760} ${220 - Number(value) * 1.9}`).join(" ");
  return <div className="standard-view"><PageIntro eyebrow="Business performance" title="Revenue & performance" description="Understand how your collections are growing over time." action={<button className="outline-button" onClick={() => showToast(`Revenue report for ${period} export simulated`)}><Download size={16} /> Export report</button>} /><div className="revenue-stats"><div className="panel revenue-total"><span className="eyebrow">Total revenue</span><strong>1,842,500 <small>FCFA</small></strong><p><span className="trend-up">↗ 8.4%</span> vs previous period</p><div className="revenue-mini-bars">{values.slice(-7).map((value, index) => <span key={index} style={{ height: `${Number(value) * .62}px` }} />)}</div></div><StatCard label="Completed payments" value="418" suffix="" trend="+11.2%" trendText="vs last period" icon={Check} tone="green" /><StatCard label="Average transaction" value="4,408" suffix="FCFA" trend="+3.6%" trendText="vs last period" icon={BarChart3} tone="blue" /></div><div className="panel chart-panel"><div className="panel-header chart-header"><div><span className="eyebrow">Collection volume</span><h3>Revenue over time</h3></div><div className="segmented-control" role="tablist" aria-label="Revenue period">{["7 days", "30 days", "90 days"].map((item) => <button key={item} role="tab" aria-selected={period === item} className={period === item ? "active" : ""} onClick={() => setPeriod(item)}>{item}</button>)}</div></div><div className="chart-wrap"><div className="chart-y-labels"><span>100k</span><span>75k</span><span>50k</span><span>25k</span><span>0</span></div><div className="chart"><div className="chart-gridlines"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 760 240" preserveAspectRatio="none" role="img" aria-label={`Revenue chart for ${period}`}><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f56b2a" stopOpacity=".22" /><stop offset="1" stopColor="#f56b2a" stopOpacity="0" /></linearGradient></defs><path d={`M 0 206 ${values.map((v, i) => `L ${(i / (values.length - 1)) * 760} ${220 - Number(v) * 1.9}`).join(" ")} L 760 240 L 0 240 Z`} fill="url(#areaFill)" /><path d={points} fill="none" stroke="#f56b2a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{values.map((v, i) => <circle key={i} cx={(i / (values.length - 1)) * 760} cy={220 - Number(v) * 1.9} r="4" fill="#fff" stroke="#f56b2a" strokeWidth="2" />)}</svg><div className="chart-x-labels"><span>Apr 01</span><span>Apr 08</span><span>Apr 15</span><span>Apr 22</span><span>Today</span></div></div></div></div></div>;
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
  const savedItems = savedEvents.map((event) => {
    const payload = event.payload || {};
    const amount = Number(payload.amount) > 0 ? `${formatNumber(payload.amount)} FCFA` : "";
    const title = payload.message || (event.event_type === "navigation" ? `Opened ${event.view_id}` : event.event_type.replaceAll("_", " "));
    const isTransfer = payload.flowId === "transfer";
    const eventTransaction = event.event_type.includes("completed") ? {
      id: payload.reference || `OM-${isTransfer ? "TRF" : "PAY"}-${event.id}`,
      name: payload.beneficiary || payload.merchant || (payload.phone ? `+226 ${payload.phone}` : "Demo customer"),
      type: isTransfer ? "Transfer sent" : "Payment received",
      amount: `${isTransfer ? "−" : "+"} ${formatNumber(payload.amount)}`,
      time: new Date(event.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date(event.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
      status: "Completed",
      tone: isTransfer ? "neutral" : "success",
      channel: isTransfer ? "Merchant transfer" : "Checkout",
      reference: payload.reference || `OM-${isTransfer ? "TRF" : "PAY"}-${event.id}`,
      details: payload.phone ? { "Phone number": `+226 ${payload.phone}` } : {},
      icon: isTransfer ? ArrowUpRight : ArrowDownLeft,
    } : null;
    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      detail: `${event.view_id} · Saved to database`,
      amount,
      time: new Date(event.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      icon: event.event_type.includes("completed") ? Check : Clock3,
      tone: event.event_type.includes("completed") ? "success" : "blue",
      transaction: eventTransaction,
    };
  });
  const staticItems = activityEvents.map((group) => ({ ...group, items: group.items.map((item) => ({ ...item, transaction: item.transactionId ? transactions.find((transaction) => transaction.id === item.transactionId) : null })) }));
  const eventGroups = savedItems.length ? [{ date: "Saved in database", items: savedItems }, ...staticItems] : staticItems;
  const searchQuery = query.trim().toLowerCase();
  const filtered = eventGroups.map((group) => ({ ...group, items: group.items.filter((item) => {
    const matchesCategory = filter === "All activity" || (filter === "Payments" && item.title.includes("Payment")) || (filter === "Transfers" && item.title.includes("Transfer")) || (filter === "Operations" && !item.title.includes("Payment") && !item.title.includes("Transfer"));
    const matchesQuery = !searchQuery || `${item.title} ${item.detail} ${item.amount}`.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesQuery;
  }) })).filter((group) => group.items.length);
  return <div className="standard-view"><PageIntro eyebrow="Merchant activity" title="Activity" description="A complete timeline of payments, transfers, and account events." action={<button className="outline-button" onClick={() => showToast("Activity export simulated")}><Download size={16} /> Export activity</button>} /><div className="activity-toolbar"><div className="search-field"><Search size={17} /><input aria-label="Search activity" placeholder="Search activity" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="filter-pills" role="tablist" aria-label="Activity categories">{["All activity", "Payments", "Transfers", "Operations"].map((item) => <button role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><button className={`outline-button filter-button ${filtersOpen ? "selected" : ""}`} onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}><Filter size={16} /> Filters</button></div>{filtersOpen && <div className="filter-panel"><label>Date range<select value={dateRange} onChange={(event) => { setDateRange(event.target.value); showToast(`Date range set to ${event.target.value}`); }}><option>All dates</option><option>Today</option><option>Last 7 days</option><option>This month</option></select></label><button className="text-button" onClick={() => { setDateRange("All dates"); setFilter("All activity"); setQuery(""); showToast("Activity filters cleared"); }}>Clear filters <X size={14} /></button></div>}{loading ? <ActivitySkeleton /> : loadError ? <div className="panel error-state" role="alert"><CircleHelp size={20} /><h3>We couldn’t load activity</h3><p>{loadError}</p><button className="outline-button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Try again</button></div> : <div className="activity-timeline">{filtered.length ? filtered.map((group) => <div className="timeline-group" key={group.date}><h3>{group.date}</h3>{group.items.map((item, index) => { const Icon = item.icon; return <button className="timeline-item" key={`${group.date}-${index}`} onClick={() => item.transaction ? openTransaction(item.transaction) : showToast(`${item.title} details opened`)}><div className={`timeline-icon ${item.tone}`}><Icon size={16} /></div><div className="timeline-copy"><strong>{item.title}</strong><p>{item.detail}</p></div><div className="timeline-amount"><strong className={item.amount.startsWith("+") ? "positive" : ""}>{item.amount}</strong><span>{item.time}</span></div><ChevronRight size={16} /></button>; })}</div>) : <div className="panel empty-state"><span className="empty-icon"><Search size={22} /></span><h3>No activity found</h3><p>Try a different search or activity filter.</p></div>}</div>}</div>;
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
  return <div className={embedded ? "verify-embedded" : "standard-view"}>{!embedded && <PageIntro eyebrow="Verification" title="Scan & verify" description="Check a payment QR code or transaction reference before handing over goods." action={<button className="outline-button" onClick={() => showToast("Verification history opened in demo mode")}><BookOpen size={16} /> Verification history</button>} />}{state === "success" ? <div className="panel verify-result"><span className="state-symbol success-symbol"><Check size={28} /></span><span className="eyebrow">Payment verified</span><h3>This payment is valid</h3><p>The transaction has been confirmed and the funds are available to the merchant.</p><div className="verify-detail"><div><span>Amount</span><strong>42,000 FCFA</strong></div><div><span>From</span><strong>Mariam Ouédraogo</strong></div><div><span>Reference</span><strong>OM-PAY-845101</strong></div><div><span>Verified</span><strong>Just now</strong></div></div><div className="review-actions"><button className="outline-button" onClick={() => setState("idle")}>Scan another</button><button className="primary-button" onClick={() => { setState("idle"); showToast("Payment marked as verified"); }}><Check size={16} /> Done</button></div></div> : <div className="verify-layout"><div className="panel scanner-panel"><div className={`scanner-viewport ${state === "scanning" ? "is-scanning" : ""}`}><div className="scanner-corner top-left" /><div className="scanner-corner top-right" /><div className="scanner-corner bottom-left" /><div className="scanner-corner bottom-right" />{state === "scanning" && <span className="scan-line" />}{state === "scanning" ? <LoaderCircle className="scanner-loader" size={30} /> : <ScanLine className="scanner-placeholder" size={48} />}</div><h3>{state === "scanning" ? "Looking for a code…" : "Scan a payment QR code"}</h3><p>Position the customer’s QR code inside the frame.</p><button className="primary-button" onClick={begin} disabled={state === "scanning"}>{state === "scanning" ? "Scanning…" : "Start scanner"} <ScanLine size={16} /></button><button className="text-button manual-button" onClick={() => setManualOpen(true)}>Enter reference manually <ArrowRight size={15} /></button></div><div className="panel verify-side"><span className="info-symbol green-bg"><ShieldCheck size={19} /></span><h3>Verify before delivery</h3><p>Only hand over goods once a payment shows as verified in this workspace.</p><div className="verify-note"><Check size={15} /><span>Real-time confirmation</span></div><div className="verify-note"><Check size={15} /><span>Protected transaction details</span></div><div className="verify-note"><Check size={15} /><span>Works with merchant QR codes</span></div></div></div>}{manualOpen && <div className="modal-scrim"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="manual-reference-title"><button className="modal-close" onClick={() => setManualOpen(false)} aria-label="Close dialog"><X size={18} /></button><span className="modal-icon blue-bg"><FileCheck2 size={20} /></span><span className="eyebrow">Manual verification</span><h3 id="manual-reference-title">Enter a transaction reference</h3><p>Use the reference shown on the customer’s receipt to simulate a verification.</p><label className="field-label" htmlFor="manual-reference">Transaction reference<input id="manual-reference" type="text" placeholder="e.g. OM-PAY-845101" value={manualReference} onChange={(event) => setManualReference(event.target.value)} autoFocus /></label><div className="modal-actions"><button className="outline-button" onClick={() => setManualOpen(false)}>Cancel</button><button className="primary-button" onClick={submitManualReference} disabled={!manualReference.trim()}>Verify reference <Check size={16} /></button></div></div></div>}</div>;
}

function ProfileView({ showToast, onSecurity, onLock }) {
  const [language, setLanguage] = useState("Français");
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
        if (mounted && typeof savedLanguage === "string") setLanguage(savedLanguage);
      })
      .catch((error) => { console.error(error); if (mounted) setSettingsError("Preferences could not be loaded."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [loadAttempt]);
  const showSetting = (name) => name === "Security" ? onSecurity() : showToast(`${name} opened in demo mode`);
  if (loading) return <div className="standard-view"><PageIntro eyebrow="Workspace preferences" title="Profile & settings" description="Manage your merchant identity, security, and notifications." /><ProfileSkeleton /></div>;
  if (settingsError) return <div className="standard-view"><PageIntro eyebrow="Workspace preferences" title="Profile & settings" description="Manage your merchant identity, security, and notifications." /><div className="panel error-state" role="alert"><CircleHelp size={20} /><h3>We couldn’t load settings</h3><p>{settingsError}</p><button className="outline-button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Try again</button></div></div>;
  return <div className="standard-view"><PageIntro eyebrow="Workspace preferences" title="Profile & settings" description="Manage your merchant identity, security, and notifications." action={<button className="outline-button" onClick={() => showToast("Support center opened in demo mode")}><CircleHelp size={16} /> Help center</button>} /><div className="profile-layout"><div className="panel profile-card"><div className="profile-cover" /><div className="profile-card-body"><div className="profile-avatar xl">SM</div><span className="verified-badge"><ShieldCheck size={14} /> Verified merchant</span><h3>Seydou Maïga</h3><p>Store manager · Sahel Market</p><button className="outline-button" onClick={() => showToast("Profile editing is available in the full app")}>Edit profile</button><div className="profile-contact"><div><Smartphone size={16} /><span>+226 70 82 11 04</span></div><div><BriefcaseBusiness size={16} /><span>Merchant ID: OM-1048293</span></div></div></div></div><div className="settings-sections"><SettingsSection title="Business account" items={[["Business details", "Sahel Market · Ouagadougou", Store], ["Account information", "Primary account · 4821", WalletCards], ["Team members", "2 active members", UsersRound]]} onSelect={showSetting} /></div><div className="settings-sections"><SettingsSection title="Security & preferences" items={[["Security", "PIN, devices, and sign-in", LockKeyhole], ["Notifications", "Payment and activity alerts", Bell]]} onSelect={showSetting} /><div className="setting-row language-row"><span className="setting-icon"><Settings2 size={17} /></span><div><strong>Language</strong><small>Choose your preferred language</small></div><select aria-label="Language" value={language} onChange={(event) => { setLanguage(event.target.value); persistSetting("language", event.target.value).then(() => showToast(`Language set to ${event.target.value}`)).catch((error) => { console.error(error); showToast("Language could not be saved"); }); }}><option>Français</option><option>English</option></select></div><button className="security-lock-button" onClick={onLock}><LockKeyhole size={16} /><span><strong>Lock workspace</strong><small>Require your demo PIN to continue</small></span><ChevronRight size={16} /></button></div></div></div>;
}

function ProfileSkeleton() {
  return <div className="profile-layout loading-view" role="status" aria-label="Loading settings"><LoadingSkeleton className="skeleton-profile-card" /><LoadingSkeleton className="skeleton-settings-card" /></div>;
}

function SettingsSection({ title, items, onSelect }) {
  return <div className="settings-block"><span className="eyebrow">{title}</span>{items.map(([name, desc, Icon]) => <button className="setting-row" key={name} onClick={() => onSelect(name)}><span className="setting-icon"><Icon size={17} /></span><div><strong>{name}</strong><small>{desc}</small></div><ChevronRight size={17} /></button>)}</div>;
}

export default App;