const { calculateSummary } = require('../src/utils/summary');

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error('  FAIL: ' + message);
    failures++;
  }
}

console.log('Testing calculateSummary...');

const categories = [
  { name: 'Rent', budget_percent: 30 },
  { name: 'Groceries', budget_percent: 18 },
  { name: 'Transport', budget_percent: 9 },
];

const transactions = [
  { id: 1, amount: 1950, category: 'Rent' },
  { id: 2, amount: 500, category: 'Groceries' },
  { id: 3, amount: 300, category: 'Groceries' },
  { id: 4, amount: 200, category: 'Transport' },
];

const income = 6500;
const summary = calculateSummary(transactions, categories, income);

// Test 1: Income total
assert(summary.income_total === 6500, 'Income total should be 6500');
console.log('  Income total: done');

// Test 2: Total spent
assert(summary.total_spent === 2950, 'Total spent should be 2950');
console.log('  Total spent: done');

// Test 3: Balance
assert(summary.balance === 3550, 'Balance should be 3550');
console.log('  Balance: done');

// Test 4: Category count
assert(summary.categories.length === 3, 'Should have 3 categories');
console.log('  Category count: done');

// Test 5: Rent category
const rent = summary.categories.find((c) => c.name === 'Rent');
assert(rent.budget === 1950, 'Rent budget should be 1950');
assert(rent.spent === 1950, 'Rent spent should be 1950');
assert(rent.remaining === 0, 'Rent remaining should be 0');
assert(rent.percent_used === 100, 'Rent percent_used should be 100');
console.log('  Rent category: done');

// Test 6: Groceries category
const groceries = summary.categories.find((c) => c.name === 'Groceries');
assert(groceries.budget === 1170, 'Groceries budget should be 1170');
assert(groceries.spent === 800, 'Groceries spent should be 800');
assert(groceries.remaining === 370, 'Groceries remaining should be 370');
console.log('  Groceries category: done');

if (failures > 0) {
  console.error('\n' + failures + ' test(s) failed!');
  process.exit(1);
} else {
  console.log('\nAll summary tests passed!');
  process.exit(0);
}
