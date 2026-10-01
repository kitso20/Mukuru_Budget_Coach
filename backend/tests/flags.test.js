const { paceCheck, bigTransaction, duplicateTransactions, newRecipientLarge, suspiciousMerchant } = require('../src/utils/flags');

// Test helpers
const mockCategories = [
  { name: 'Rent', budget_percent: 30 },
  { name: 'Groceries', budget_percent: 18 },
  { name: 'Transport', budget_percent: 9 },
];

const mockIncome = 6500;

function makeTx(id, amount, merchant, recipient, date, category) {
  return { id, amount, merchant, recipient, date, category };
}

// --- paceCheck ---
console.log('Testing paceCheck...');

// Should flag when spending is way ahead of month progress
const paceTxs = [
  makeTx(1, 1800, 'Landlord', 'Landlord', '2026-09-02', 'Rent'), // 92% of R1950 budget
];
const paceFlags = paceCheck(paceTxs, mockCategories, mockIncome);
console.assert(paceFlags.length > 0, 'paceCheck should flag overspending');
console.assert(paceFlags[0].type === 'pace_check', 'Should return pace_check type');
console.log('  paceCheck: PASS');

// --- bigTransaction ---
console.log('Testing bigTransaction...');

const bigTxs = [
  makeTx(1, 50, 'Shoprite', 'Shoprite', '2026-09-02', 'Groceries'),
  makeTx(2, 60, 'Shoprite', 'Shoprite', '2026-09-05', 'Groceries'),
  makeTx(3, 500, 'Shoprite', 'Shoprite', '2026-09-08', 'Groceries'), // 10x average
];
const bigFlags = bigTransaction(bigTxs);
console.assert(bigFlags.length > 0, 'bigTransaction should flag unusual amounts');
console.assert(bigFlags[0].type === 'unusual_amount', 'Should return unusual_amount type');
console.assert(bigFlags[0].transaction_id === 3, 'Should flag the right transaction');
console.log('  bigTransaction: PASS');

// --- duplicateTransactions ---
console.log('Testing duplicateTransactions...');

const dupTxs = [
  makeTx(1, 1500, 'Unknown', 'New Contact', '2026-09-23T10:00:00', 'Other'),
  makeTx(2, 1500, 'Unknown', 'New Contact', '2026-09-23T10:05:00', 'Other'), // 5 min apart
];
const dupFlags = duplicateTransactions(dupTxs);
console.assert(dupFlags.length > 0, 'duplicateTransactions should flag duplicates');
console.assert(dupFlags[0].type === 'duplicate', 'Should return duplicate type');
console.log('  duplicateTransactions: PASS');

// --- newRecipientLarge ---
console.log('Testing newRecipientLarge...');

const newRecipientTxs = [
  makeTx(1, 100, 'Mukuru', 'Mum', '2026-09-01', 'Sent Home'),
  makeTx(2, 800, 'Unknown', 'Stranger', '2026-09-15', 'Other'), // new recipient, large amount
];
const newFlags = newRecipientLarge(newRecipientTxs);
console.assert(newFlags.length > 0, 'newRecipientLarge should flag new recipients');
console.assert(newFlags[0].type === 'new_recipient_large', 'Should return new_recipient_large type');
console.log('  newRecipientLarge: PASS');

// --- suspiciousMerchant ---
console.log('Testing suspiciousMerchant...');

const scamTxs = [
  makeTx(1, 2000, 'Prize Claim', 'Verify Account', '2026-09-29', 'Other'),
];
const scamFlags = suspiciousMerchant(scamTxs);
console.assert(scamFlags.length > 0, 'suspiciousMerchant should flag scam keywords');
console.assert(scamFlags[0].type === 'suspicious_merchant', 'Should return suspicious_merchant type');
console.log('  suspiciousMerchant: PASS');

console.log('\nAll flag tests passed!');
