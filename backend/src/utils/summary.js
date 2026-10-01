// Summary calculation — per-category used / remaining / percent_used

function calculateSummary(transactions, categories, incomeTotal) {
  const categorySummaries = categories.map((cat) => {
    const budget = incomeTotal * (cat.budget_percent / 100);
    const spent = transactions
      .filter((t) => t.category === cat.name)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      name: cat.name,
      budget: Math.round(budget * 100) / 100,
      spent: Math.round(spent * 100) / 100,
      remaining: Math.round((budget - spent) * 100) / 100,
      percent_used: budget > 0 ? Math.round((spent / budget) * 100) : 0,
    };
  });

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);

  return {
    income_total: incomeTotal,
    total_spent: Math.round(totalSpent * 100) / 100,
    balance: Math.round((incomeTotal - totalSpent) * 100) / 100,
    categories: categorySummaries,
  };
}

module.exports = { calculateSummary };
