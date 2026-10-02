import { useState, useEffect, type ReactNode } from "react";

type IconName =
  | "home" | "wallet" | "activity" | "card" | "settings"
  | "help" | "bell" | "search" | "arrowUp" | "arrowDown"
  | "send" | "plus" | "more" | "coffee" | "shopping"
  | "bolt" | "salary" | "plane" | "chevron" | "close"
  | "check" | "eye";

const iconPaths: Record<IconName, ReactNode> = {
  home: (<><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>),
  wallet: (<><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19v16H5a2 2 0 0 1-2-2V7" /><path d="M3 8h16M15 12h6v5h-6a2.5 2.5 0 0 1 0-5Z" /></>),
  activity: (<><path d="M4 19V9M10 19V5M16 19v-7M22 19V3" /><path d="M2 19h22" /></>),
  card: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63 1.7 1.7 0 0 0 10 3.08V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 19.37 9 1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z" /></>),
  help: (<><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 3.3 2.37c-.9.38-.9 1.13-.9 1.63M12 17h.01" /></>),
  bell: (<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>),
  arrowUp: <path d="m5 15 7-7 7 7M12 8v12" />,
  arrowDown: <path d="m5 9 7 7 7-7M12 4v12" />,
  send: (<><path d="m4 4 17 8-17 8 3-8-3-8Z" /><path d="M7 12h14" /></>),
  plus: <path d="M12 5v14M5 12h14" />,
  more: (<><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>),
  coffee: (<><path d="M4 8h13v6a6 6 0 0 1-6 6H10a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V8Z" /><path d="M17 10h1a3 3 0 0 1 0 6h-2M7 4v1M11 3v2M15 4v1" /></>),
  shopping: (<><path d="M4 8h16l-1 12H5L4 8Z" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>),
  bolt: <path d="M13 2 5 14h7l-1 8 8-12h-7l1-8Z" />,
  salary: (<><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M7 6V4h10v2M8 13h8M12 10v6" /></>),
  plane: <path d="m22 2-8.5 20-2.5-9-9-2.5L22 2ZM11 13l5-5" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 4 4L19 6" />,
  eye: (<><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>),
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name]}
    </svg>
  );
}

interface Transaction {
  id: number;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  flagged?: boolean;
  flag_reason?: string | null;
}

interface Summary {
  income_total: number;
  total_spent: number;
  balance: number;
  categories: { name: string; budget: number; spent: number; remaining: number; percent_used: number }[];
}

interface Goal {
  id: number;
  name: string;
  target: number;
  saved: number;
  scheduledAmount?: number;
  frequency?: string;
  startDate?: string;
  nextTransferDate?: string;
}

const navItems: { icon: IconName; label: string }[] = [
  { icon: "home", label: "Overview" },
  { icon: "activity", label: "Dashboard" },
  { icon: "wallet", label: "Accounts" },
  { icon: "card", label: "Cards" },
];

let currentLang: 'en' | 'af' = 'en';
const t = (k: string) => T[currentLang]?.[k] ?? k;

