const { paceCheck, bigTransaction, duplicateTransactions, newRecipientLarge, suspiciousMerchant } = require('../src/utils/flags');

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error('  FAIL: ' + message);
    failures++;
  }
}

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

const paceTxs = [
  makeTx(1, 1800, 'Landlord', 'Landlord', '2026-09-02', 'Rent'),
];
const paceFlags = paceCheck(paceTxs, mockCategories, mockIncome);
assert(paceFlags.length > 0, 'paceCheck should flag overspending');
if (paceFlags.length > 0) {
  assert(paceFlags[0].type === 'pace_check', 'Should return pace_check type');
}
console.log('  paceCheck: done');

// --- bigTransaction ---
console.log('Testing bigTransaction...');

// Average = (50 + 60) / 2 = 55. 800 > 55 * 3 = 165. Should flag.
const bigTxs = [
  makeTx(1, 50, 'Shoprite', 'Shoprite', '2026-09-02', 'Groceries'),
  makeTx(2, 60, 'Shoprite', 'Shoprite', '2026-09-05', 'Groceries'),
  makeTx(3, 800, 'Shoprite', 'Shoprite', '2026-09-08', 'Groceries'),
];
const bigFlags = bigTransaction(bigTxs);
assert(bigFlags.length > 0, 'bigTransaction should flag unusual amounts');
if (bigFlags.length > 0) {
  assert(bigFlags[0].type === 'unusual_amount', 'Should return unusual_amount type');
  assert(bigFlags[0].transaction_id === 3, 'Should flag the right transaction');
}
console.log('  bigTransaction: done');

// --- duplicateTransactions ---
console.log('Testing duplicateTransactions...');

const dupTxs = [
  makeTx(1, 1500, 'Unknown', 'New Contact', '2026-09-23T10:00:00', 'Other'),
  makeTx(2, 1500, 'Unknown', 'New Contact', '2026-09-23T10:05:00', 'Other'),
];
const dupFlags = duplicateTransactions(dupTxs);
assert(dupFlags.length > 0, 'duplicateTransactions should flag duplicates');
if (dupFlags.length > 0) {
  assert(dupFlags[0].type === 'duplicate', 'Should return duplicate type');
}
console.log('  duplicateTransactions: done');

// --- newRecipientLarge ---
console.log('Testing newRecipientLarge...');

// First establish "Mum" as known with small amounts, then send large to new recipient
const newRecipientTxs = [
  makeTx(1, 100, 'Mukuru', 'Mum', '2026-09-01', 'Sent Home'),
  makeTx(2, 150, 'Mukuru', 'Mum', '2026-09-10', 'Sent Home'),
  makeTx(3, 800, 'Unknown', 'Stranger', '2026-09-15', 'Other'),
];
const newFlags = newRecipientLarge(newRecipientTxs);
assert(newFlags.length > 0, 'newRecipientLarge should flag new recipients');
if (newFlags.length > 0) {
  assert(newFlags[0].type === 'new_recipient_large', 'Should return new_recipient_large type');
}
console.log('  newRecipientLarge: done');

// --- suspiciousMerchant ---
console.log('Testing suspiciousMerchant...');

const scamTxs = [
  makeTx(1, 2000, 'Prize Claim', 'Verify Account', '2026-09-29', 'Other'),
];
const scamFlags = suspiciousMerchant(scamTxs);
assert(scamFlags.length > 0, 'suspiciousMerchant should flag scam keywords');
if (scamFlags.length > 0) {
  assert(scamFlags[0].type === 'suspicious_merchant', 'Should return suspicious_merchant type');
}
console.log('  suspiciousMerchant: done');

// --- Result ---
if (failures > 0) {
  console.error('\n' + failures + ' test(s) failed!');
  process.exit(1);
} else {
  console.log('\nAll flag tests passed!');
  process.exit(0);
}
