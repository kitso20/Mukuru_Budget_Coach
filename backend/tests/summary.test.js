const { calculateSummary } = require('../src/utils/summary');

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
console.assert(summary.income_total === 6500, 'Income total should be 6500');
console.log('  Income total: PASS');

// Test 2: Total spent
console.assert(summary.total_spent === 2950, 'Total spent should be 2950');
console.log('  Total spent: PASS');

// Test 3: Balance
console.assert(summary.balance === 3550, 'Balance should be 3550');
console.log('  Balance: PASS');

// Test 4: Category count
console.assert(summary.categories.length === 3, 'Should have 3 categories');
console.log('  Category count: PASS');

// Test 5: Rent category
const rent = summary.categories.find((c) => c.name === 'Rent');
console.assert(rent.budget === 1950, 'Rent budget should be 1950');
console.assert(rent.spent === 1950, 'Rent spent should be 1950');
console.assert(rent.remaining === 0, 'Rent remaining should be 0');
console.assert(rent.percent_used === 100, 'Rent percent_used should be 100');
console.log('  Rent category: PASS');

// Test 6: Groceries category
const groceries = summary.categories.find((c) => c.name === 'Groceries');
console.assert(groceries.budget === 1170, 'Groceries budget should be 1170');
console.assert(groceries.spent === 800, 'Groceries spent should be 800');
console.assert(groceries.remaining === 370, 'Groceries remaining should be 370');
console.log('  Groceries category: PASS');

console.log('\nAll summary tests passed!');
