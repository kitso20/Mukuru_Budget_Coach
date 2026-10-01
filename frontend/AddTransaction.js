import { getCategories, addTransaction } from "./api.js";
import { renderNav } from "./nav.js";

const form = document.getElementById("transaction-form");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");
const categorySelect = document.getElementById("category");
const dateInput = document.getElementById("date");

function setStatus(type, text) {
    statusEl.className = type;
    statusEl.textContent = text;
}

function resetForm() {
    form.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);
}

async function loadCategories() {
    try {
        const categories = await getCategories();
        categories.forEach((c) => {
            const option = document.createElement("option");
            option.value = c.name;
            option.textContent = c.name;
            categorySelect.appendChild(option);
        });
    } catch (err) {
        setStatus("error", "Could not load categories.");
    }
}

// Render navigation
renderNav("add");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = Number(document.getElementById("amount").value);
    const merchant = document.getElementById("merchant").value.trim();

    if (!amount || amount <= 0) {
        setStatus("error", "Enter an amount greater than 0.");
        return;
    }
    if (!merchant) {
        setStatus("error", "Enter a merchant or description.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    try {
        const saved = await addTransaction({
            amount,
            merchant,
            recipient: document.getElementById("recipient").value.trim(),
            date: dateInput.value,
            category: categorySelect.value || undefined, // blank = backend auto-categorises
        });

        if (saved && saved.flagged) {
            setStatus("warn", `Saved, but flagged: ${saved.flag_reason}`);
        } else {
            setStatus("ok", "Transaction saved.");
        }
        resetForm();
    } catch (err) {
        setStatus("error", "Could not save. Try again.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Add transaction";
    }
});

resetForm();
loadCategories();