const T: Record<string, Record<string, string>> = {
  en: {
    Overview: "Overview", Dashboard: "Dashboard", Accounts: "Accounts", Cards: "Cards",
    "Add money": "Add money", "Send money": "Send money", "Total balance": "Total balance",
    Income: "Income", Spent: "Spent", "Recent activity": "Recent activity", "Monthly budget": "Monthly budget",
    "Savings goals": "Savings goals", "Coach tips": "Coach tips", Simulator: "What if I save…?",
    "Add goal": "Add goal", "Ask the coach": "Ask the coach",
    "Transfer scheduled": "Transfer scheduled", "Done": "Done", "Move money in a few seconds.": "Move money in a few seconds.",
    "Recipient": "Recipient", "Amount": "Amount", "Note (optional)": "Note (optional)", "Source": "Source",
    "Save": "Save", "Merchant": "Merchant", "Add transaction": "Add transaction", "Review transfer": "Review transfer",
    "Total income": "Total income", "Total spent": "Total spent", "Balance": "Balance", "Spending vs budget": "Spending vs budget",
    "Per category, this month": "Per category, this month", "Income used": "Income used", "of income spent": "of income spent",
    "Loading your dashboard...": "Loading your dashboard...", "Good morning, Grace": "Good morning, Grace",
    "Cash flow": "Cash flow", "Income and spending over time": "Income and spending over time",
    "Income accounts": "Income accounts", "Your cards": "Your cards", "My card": "My card",
    "Card is active": "Card is active", "Card frozen": "Card frozen", "Freeze card": "Freeze card", "Unfreeze card": "Unfreeze card",
    "Categories": "Categories", "Flagged": "Flagged", "Add": "Add", "View all": "View all", "Show less": "Show less",
    "Help center": "Help center", "Settings": "Settings", "Two households": "Two households", "from last month": "from last month",
    "Search transactions": "Search transactions", "Goal name": "Goal name", "R target": "R target",
    "Auto-categorised if blank": "Auto-categorised if blank", "What if I save… a week?": "What if I save… a week?",
    "Name or phone number": "Name or phone number", "e.g. Salary, Side hustle": "e.g. Salary, Side hustle",
    "e.g. Shoprite": "e.g. Shoprite", "Type a question…": "Type a question…", "What's this for?": "What's this for?",
    "May": "May", "Jun": "Jun", "Jul": "Jul", "Aug": "Aug", "Sep": "Sep", "Oct": "Oct", "used": "used", "spent": "spent",
    "Next transfer": "Next transfer",
    "Scheduled amount": "Scheduled amount",
    "Frequency": "Frequency",
    "Start date": "Start date",
    "Daily": "Daily",
    "Weekly": "Weekly",
    "Monthly": "Monthly",
    "Yearly": "Yearly",
    "No schedule": "No schedule",
  },
  af: {
    Overview: "Oorsig", Dashboard: "Dashboard", Accounts: "Rekeninge", Cards: "Kaarte",
    "Add money": "Voeg geld by", "Send money": "Stuur geld", "Total balance": "Totale saldo",
    Income: "Inkomste", Spent: "Uitgawes", "Recent activity": "Onlangse aktiwiteit", "Monthly budget": "Maandelikse begroting",
    "Savings goals": "Spaardoelwitte", "Coach tips": "Afrigterwenke", Simulator: "Wat as ek spaar…?",
    "Add goal": "Voeg doelwit by", "Ask the coach": "Vra die afrigter",
    "Transfer scheduled": "Oordrag geskeduleer", "Done": "Klaar", "Move money in a few seconds.": "Skuif geld in 'n paar sekondes.",
    "Recipient": "Ontvanger", "Amount": "Bedrag", "Note (optional)": "Nota (opsioneel)", "Source": "Bron",
    "Save": "Stoor", "Merchant": "Handelaar", "Add transaction": "Voeg transaksie by", "Review transfer": "Hersien oordrag",
    "Total income": "Totale inkomste", "Total spent": "Totaal uitgegee", "Balance": "Saldo", "Spending vs budget": "Besteding teenoor begroting",
    "Per category, this month": "Per kategorie, hierdie maand", "Income used": "Inkomste gebruik", "of income spent": "van inkomste uitgegee",
    "Loading your dashboard...": "Laai jou dashboard…", "Good morning, Grace": "Goeie môre, Grace",
    "Cash flow": "Kontantvloei", "Income and spending over time": "Inkomste en besteding oor tyd",
    "Income accounts": "Inkomsterekeninge", "Your cards": "Jou kaarte", "My card": "My kaart",
    "Card is active": "Kaart is aktief", "Card frozen": "Kaart is gevries", "Freeze card": "Vries kaart", "Unfreeze card": "Ontdooi kaart",
    "Categories": "Kategorieë", "Flagged": "Gemerk", "Add": "Byvoeg", "View all": "Wys alles", "Show less": "Wys minder",
    "Help center": "Hulpsentrum", "Settings": "Instellings", "Two households": "Twee huishoudings", "from last month": "van verlede maand",
    "Search transactions": "Soek transaksies", "Goal name": "Doelwitnaam", "R target": "R-teiken",
    "Auto-categorised if blank": "Outo-gekategoriseer indien leeg", "What if I save… a week?": "Wat as ek… per week spaar?",
    "Name or phone number": "Naam of selnommer", "e.g. Salary, Side hustle": "bv. Salaris, Byverdienste",
    "e.g. Shoprite": "bv. Shoprite", "Type a question…": "Tik 'n vraag…", "What's this for?": "Waarvoor is dit?",
    "May": "Mei", "Jun": "Jun", "Jul": "Jul", "Aug": "Aug", "Sep": "Sep", "Oct": "Okt", "used": "gebruik", "spent": "uitgegee",
    "Next transfer": "Volgende oordrag",
    "Scheduled amount": "Geskeduleerde bedrag",
    "Frequency": "Frekwensie",
    "Start date": "Begin datum",
    "Daily": "Dagliks",
    "Weekly": "Weekliks",
    "Monthly": "Maandeliks",
    "Yearly": "Jaarliks",
    "No schedule": "Geen skedule",
  },
};

function TransferModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ recipient: "", amount: "", note: "" });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-[28px] bg-[#1a1a1a] p-6 shadow-2xl sm:p-8 border border-white/10" onMouseDown={(e) => e.stopPropagation()}>
        {sent ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-5 grid size-16 place-items-center rounded-full bg-orange-500/20 text-orange-400">
              <Icon name="check" size={30} />
            </div>
            <div className="text-2xl font-semibold tracking-[-0.04em] text-white">{t("Transfer scheduled")}</div>
            <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">Your transfer is all set. We'll let you know when it arrives.</p>
            <button onClick={onClose} className="mt-7 w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-black transition hover:bg-orange-400">{t("Done")}</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold tracking-[-0.03em] text-white">Send money</div>
                <p className="mt-1 text-sm text-gray-400">{t("Move money in a few seconds.")}</p>
              </div>
              <button aria-label="Close" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-white/10 text-gray-400 transition hover:bg-white/20">
                <Icon name="close" size={18} />
              </button>
            </div>
            <label className="mt-7 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Recipient")}</label>
            <input
              placeholder={t("Name or phone number")}
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500/50"
            />
            <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Amount")}</label>
            <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-xl text-gray-500">R</span>
              <input
                aria-label="Amount"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="min-w-0 flex-1 bg-transparent px-2 text-2xl font-semibold text-white outline-none placeholder:text-gray-600"
              />
              <span className="text-sm font-semibold text-gray-500">ZAR</span>
            </div>
            <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Note (optional)")}</label>
            <input
              placeholder={t("What's this for?")}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500/50"
            />
            <button onClick={() => setSent(true)} className="mt-6 w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-black transition hover:bg-orange-400">
              Review transfer
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AddMoneyModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!amount) return;
    setSaving(true);
    await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), source: source || "Income" }),
    });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl sm:p-8" onMouseDown={(e) => e.stopPropagation()}>
        <div className="text-xl font-semibold tracking-[-0.03em] text-white">Add money</div>
        <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Amount")}</label>
        <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-xl text-gray-500">R</span>
          <input autoFocus aria-label="Amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-2 text-2xl font-semibold text-white outline-none placeholder:text-gray-600" />
        </div>
        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Source")}</label>
        <input placeholder={t("e.g. Salary, Side hustle")} value={source} onChange={(e) => setSource(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500/50" />
        <button onClick={save} disabled={saving || !amount} className="mt-6 w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-50">{t("Save")}</button>
      </div>
    </div>
  );
}

function AddTransactionModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!amount || !merchant) return;
    setSaving(true);
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), merchant, category: category || undefined }),
    });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl sm:p-8" onMouseDown={(e) => e.stopPropagation()}>
        <div className="text-xl font-semibold tracking-[-0.03em] text-white">{t("Add transaction")}</div>
        <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Merchant")}</label>
        <input autoFocus placeholder={t("e.g. Shoprite")} value={merchant} onChange={(e) => setMerchant(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500/50" />
        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Amount")}</label>
        <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-xl text-gray-500">R</span>
          <input aria-label="Amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-2 text-2xl font-semibold text-white outline-none placeholder:text-gray-600" />
        </div>
        <label className="mt-5 block t-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Category (optional)</label>
        <input placeholder={t("Auto-categorised if blank")} value={category} onChange={(e) => setCategory(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500/50" />
        <button onClick={save} disabled={saving || !amount || !merchant} className="mt-6 w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-50">{t("Save")}</button>
      </div>
    </div>
  );
}

function DashboardView({ summary, incomeTotal, spentTotal, goals, advice }: { summary: Summary | null; incomeTotal: number; spentTotal: number; goals: Goal[]; advice: string[] }) {
  const categories = summary?.categories ?? [];
  const total = Math.max(incomeTotal, 1);
  const spentPct = Math.min((spentTotal / total) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-[26px] border border-green-500/20 bg-gradient-to-br from-green-500/10 to-[#0f0f0f] p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">{t("Total income")}</div>
            <div className="grid size-9 place-items-center rounded-xl bg-green-500/15 text-green-400"><Icon name="arrowDown" size={18} /></div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-[-0.04em] text-green-400">R{incomeTotal.toLocaleString()}</div>
          <p className="mt-1 text-xs text-gray-500">earned across your accounts</p>
        </section>
        <section className="rounded-[26px] border border-red-500/20 bg-gradient-to-br from-red-500/10 to-[#0f0f0f] p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">{t("Total spent")}</div>
            <div className="grid size-9 place-items-center rounded-xl bg-red-500/15 text-red-400"><Icon name="arrowUp" size={18} /></div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-[-0.04em] text-red-400">R{spentTotal.toLocaleString()}</div>
          <p className="mt-1 text-xs text-gray-500">across all categories</p>
        </section>
        <section className="rounded-[26px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-[#0f0f0f] p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">{t("Balance")}</div>
            <div className="grid size-9 place-items-center rounded-xl bg-orange-500/15 text-orange-400"><Icon name="wallet" size={18} /></div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-[-0.04em] text-orange-400">R{balance.toLocaleString()}</div>
          <p className="mt-1 text-xs text-gray-500">your wallet balance</p>
        </section>
      </div>

      {/* Savings Goals Section */}
      <section className="rounded-[26px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-[#0f0f0f] p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">{t("Savings goals")}</div>
          <button onClick={openAddGoalModal} className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 hover:text-white">
            {t("Add goal")}
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-between justify-between p-3 rounded-[20px] bg-white/5">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{goal.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">Saved:</span>
                  <span className="ml-2 text-sm text-white">R{goal.saved.toLocaleString()}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">Target:</span>
                  <span className="ml-2 text-sm text-white">R{goal.target.toLocaleString()}</span>
                </div>
                {goal.nextTransferDate ? (
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-400">{t("Next transfer")}:</span>
                    <span className="ml-2 text-sm text-white">
                      {new Date(goal.nextTransferDate).toLocaleDateString()}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Progress:</span>
                  <div className="w-14 h-2.5 rounded-full bg-white/20">
                    <div
                      className="h-2.5 rounded-full bg-orange-500"
                      style={{ width: `${Math.min((goal.saved / goal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {goals.length === 0 && (
            <p className="text-center text-gray-400">No savings goals yet. Add one to get started!</p>
          )}
        </div>
      </section>

      {/* Coach Tips Section */}
      <section className="rounded-[26px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-[#0f0f0f] p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">{t("Coach tips")}</div>
          <button onClick={openCoachModal} className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 hover:text-white">
            {t("Ask the coach")}
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {advice.map((tip, index) => (
            <p key={index} className="text-sm text-gray-300">• {tip}</p>
          ))}
          {advice.length === 0 && (
            <p className="text-center text-gray-400">No tips available.</p>
          )}
        </div>
      </section>

      {/* Simulator Section */}
      <section className="rounded-[26px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-[#0f0f0f] p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">{t("Simulator")}</div>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-3">
            <input
              type="number"
              placeholder={t("What if I save… a week?")}
              value={simulatorAmount}
              onChange={(e) => setSimulatorAmount(e.target.value)}
              className="w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500"
            />
            <span className="text-sm text-gray-400">/week</span>
          </div>
          <div className="mt-3 space-y-2">
            {simulatorProjections.map((proj) => (
              <div key={proj.id} className="flex items-center justify-between p-2 rounded-[20px] bg-white/5">
                <div>
                  <h4 className="font-semibold text-white">{proj.name}</h4>
                  <p className="text-xs text-gray-400">R{proj.remaining} left</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-gray-400">{proj.weeks} weeks</p>
                  <p className="text-xs text-gray-400">{proj.months} months</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function OverviewView() {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold tracking-[-0.04em] text-white">
        {t("Overview")}
      </div>
      <p className="text-sm text-gray-400">
        Welcome back, Grace! Here's a quick look at your finances.
      </p>
      {/* Recent transactions */}
      <section className="rounded-[26px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-[#0f0f0f] p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">{t("Recent activity")}</div>
        </div>
        <div className="mt-4">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-[20px] bg-white/5">
              <div className="flex-1">
                <span className="text-sm text-white">{tx.merchant}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-white">R{tx.amount}</span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-gray-400">No recent transactions.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function AccountsView() {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold tracking-[-0.04em] text-white">
        {t("Accounts")}
      </div>
      <p className="text-sm text-gray-400">
        Your income accounts and balances.
      </p>
      <section className="rounded-[26px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-[#0f0f0f] p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">{t("Income accounts")}</div>
        </div>
        <div className="mt-4">
          {incomeEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 rounded-[20px] bg-white/5">
              <div className="flex-1">
                <span className="text-sm text-white">{entry.source}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-white">R{entry.amount}</span>
              </div>
            </div>
          ))}
          {incomeEntries.length === 0 && (
            <p className="text-center text-gray-400">No income accounts found.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function CardsView() {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold tracking-[-0.04em] text-white">
        {t("Cards")}
      </div>
      <p className="text-sm text-gray-400">
        Manage your debit and credit cards.
      </p>
      <section className="rounded-[26px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-[#0f0f0f] p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">{t("Your cards")}</div>
        </div>
        <div className="mt-4">
          {/* Placeholder for cards */}
          <p className="text-center text-gray-400">No cards added yet.</p>
        </div>
      </section>
    </div>
  );
}

function AddGoalModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [scheduledAmount, setScheduledAmount] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly" | "">("");
  const [startDate, setStartDate] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name || !target) return;
    setSaving(true);
    const sa = parseFloat(scheduledAmount);
    const hasSchedule = !isNaN(sa) && sa > 0 && frequency && startDate;
    const goalData: any = {
      name,
      target: parseFloat(target),
    };
    if (hasSchedule) {
      goalData.scheduledAmount = sa;
      goalData.frequency = frequency;
      goalData.startDate = startDate;
    }
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goalData),
    });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl sm:p-8" onMouseDown={(e) => e.stopPropagation()}>
        <div className="text-xl font-semibold tracking-[-0.03em] text-white">{t("Add goal")}</div>
        <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Goal name")}</label>
        <input
          autoFocus
          placeholder={t("e.g. Emergency fund, Vacation")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500/50"
        />
        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("R target")}</label>
        <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-xl text-gray-500">R</span>
          <input
            type="number"
            placeholder="0.00"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-2 text-2xl font-semibold text-white outline-none placeholder:text-gray-600"
          />
          <span className="text-sm font-semibold text-gray-500">ZAR</span>
        </div>
        {/* Scheduled transfer fields */}
        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Scheduled amount")}</label>
        <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-xl text-gray-500">R</span>
          <input
            type="number"
            placeholder="0.00"
            value={scheduledAmount}
            onChange={(e) => setScheduledAmount(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-2 text-2xl font-semibold text-white outline-none placeholder:text-gray-600"
          />
          <span className="text-sm font-semibold text-gray-500">ZAR</span>
        </div>
        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Frequency")}</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekly" | "monthly" | "yearly" | "")}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder:text-gray-500"
        >
          <option value="">{t("No schedule")}</option>
          <option value="daily">{t("Daily")}</option>
          <option value="weekly">{t("Weekly")}</option>
          <option value="monthly">{t("Monthly")}</option>
          <option value="yearly">{t("Yearly")}</option>
        </select>
        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Start date")}</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white"
        />
        <button onClick={save} disabled={saving || !name || !target} className="mt-6 w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-50">
          {t("Save")}
        </button>
      </div>
    </div>
  );
}

function CoachModal({ onClose }: { onClose: () => void }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (e) {
      setAnswer("Sorry, something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl sm:p-8" onMouseDown={(e) => e.stopPropagation()}>
        <div className="text-xl font-semibold tracking-[-0.03em] text-white">{t("Ask the coach")}</div>
        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{t("Type a question…")}</label>
        <input
          placeholder={t("e.g. How much did I spend?")}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500/50"
        />
        <button onClick={ask} disabled={loading || !question} className="mt-6 w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-50">
          {loading ? "Asking..." : t("Save")}
        </button>
        {answer && (
          <div className="mt-4 p-3 rounded-[20px] bg-white/5">
            <p className="text-sm text-gray-300">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeEntries, setIncomeEntries] = useState<{ id: number; amount: number; source: string; date: string }[]>([]);
  const [categories, setCategories] = useState<{ name: string; budget_percent: number }[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [advice, setAdvice] = useState<string[]>([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [spentTotal, setSpentTotal] = useState(0);
  const [simulatorAmount, setSimulatorAmount] = useState("");
  const [simulatorProjections, setSimulatorProjections] = useState<Array<{ id: number; name: string; remaining: number; weeks: number; months: number }>>([]);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openAddMoney, setOpenAddMoney] = useState(false);
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const [openAddGoal, setOpenAddGoal] = useState(false);
  const [openCoach, setOpenCoach] = useState(false);
  const [navIndex, setNavIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [transactionsRes, incomeRes, categoriesRes, goalsRes, summaryRes, adviceRes] = await Promise.all([
      fetch("/api/transactions").then((r) => r.json()),
      fetch("/api/income").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/goals").then((r) => r.json()),
      fetch("/api/summary").then((r) => r.json()),
      fetch("/api/advice").then((r) => r.json()),
    ]);
    setTransactions(transactionsRes);
    setIncomeEntries(incomeRes);
    setCategories(categoriesRes);
    setGoals(goalsRes);
    setSummary(summaryRes);
    setAdvice(adviceRes);
    setIncomeTotal(
      incomeRes.reduce((sum, entry) => sum + entry.amount, 0)
    );
    setSpentTotal(
      transactionsRes.reduce((sum, tx) => sum + tx.amount, 0)
    );
  };

  const openTransferModal = () => setOpenTransfer(true);
  const closeTransferModal = () => setOpenTransfer(false);
  const openAddMoneyModal = () => setOpenAddMoney(true);
  const closeAddMoneyModal = () => setOpenAddMoney(false);
  const openAddTransactionModal = () => setOpenAddTransaction(true);
  const closeAddTransactionModal = () => setOpenAddTransaction(false);
  const openAddGoalModal = () => setOpenAddGoal(true);
  const closeAddGoalModal = () => setOpenAddGoal(false);
  const openCoachModal = () => setOpenCoach(true);
  const closeCoachModal = () => setOpenCoach(false);

  useEffect(() => {
    if (simulatorAmount) {
      const weekly = parseFloat(simulatorAmount);
      if (!isNaN(weekly) && weekly > 0) {
        fetch(`/api/simulate?weekly=${weekly}`)
          .then((res) => res.json())
          .then((data) => {
            setSimulatorProjections(data.projections);
          });
      } else {
        setSimulatorProjections([]);
      }
    } else {
      setSimulatorProjections([]);
    }
  }, [simulatorAmount]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <aside className="w-64 border-r border-white/10">
        <div className="flex items-center h-16 px-4 bg-[#1a1a1a]">
          <div className="flex items-center space-x-3">
            <Icon name="wallet" size={24} />
            <span className="font-semibold text-white">Mukuru Budget Coach</span>
          </div>
        </div>
        <nav className="mt-6 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setNavIndex(index)}
              className={`flex items-center w-full px-4 py-3 text-sm font-semibold tracking-[-0.03em] ${
                navIndex === index
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={openTransferModal}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            <Icon name="send" size={20} />
            <span className="ml-2">{t("Send money")}</span>
          </button>
          <button
            onClick={openAddMoneyModal}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            <Icon name="plus" size={20} />
            <span className="ml-2">{t("Add money")}</span>
          </button>
          <button
            onClick={openAddTransactionModal}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            <Icon name="plus" size={20} />
            <span className="ml-2">{t("Add transaction")}</span>
          </button>
        </div>
        {navIndex === 0 && <OverviewView />}
        {navIndex === 1 && <DashboardView
          goals={goals}
          summary={summary}
          incomeTotal={incomeTotal}
          spentTotal={spentTotal}
          advice={advice}
        />}
        {navIndex === 2 && <AccountsView />}
        {navIndex === 3 && <CardsView />}
        <AddMoneyModal
          open={openAddMoney}
          onClose={closeAddMoneyModal}
          onSaved={fetchData}
        />
        <AddTransactionModal
          open={openAddTransaction}
          onClose={closeAddTransactionModal}
          onSaved={fetchData}
        />
        <AddGoalModal
          open={openAddGoal}
          onClose={closeAddGoalModal}
          onSaved={fetchData}
        />
        <TransferModal
          open={openTransfer}
          onClose={closeTransferModal}
        />
        <CoachModal
          open={openCoach}
          onClose={closeCoachModal}
        />
      </main>
    </div>
  );
}

export default App;