require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { DEFAULT_CATEGORIES, INCOMES, TRANSACTIONS } = require('./data/seed');
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
let incomeEntries = INCOMES.map((e, i) => ({ id: i + 1, ...e }));
let nextIncomeId = INCOMES.length + 1;

// Goals with scheduled transfer support
let goals = [
  { id: 1, name: "Sister's school fees", target: 2000, saved: 600, scheduledAmount: 0, frequency: null, startDate: null, nextTransferDate: null },
  { id: 2, name: 'Fridge back home', target: 3500, saved: 900, scheduledAmount: 0, frequency: null, startDate: null, nextTransferDate: null },
];
let nextGoalId = goals.length + 1;

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

// Helper: calculate next transfer date based on frequency and start date
function calculateNextTransferDate(startDateStr, frequency) {
  if (!startDateStr || !frequency) return null;

  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return null;

  let nextDate = new Date(startDate);

  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      return null;
  }

  return nextDate.toISOString();
}

// Helper: add amount to a goal's saved amount
function contributeToGoal(goalId, amount) {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return null;

  goal.saved += amount;
  return goal;
}

// Background job to process scheduled transfers
function processScheduledTransfers() {
  const now = new Date();

  for (const goal of goals) {
    if (goal.scheduledAmount > 0 && goal.frequency && goal.startDate && goal.nextTransferDate) {
      const nextTransfer = new Date(goal.nextTransferDate);
      if (!isNaN(nextTransfer.getTime()) && nextTransfer <= now) {
        // Time to transfer
        contributeToGoal(goal.id, goal.scheduledAmount);

        // Calculate next transfer date
        const nextDate = calculateNextTransferDate(goal.startDate, goal.frequency);
        goal.nextTransferDate = nextDate;

        console.log(`Processed scheduled transfer for goal ${goal.name}: ${goal.scheduledAmount}`);
      }
    }
  }
}

// Run the scheduled transfer check every hour
setInterval(processScheduledTransfers, 60 * 60 * 1000);

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

// --- Goals ---
app.get('/api/goals', (req, res) => {
  res.json(goals);
});

app.post('/api/goals', (req, res) => {
  const { name, target, scheduledAmount, frequency, startDate } = req.body;
  const t = Number(target);
  const sa = Number(scheduledAmount);

  if (!name || !Number.isFinite(t) || t <= 0) {
    return res.status(400).json({ error: 'name and a positive target are required' });
  }

  // Validate scheduled transfer fields if provided
  let validatedFrequency = null;
  let validatedStartDate = null;
  let validatedNextTransferDate = null;

  if (scheduledAmount !== undefined && scheduledAmount !== null && !isNaN(sa) && sa > 0) {
    if (!frequency || !['daily', 'weekly', 'monthly', 'yearly'].includes(frequency)) {
      return res.status(400).json({ error: 'frequency must be one of: daily, weekly, monthly, yearly' });
    }
    if (!startDate) {
      return res.status(400).json({ error: 'startDate is required for scheduled transfers' });
    }
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ error: 'startDate must be a valid date string' });
    }

    validatedFrequency = frequency;
    validatedStartDate = startDate;
    validatedNextTransferDate = calculateNextTransferDate(startDate, frequency);

    if (!validatedNextTransferDate) {
      return res.status(400).json({ error: 'Unable to calculate next transfer date' });
    }
  }

  const goal = {
    id: nextGoalId++,
    name,
    target: t,
    saved: 0,
    scheduledAmount: sa || 0,
    frequency: validatedFrequency,
    startDate: validatedStartDate,
    nextTransferDate: validatedNextTransferDate
  };
  goals.push(goal);
  res.status(201).json(goal);
});

app.post('/api/goals/:id/contribute', (req, res) => {
  const goal = goals.find((g) => g.id === parseInt(req.params.id));
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }
  goal.saved += amount;
  res.json({ goal, reached: goal.saved >= goal.target });
});

// New endpoint to update or set schedule for an existing goal
app.post('/api/goals/:id/schedule', (req, res) => {
  const goal = goals.find((g) => g.id === parseInt(req.params.id));
  if (!goal) return res.status(404).json({ error: 'Goal not found' });

  const { scheduledAmount, frequency, startDate } = req.body;
  const sa = Number(scheduledAmount);

  // If scheduledAmount is 0 or not provided, we clear the schedule
  if (scheduledAmount === undefined || scheduledAmount === null || sa === 0) {
    goal.scheduledAmount = 0;
    goal.frequency = null;
    goal.startDate = null;
    goal.nextTransferDate = null;
    return res.json({ goal });
  }

  // Validate inputs
  if (!Number.isFinite(sa) || sa <= 0) {
    return res.status(400).json({ error: 'scheduledAmount must be a positive number' });
  }
  if (!frequency || !['daily', 'weekly', 'monthly', 'yearly'].includes(frequency)) {
    return res.status(400).json({ error: 'frequency must be one of: daily, weekly, monthly, yearly' });
  }
  if (!startDate) {
    return res.status(400).json({ error: 'startDate is required' });
  }
  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    return res.status(400).json({ error: 'startDate must be a valid date string' });
  }

  // Calculate next transfer date
  const nextTransferDate = calculateNextTransferDate(startDate, frequency);
  if (!nextTransferDate) {
    return res.status(400).json({ error: 'Unable to calculate next transfer date' });
  }

  // Update goal
  goal.scheduledAmount = sa;
  goal.frequency = frequency;
  goal.startDate = startDate;
  goal.nextTransferDate = nextTransferDate;

  res.json({ goal });
});

