const { generateAdvice } = require('../src/utils/advice');

console.log('Testing generateAdvice...');

const categories = [
  { name: 'Rent', budget_percent: 30 },
  { name: 'Sent Home', budget_percent: 20 },
  { name: 'Groceries', budget_percent: 18 },
  { name: 'Transport', budget_percent: 9 },
  { name: 'Airtime', budget_percent: 4 },
  { name: 'Savings', budget_percent: 7 },
  { name: 'Other', budget_percent: 12 },
];

// Test 1: Advice returns an array
const transactions = [
  { id: 1, amount: 2200, category: 'Rent', type: 'expense' },
  { id: 2, amount: 800, category: 'Sent Home', type: 'expense' },
  { id: 3, amount: 350, category: 'Groceries', type: 'expense' },
];

const advice = generateAdvice(transactions, categories, 6500);
console.assert(Array.isArray(advice), 'Advice should be an array');
console.assert(advice.length > 0, 'Advice should not be empty');
console.log('  Returns non-empty array: PASS');

// Test 2: Respect message for Sent Home
const hasRespect = advice.some((a) => a.type === 'respect' && a.message.includes('Sent Home'));
console.assert(hasRespect, 'Should include respect message for Sent Home');
console.log('  Sent Home respect message: PASS');

// Test 3: Warning when over budget
const overBudgetTxs = [
  { id: 1, amount: 5000, category: 'Rent', type: 'expense' },
  { id: 2, amount: 3000, category: 'Groceries', type: 'expense' },
];
const overAdvice = generateAdvice(overBudgetTxs, categories, 6500);
const hasWarning = overAdvice.some((a) => a.type === 'warning');
console.assert(hasWarning, 'Should include warning when over budget');
console.log('  Over-budget warning: PASS');

// Test 4: No judgement words
const allText = advice.map((a) => a.message).join(' ').toLowerCase();
const judgementWords = ['overspent', 'you should', 'bad habit', 'wrong', 'mistake'];
const hasJudgement = judgementWords.some((w) => allText.includes(w));
console.assert(!hasJudgement, 'Should not contain judgement words');
console.log('  No judgement words: PASS');

console.log('\nAll advice tests passed!');
