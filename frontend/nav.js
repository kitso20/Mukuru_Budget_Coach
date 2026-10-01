// Shared header: logo, language toggle, navigation. Each page calls renderNav("key").
import { getLang, setLang, applyTranslations } from "./i18n.js";

const LINKS = [
  { key: "overview", i18n: "overview", href: "Dashboard.html" },
  { key: "add",      i18n: "add",      href: "AddTransactions.html" },
  { key: "split",    i18n: "split",    href: "IncomeSplit.html" },
];
const LANGS = [{ code: "en", label: "EN" }, { code: "sn", label: "SN" }];

export function renderNav(activeKey) {
  const bar = document.createElement("header");
  bar.className = "topbar";

  const links = LINKS.map(
    (l) => `<a href="${l.href}" data-i18n="${l.i18n}"${l.key === activeKey ? ' aria-current="page"' : ""}></a>`
  ).join("");
  const langs = LANGS.map(
    (l) => `<button type="button" data-lang="${l.code}" aria-pressed="${l.code === getLang()}">${l.label}</button>`
  ).join("");

  bar.innerHTML = `
    <div class="topbar-inner">
      <div class="topbar-top">
        <div class="brand">
          <img src="/assets/mukuru-logoh.png" alt="Mukuru"
               onerror="this.replaceWith(document.createTextNode('Mukuru'))">
          <span class="brand-sub">Budget Coach</span>
        </div>
        <div class="lang" role="group" aria-label="Language">${langs}</div>
      </div>
      <nav aria-label="Main">${links}</nav>
    </div>`;
  document.body.prepend(bar);

  bar.querySelector(".lang").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-lang]");
    if (!btn) return;
    setLang(btn.dataset.lang);
    bar.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
  });

  applyTranslations();
}