app.delete('/api/goals/:id', (req, res) => {
  const i = goals.findIndex((g) => g.id === parseInt(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'Goal not found' });
  goals.splice(i, 1);
  res.json({ message: 'Deleted' });
});

// --- Simulator: what if I save R<weekly> a week ---
app.get('/api/simulate', (req, res) => {
  const weekly = Number(req.query.weekly);
  if (!Number.isFinite(weekly) || weekly <= 0) {
    return res.status(400).json({ error: 'weekly must be a positive number' });
  }
  const projections = goals.map((g) => {
    const remaining = Math.max(g.target - g.saved, 0);
    const weeks = remaining === 0 ? 0 : Math.ceil(remaining / weekly);
    return { id: g.id, name: g.name, remaining, weeks, months: Math.ceil(weeks / 4.33 * 10) / 10 };
  });
  res.json({ weekly, projections });
});

// --- AI coach (rule-based, plain language, en/af) ---
const COACH_REPLIES = {
  en: {
    balance: (d) => `Your balance is R${d.balance}. You earn R${d.income} and have spent R${d.spent}.`,
    save: (d) => `You still need R${d.schoolRemaining} for ${d.schoolName}. Saving R100 a week gets you there in about ${d.schoolWeeks} weeks.`,
    spend: (d) => `Biggest spending this month: ${d.topCats}.`,
    send: () => `Money sent home is a priority, not a leak. Try to send one fixed amount each month so the rest of your plan stays steady.`,
    goal: (d) => `You have ${d.goalCount} goals. ${d.closestGoal} is closest — R${d.closestRemaining} to go.`,
    fallback: () => `I can help with your balance, spending, savings goals, or money sent home. Try: "How much did I spend?" or "Will I reach my school fees goal?"`,
  },
  af: {
    balance: (d) => `Jou saldo is R${d.balance}. Jy verdien R${d.income} en het R${d.spent} uitgegee.`,
    save: (d) => `Jy het nog R${d.schoolRemaining} nodig vir ${d.schoolName}. R100 per week kry jou daar in ongeveer ${d.schoolWeeks} weke.`,
    spend: (d) => `Grootste besteding hierdie maand: ${d.topCats}.`,
    send: () => `Geld wat jy huis toe stuur is 'n prioriteit, nie 'n lek nie. Probeer een vaste bedrag per maand stuur.`,
    goal: (d) => `Jy het ${d.goalCount} doelwitte. ${d.closestGoal} is naaste — nog R${d.closestRemaining} om te gaan.`,
    fallback: () => `Ek kan help met jou saldo, besteding, spaardoelwitte of geld huis toe. Probeer: "Hoeveel het ek uitgegee?"`,
  },
};

app.post('/api/coach', (req, res) => {
  const q = String(req.body.question || '').toLowerCase();
  const lang = req.body.lang === 'af' ? 'af' : 'en';
  const R = COACH_REPLIES[lang];
  const income = getTotalIncome();
  const summary = calculateSummary(transactions, categories, income);
  const school = goals[0];
  const schoolWeeks = school ? Math.max(Math.ceil(Math.max(school.target - school.saved, 0) / 100), 0) : 0;
  const closest = [...goals].sort((a, b) => (a.target - a.saved) - (b.target - b.saved))[0];
  const topCats = [...summary.categories].sort((a, b) => b.spent - a.spent).slice(0, 3).map((c) => `${c.name} (R${c.spent})`).join(', ');
  const data = {
    balance: summary.balance, income, spent: summary.total_spent,
    schoolRemaining: school ? Math.max(school.target - school.saved, 0) : 0,
    schoolName: school ? school.name : 'your goal', schoolWeeks,
    topCats, goalCount: goals.length,
    closestGoal: closest ? closest.name : 'none',
    closestRemaining: closest ? Math.max(closest.target - closest.saved, 0) : 0,
  };

  let answer;
  if (/spend|spandeer|uitgegee|expense/.test(q)) answer = R.spend(data);
  else if (/balance|saldo|money left|oor/.test(q)) answer = R.balance(data);
  else if (/save|spaar|goal|doel|skool|school|fees|geld by/.test(q)) answer = R.save(data);
  else if (/send|stuur|home|huis|remittance/.test(q)) answer = R.send(data);
  else if (/goal|doel|fridge|yskas/.test(q)) answer = R.goal(data);
  else answer = R.fallback(data);
  res.json({ answer });
});