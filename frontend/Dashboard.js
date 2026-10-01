import { getSummary } from "./api.js";
import { renderNav } from "./nav.js";
import { t } from "./i18n.js";

// Pretend it is this day of the month to test the "running ahead" advice (e.g. 20). null = real date.
const DEMO_DAY = null;
// Pace advice waits until this day, because on day 1 every envelope looks "ahead".
const PACE_FROM_DAY = 5;

const rand = (n) => "R" + Math.round(n).toLocaleString("en-ZA");
const esc = (s) => { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; };

renderNav("overview");

const statsEl = document.getElementById("stats");
const envEl = document.getElementById("envelopes");
const adviceEl = document.getElementById("advice");
let summary = null;

function monthInfo() {
    const now = new Date();
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const day = DEMO_DAY || now.getDate();
    return { day, daysLeft: days - day + 1, monthPct: Math.round((day / days) * 100) };
}

const levelFor = (pct) => (pct >= 90 ? "risk" : pct >= 70 ? "warn" : "ok");

// Rules-based advice: every message comes from the numbers, nothing is guessed.
function buildAdvice(s, m, spent, balance) {
    const items = [];
    const spentPct = s.income_total ? Math.round((spent / s.income_total) * 100) : 0;

    if (balance < 0) items.push({ level: "risk", text: t("advTotal") });

    s.categories.forEach((c) => {
        const pct = Math.round(c.percent_used);
        if (pct > 100) {
            items.push({ level: "risk", text: t("advOver", { name: c.name, over: rand(c.spent - c.budget) }) });
        } else if (pct >= 90) {
            items.push({ level: "warn", text: t("advNear", { name: c.name, left: rand(c.remaining) }) });
        } else if (m.day >= PACE_FROM_DAY && pct >= 70 && pct > m.monthPct + 20) {
            items.push({ level: "warn", text: t("advPace", { name: c.name, pct, month: m.monthPct }) });
        }
    });

    if (balance >= 0 && m.day >= PACE_FROM_DAY && spentPct > m.monthPct + 20) {
        items.push({ level: "warn", text: t("advPaceAll", { pct: spentPct, month: m.monthPct }) });
    }

    items.sort((a, b) => (a.level === "risk" ? 0 : 1) - (b.level === "risk" ? 0 : 1));
    const top = items.slice(0, 4);

    if (top.length === 0) top.push({ level: "good", text: t("advGood") });
    if (balance > 0) top.push({ level: "info", text: t("advDaily", { perDay: rand(balance / m.daysLeft) }) });
    return top;
}

function renderStats(s, m, spent, balance) {
    const cards = [
        { label: t("incomeLbl"), value: rand(s.income_total) },
        { label: t("spentLbl"), value: rand(spent) },
        { label: t("balanceLbl"), value: rand(balance), dark: true, neg: balance < 0 },
        { label: t("perDayLbl"), value: balance > 0 ? rand(balance / m.daysLeft) : "R0" },
    ];
    statsEl.innerHTML = cards.map((c) => `
        <div class="stat${c.dark ? " dark" : ""}">
            <div class="stat-label">${esc(c.label)}</div>
            <div class="stat-value${c.neg ? " neg" : ""}">${esc(c.value)}</div>
        </div>`).join("");
}

function renderEnvelopes(s) {
    if (!s.categories.length) {
        envEl.innerHTML = `<p class="notice">${esc(t("setupHint"))} <a href="IncomeSplit.html">${esc(t("setupLink"))}</a></p>`;
        return;
    }
    envEl.innerHTML = s.categories.map((c) => {
        const pct = Math.round(c.percent_used);
        const lvl = levelFor(pct);
        const isOver = pct > 100;
        const status = lvl === "risk" ? t("statusRisk") : lvl === "warn" ? t("statusWarn") : t("statusOk");
        return `
        <article class="envelope">
            <div class="env-head">
                <span class="env-name">${esc(c.name)}</span>
                <span class="env-left${isOver ? " neg" : ""}">${esc(isOver ? t("over", { over: rand(c.spent - c.budget) }) : t("left", { left: rand(c.remaining) }))}</span>
            </div>
            <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(pct, 100)}" aria-label="${esc(c.name)}">
                <div class="bar-fill ${lvl === "ok" ? "" : lvl}" style="width:${Math.min(pct, 100)}%"></div>
            </div>
            <div class="env-foot">
                <span>${esc(t("ofBudget", { spent: rand(c.spent), budget: rand(c.budget) }))}</span>
                <span class="st-${lvl}">${esc(status)}</span>
            </div>
        </article>`;
    }).join("");
}

function renderAdvice(items) {
    const label = { risk: "lvlRisk", warn: "lvlWarn", good: "lvlGood", info: "lvlInfo" };
    adviceEl.innerHTML = items.map((i) => `
        <li class="advice-item ${i.level}">
            <span class="badge">${esc(t(label[i.level]))}</span>
            <p>${esc(i.text)}</p>
        </li>`).join("");
}

function render() {
    if (!summary) return;
    const m = monthInfo();
    const spent = summary.categories.reduce((sum, c) => sum + c.spent, 0);
    const balance = summary.income_total - spent;
    renderStats(summary, m, spent, balance);
    renderEnvelopes(summary);
    renderAdvice(buildAdvice(summary, m, spent, balance));
}

async function load() {
    try {
        summary = await getSummary();
        render();
    } catch (err) {
        statsEl.innerHTML = `<p class="error">${esc(t("loadErr"))}</p>`;
    }
}

document.addEventListener("langchange", render);
load();
