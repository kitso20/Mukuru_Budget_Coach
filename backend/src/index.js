require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store (replace with a DB later)
let transactions = [];
let nextId = 1;

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Mukuru Budget Coach API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// Add a transaction
app.post('/api/transactions', (req, res) => {
  const { description, amount, category, type } = req.body;

  if (!description || !amount || !type) {
    return res.status(400).json({ error: 'description, amount, and type are required' });
  }

  const transaction = {
    id: nextId++,
    description,
    amount: parseFloat(amount),
    category: category || 'uncategorized',
    type, // 'income' or 'expense'
    date: new Date().toISOString(),
  };

  transactions.push(transaction);
  res.status(201).json(transaction);
});

// Delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  transactions.splice(index, 1);
  res.json({ message: 'Deleted' });
});

// Get summary (total income, expenses, balance)
app.get('/api/summary', (req, res) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  res.json({
    income,
    expenses,
    balance: income - expenses,
    count: transactions.length,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
