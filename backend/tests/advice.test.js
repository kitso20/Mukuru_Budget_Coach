const { generateAdvice } = require('../src/utils/advice');

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error('  FAIL: ' + message);
    failures++;
  }
}

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
  { id: 2, amount: 1100, category: 'Sent Home', type: 'expense' },
  { id: 3, amount: 350, category: 'Groceries', type: 'expense' },
];

const advice = generateAdvice(transactions, categories, 6500);
assert(Array.isArray(advice), 'Advice should be an array');
assert(advice.length > 0, 'Advice should not be empty');
console.log('  Returns non-empty array: done');

// Test 2: Respect message for Sent Home
const hasRespect = advice.some((a) => a.type === 'respect' && a.message.includes('home this month'));
assert(hasRespect, 'Should include respect message for Sent Home');
console.log('  Sent Home respect message: done');

// Test 3: Warning when over budget
const overBudgetTxs = [
  { id: 1, amount: 5000, category: 'Rent', type: 'expense' },
  { id: 2, amount: 3000, category: 'Groceries', type: 'expense' },
];
const overAdvice = generateAdvice(overBudgetTxs, categories, 6500);
const hasWarning = overAdvice.some((a) => a.type === 'warning');
assert(hasWarning, 'Should include warning when over budget');
console.log('  Over-budget warning: done');

// Test 4: No judgement words
const allText = advice.map((a) => a.message).join(' ').toLowerCase();
const judgementWords = ['overspent', 'you should', 'bad habit', 'wrong', 'mistake'];
const hasJudgement = judgementWords.some((w) => allText.includes(w));
assert(!hasJudgement, 'Should not contain judgement words');
console.log('  No judgement words: done');

if (failures > 0) {
  console.error('\n' + failures + ' test(s) failed!');
  process.exit(1);
} else {
  console.log('\nAll advice tests passed!');
  process.exit(0);
}
