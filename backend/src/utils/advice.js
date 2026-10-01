// Advice generator — plain-language tips derived from the numbers
// Rules:
// - No judgement words ("overspent", "you should", "bad habit")
// - Respect remittances as a priority, not a leak
// - One nudge at a time
// - Give options, not orders
// - Celebrate before advising

function generateAdvice(transactions, categories, incomeTotal) {
  const advice = [];
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - dayOfMonth;

  // Per-category advice
  for (const cat of categories) {
    const budget = incomeTotal * (cat.budget_percent / 100);
    if (budget === 0) continue;

    const spent = transactions
      .filter((t) => t.category === cat.name)
      .reduce((sum, t) => sum + t.amount, 0);

    const percentUsed = Math.round((spent / budget) * 100);
    const remaining = budget - spent;

    // Celebrate if on track
    if (percentUsed <= 50 && daysLeft > 5) {
      advice.push({
        type: 'celebrate',
        message: `You're doing well on ${cat.name} — ${percentUsed}% used with ${daysLeft} days to go.`,
      });
    }

    // Nudge if running low
    if (percentUsed >= 80 && remaining > 0) {
      advice.push({
        type: 'nudge',
        message: `You've used ${percentUsed}% of your ${cat.name} envelope with ${daysLeft} days left. You have R${Math.round(remaining)} remaining — that's about R${Math.round(remaining / daysLeft)} per day.`,
      });
    }

    // Category-specific tips
    if (cat.name === 'Sent Home' && percentUsed >= 80) {
      advice.push({
        type: 'respect',
        message: `You've sent R${Math.round(spent)} home this month — that's a big commitment and it's important. If you need to adjust, even R50 less per week helps without letting anyone down.`,
      });
    }
  }

  // Overall balance advice
  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const balance = incomeTotal - totalSpent;

  if (balance < 0) {
    advice.push({
      type: 'warning',
      message: `You're currently R${Math.round(Math.abs(balance))} over your income for this month. Here's an option: could you pause one non-essential category for the rest of the month?`,
    });
  } else if (balance > 0 && daysLeft > 3) {
    advice.push({
      type: 'positive',
      message: `You have R${Math.round(balance)} left with ${daysLeft} days to go. That's R${Math.round(balance / daysLeft)} per day — you're in a good spot.`,
    });
  }

  // Savings goal nudge
  const savingsCat = categories.find((c) => c.name === 'Savings');
  if (savingsCat) {
    const savingsBudget = incomeTotal * (savingsCat.budget_percent / 100);
    const saved = transactions
      .filter((t) => t.category === 'Savings')
      .reduce((s, t) => s + t.amount, 0);

    if (saved < savingsBudget * 0.5 && daysLeft < 10) {
      advice.push({
        type: 'goal',
        message: `You're R${Math.round(savingsBudget - saved)} away from your savings goal. Even R${Math.round((savingsBudget - saved) / daysLeft)} a day gets you there.`,
      });
    }
  }

  return advice;
}

module.exports = { generateAdvice };
