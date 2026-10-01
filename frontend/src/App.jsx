import { useState, useEffect } from 'react';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [form, setForm] = useState({ description: '', amount: '', category: '', type: 'expense' });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [txRes, sumRes] = await Promise.all([
      fetch('/api/transactions'),
      fetch('/api/summary'),
    ]);
    setTransactions(await txRes.json());
    setSummary(await sumRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ description: '', amount: '', category: '', type: 'expense' });
    setLoading(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Mukuru Budget Coach</h1>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card title="Income" amount={summary.income} color="green" />
        <Card title="Expenses" amount={summary.expenses} color="red" />
        <Card title="Balance" amount={summary.balance} color={summary.balance >= 0 ? 'green' : 'red'} />
      </div>

      {/* Add Transaction Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          style={{ padding: 8, flex: 2, minWidth: 120 }}
        />
        <input
          placeholder="Amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          style={{ padding: 8, flex: 1, minWidth: 80 }}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ padding: 8, flex: 1, minWidth: 100 }}
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          style={{ padding: 8 }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* Transactions List */}
      <h2>Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet. Add one above!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: 8 }}>Description</th>
              <th style={{ padding: 8 }}>Category</th>
              <th style={{ padding: 8 }}>Type</th>
              <th style={{ padding: 8 }}>Amount</th>
              <th style={{ padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{t.description}</td>
                <td style={{ padding: 8 }}>{t.category}</td>
                <td style={{ padding: 8 }}>{t.type}</td>
                <td style={{ padding: 8, color: t.type === 'income' ? 'green' : 'red' }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => handleDelete(t.id)} style={{ cursor: 'pointer', color: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Card({ title, amount, color }) {
  return (
    <div style={{ flex: 1, padding: 16, border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 14, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 'bold', color }}>${amount.toFixed(2)}</div>
    </div>
  );
}

export default App;
