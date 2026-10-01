// Flag rules — each returns an array of flag objects
// Flag shape: { type, severity, message, next_step, transaction_id }

/**
 * Rule 1: Pace check
 * Flags when a category is spending faster than the month is progressing.
 * e.g. 70% of budget used but only 40% of the month gone.
 */
function paceCheck(transactions, categories, incomeTotal) {
  const flags = [];
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthProgress = dayOfMonth / daysInMonth;

  for (const cat of categories) {
    const budget = incomeTotal * (cat.budget_percent / 100);
    if (budget === 0) continue;

    const spent = transactions
      .filter((t) => t.category === cat.name)
      .reduce((sum, t) => sum + t.amount, 0);

    const spendRate = spent / budget;

    if (spendRate > monthProgress * 1.3 && spendRate > 0.5) {
      flags.push({
        type: 'pace_check',
        severity: spendRate > 0.9 ? 'high' : 'medium',
        message: `You've used ${Math.round(spendRate * 100)}% of your ${cat.name} envelope, but only ${Math.round(monthProgress * 100)}% of the month is gone.`,
        next_step: `Consider slowing down on ${cat.name} spending, or move some budget from another category.`,
        transaction_id: null,
      });
    }
  }

  return flags;
}

/**
 * Rule 2: Big transaction vs category average
 * Flags a single transaction that is 3x or more the category's average.
 */
function bigTransaction(transactions) {
  const flags = [];
  const byCategory = {};

  for (const t of transactions) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }

  for (const [category, txs] of Object.entries(byCategory)) {
    if (txs.length < 2) continue;

    for (const t of txs) {
      const others = txs.filter((x) => x.id !== t.id);
      const avg = others.reduce((s, x) => s + x.amount, 0) / others.length;

      if (t.amount > avg * 3 && t.amount > 200) {
        flags.push({
          type: 'unusual_amount',
          severity: 'medium',
          message: `R${t.amount} at ${t.merchant} is much bigger than your usual ${category} spend (avg R${Math.round(avg)}).`,
          next_step: 'Check this was intentional. If not, contact your bank or Mukuru immediately.',
          transaction_id: t.id,
        });
      }
    }
  }

  return flags;
}

/**
 * Rule 3: Duplicate transactions
 * Flags same amount + same recipient within 10 minutes.
 */
function duplicateTransactions(transactions) {
  const flags = [];
  const seen = new Map();

  for (const t of transactions) {
    const key = `${t.amount}|${t.recipient}`;
    if (seen.has(key)) {
      const prev = seen.get(key);
      const diff = Math.abs(new Date(t.date) - new Date(prev.date));
      if (diff < 10 * 60 * 1000) {
        flags.push({
          type: 'duplicate',
          severity: 'high',
          message: `Two identical transactions of R${t.amount} to ${t.recipient} within ${Math.round(diff / 60000)} minutes.`,
          next_step: 'This could be a double-charge or a mistake. Check with your bank.',
          transaction_id: t.id,
        });
      }
    }
    seen.set(key, t);
  }

  return flags;
}

/**
 * Rule 4: New recipient with large amount
 * Flags a first-time recipient receiving more than R500.
 */
function newRecipientLarge(transactions) {
  const flags = [];
  const knownRecipients = new Set();

  // Build set of known recipients from earlier transactions
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  for (let i = 0; i < sorted.length; i++) {
    const t = sorted[i];
    if (!knownRecipients.has(t.recipient) && t.amount > 500) {
      flags.push({
        type: 'new_recipient_large',
        severity: 'high',
        message: `R${t.amount} sent to ${t.recipient} — someone you haven't sent this much to before.`,
        next_step: 'If you don\'t recognise this, report it to Mukuru or your bank right away.',
        transaction_id: t.id,
      });
    }
    knownRecipients.add(t.recipient);
  }

  return flags;
}

/**
 * Rule 5: Suspicious merchant keywords
 * Flags transactions with scam-like keywords.
 */
function suspiciousMerchant(transactions) {
  const scamKeywords = ['verify', 'prize', 'urgent', 'claim', 'lottery', 'winner', 'bonus', 'free money'];
  const flags = [];

  for (const t of transactions) {
    const text = `${t.merchant} ${t.recipient}`.toLowerCase();
    for (const keyword of scamKeywords) {
      if (text.includes(keyword)) {
        flags.push({
          type: 'suspicious_merchant',
          severity: 'high',
          message: `"${t.merchant}" contains the word "${keyword}" — this is a common scam pattern.`,
          next_step: 'Do not engage. If you already sent money, contact Mukuru support immediately.',
          transaction_id: t.id,
        });
        break;
      }
    }
  }

  return flags;
}

/**
 * Run all flag rules and return combined results.
 */
function runAllFlags(transactions, categories, incomeTotal) {
  return [
    ...paceCheck(transactions, categories, incomeTotal),
    ...bigTransaction(transactions),
    ...duplicateTransactions(transactions),
    ...newRecipientLarge(transactions),
    ...suspiciousMerchant(transactions),
  ];
}

module.exports = {
  runAllFlags,
  paceCheck,
  bigTransaction,
  duplicateTransactions,
  newRecipientLarge,
  suspiciousMerchant,
};
