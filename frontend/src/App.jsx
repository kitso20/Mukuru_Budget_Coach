import { useState, useEffect } from 'react';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({ merchant: '', amount: '', category: '', type: 'expense' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [txRes, sumRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/summary'),
      ]);
      const txData = await txRes.json();
      const sumData = await sumRes.json();
      setTransactions(Array.isArray(txData) ? txData : []);
      setSummary(sumData);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Is the backend running?');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ merchant: '', amount: '', category: '', type: 'expense' });
      fetchData();
    } catch (err) {
      setError('Failed to add transaction.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      setError('Failed to delete transaction.');
      console.error(err);
    }
  };

  if (error) {
    return (
      <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <h1>Mukuru Budget Coach</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <h1>Mukuru Budget Coach</h1>
        <p>Loading...</p>
      </div>
    );
  }

  const categories = summary.categories || [];

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Mukuru Budget Coach</h1>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card title="Income" amount={summary.income_total || 0} color="green" />
        <Card title="Expenses" amount={summary.total_spent || 0} color="red" />
        <Card title="Balance" amount={summary.balance || 0} color={(summary.balance || 0) >= 0 ? 'green' : 'red'} />
      </div>

      {/* Category Breakdown */}
      {categories.length > 0 && (
        <>
          <h2>Categories</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            {categories.map((cat) => (
              <div
                key={cat.name}
                style={{
                  flex: '1 1 150px',
                  padding: 12,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, color: '#666' }}>{cat.name}</div>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>R{(cat.spent || 0).toFixed(0)}</div>
                <div style={{ fontSize: 12, color: cat.percent_used > 100 ? 'red' : cat.percent_used > 80 ? 'orange' : 'green' }}>
                  {cat.percent_used || 0}% used
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Transaction Form */}
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          placeholder="Merchant"
          value={form.merchant}
          onChange={(e) => setForm({ ...form, merchant: e.target.value })}
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
              <th style={{ padding: 8 }}>Merchant</th>
              <th style={{ padding: 8 }}>Category</th>
              <th style={{ padding: 8 }}>Amount</th>
              <th style={{ padding: 8 }}>Date</th>
              <th style={{ padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{t.merchant}</td>
                <td style={{ padding: 8 }}>{t.category}</td>
                <td style={{ padding: 8, color: 'red' }}>
                  -R{(t.amount || 0).toFixed(2)}
                </td>
                <td style={{ padding: 8 }}>{new Date(t.date).toLocaleDateString()}</td>
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
      <div style={{ fontSize: 24, fontWeight: 'bold', color }}>R{(amount || 0).toFixed(2)}</div>
    </div>
  );
}

export default App;
