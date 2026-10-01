import { getCategories, addIncome, updateCategories } from "./api.js";
import { renderNav } from "./nav.js";

const amountEl = document.getElementById("income-amount");
const sourceEl = document.getElementById("income-source");
const dateEl = document.getElementById("income-date");
const catBox = document.getElementById("categories");
const totalEl = document.getElementById("total");
const saveBtn = document.getElementById("save-btn");
const statusEl = document.getElementById("status");

let categories = [];

// Default the date to today
dateEl.value = new Date().toISOString().slice(0, 10);

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.style.color = isError ? "#c0392b" : "#2e7d32";
}

// ---------- Build the category rows ----------
function renderCategories() {
    catBox.innerHTML = "";

    categories.forEach((c) => {
        const row = document.createElement("div");
        row.className = "split-row";

        const label = document.createElement("label");
        label.htmlFor = `cat-${c.id}`;
        label.textContent = c.name;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.step = "1";
        slider.id = `cat-${c.id}`;
        slider.dataset.id = c.id;
        slider.value = c.budget_percent ?? c.percent ?? 0;

        const value = document.createElement("span");
        value.className = "split-value";
        value.textContent = `${slider.value}%`;

        row.append(label, slider, value);
        catBox.appendChild(row);
    });

    updateTotal();
}

// ---------- Total, colour and save button ----------
function getSliders() {
    return [...catBox.querySelectorAll("input[type='range']")];
}

function updateTotal() {
    const total = getSliders().reduce((sum, el) => sum + Number(el.value), 0);

    totalEl.textContent = `Total: ${total}%`;
    totalEl.classList.toggle("total-ok", total < 100);   // green while there's room
    totalEl.classList.toggle("total-full", total >= 100); // red at 100% or over

    const hasAmount = Number(amountEl.value) > 0;
    saveBtn.disabled = !(total === 100 && hasAmount);
}

// ---------- Stop the sliders at 100% overall ----------
catBox.addEventListener("input", (e) => {
    const changed = e.target;
    if (changed.type !== "range") return;

    const others = getSliders()
        .filter((el) => el !== changed)
        .reduce((sum, el) => sum + Number(el.value), 0);

    const max = Math.max(0, 100 - others);
    if (Number(changed.value) > max) changed.value = max; // slider stops here

    changed.nextElementSibling.textContent = `${changed.value}%`;
    updateTotal();
});

amountEl.addEventListener("input", updateTotal);

// ---------- Save ----------
saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    setStatus("Saving...");

    try {
        await addIncome({
            amount: Number(amountEl.value),
            source: sourceEl.value.trim() || null,
            date: dateEl.value,
        });

        await updateCategories(
            getSliders().map((el) => ({ id: Number(el.dataset.id), percent: Number(el.value) }))
        );

        setStatus("Saved.");
    } catch (err) {
        setStatus(err.message || "Could not save. Is the backend running?", true);
    } finally {
        updateTotal();
    }
});

// ---------- Load ----------
(async function init() {
    try {
        categories = await getCategories();
        if (categories.length === 0) {
            setStatus("No categories yet. Seed the backend first.", true);
        }
        renderCategories();
    } catch (err) {
        setStatus("Could not load categories. Is the backend running?", true);
    }
})();

// Render navigation
renderNav("split");