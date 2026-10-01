require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { DEFAULT_CATEGORIES, SALARY, TRANSACTIONS } = require('./data/seed');
const { categorize } = require('./utils/categorize');
const { runAllFlags } = require('./utils/flags');
const { generateAdvice } = require('./utils/advice');
const { calculateSummary } = require('./utils/summary');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store (seeded)
let categories = [...DEFAULT_CATEGORIES];
let transactions = TRANSACTIONS.map((t, i) => ({
  id: i + 1,
  ...t,
  flagged: false,
  flag_reason: null,
}));
let nextId = transactions.length + 1;
let incomeEntries = [{ id: 1, ...SALARY }];
let nextIncomeId = 2;

// Helper: total income
function getTotalIncome() {
  return incomeEntries.reduce((sum, e) => sum + e.amount, 0);
}

// Helper: re-run flags and update transactions
function refreshFlags() {
  const income = getTotalIncome();
  const flags = runAllFlags(transactions, categories, income);

  // Reset all flags
  transactions.forEach((t) => {
    t.flagged = false;
    t.flag_reason = null;
  });

  // Apply new flags
  for (const flag of flags) {
    if (flag.transaction_id) {
      const tx = transactions.find((t) => t.id === flag.transaction_id);
      if (tx) {
        tx.flagged = true;
        tx.flag_reason = flag.message;
      }
    }
  }

  return flags;
}

// --- Routes ---

app.get('/', (req, res) => {
  res.json({ message: 'Mukuru Budget Coach API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/transactions — list all
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// POST /api/transactions — add one (auto-categorise, run flags)
app.post('/api/transactions', (req, res) => {
  const { amount, merchant, recipient, date, category } = req.body;

  if (!amount || !merchant) {
    return res.status(400).json({ error: 'amount and merchant are required' });
  }

  const txCategory = category || categorize(merchant, recipient);

  const transaction = {
    id: nextId++,
    amount: parseFloat(amount),
    merchant,
    recipient: recipient || '',
    date: date || new Date().toISOString(),
    category: txCategory,
    flagged: false,
    flag_reason: null,
  };

  transactions.push(transaction);
  const flags = refreshFlags();

  res.status(201).json({ transaction, flags });
});

// DELETE /api/transactions/:id
app.delete('/api/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  transactions.splice(index, 1);
  refreshFlags();
  res.json({ message: 'Deleted' });
});

// GET /api/income — list income entries
app.get('/api/income', (req, res) => {
  res.json(incomeEntries);
});

// POST /api/income — add income
app.post('/api/income', (req, res) => {
  const { amount, source, date } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'amount is required' });
  }

  const entry = {
    id: nextIncomeId++,
    amount: parseFloat(amount),
    source: source || 'Income',
    date: date || new Date().toISOString(),
  };

  incomeEntries.push(entry);
  res.status(201).json(entry);
});

// GET /api/categories — list categories with percentages
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// PUT /api/categories — update percentages
app.put('/api/categories', (req, res) => {
  const updates = req.body; // array of { name, budget_percent }

  if (!Array.isArray(updates)) {
    return res.status(400).json({ error: 'Expected array of { name, budget_percent }' });
  }

  for (const update of updates) {
    const cat = categories.find((c) => c.name === update.name);
    if (cat) {
      cat.budget_percent = update.budget_percent;
    }
  }

  res.json(categories);
});

// GET /api/summary — per-category breakdown
app.get('/api/summary', (req, res) => {
  const income = getTotalIncome();
  const summary = calculateSummary(transactions, categories, income);
  res.json(summary);
});

// GET /api/flags — all active flags
app.get('/api/flags', (req, res) => {
  const income = getTotalIncome();
  const flags = runAllFlags(transactions, categories, income);
  res.json(flags);
});

// GET /api/advice — plain-language tips
app.get('/api/advice', (req, res) => {
  const income = getTotalIncome();
  const advice = generateAdvice(transactions, categories, income);
  res.json(advice);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Seeded with ${transactions.length} transactions, ${incomeEntries.length} income entries`);
});
