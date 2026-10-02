const { categorize } = require('../src/utils/categorize');

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error('  FAIL: ' + message);
    failures++;
  }
}

console.log('Testing categorize...');

const tests = [
  { merchant: 'Shoprite', recipient: '', expected: 'Groceries' },
  { merchant: 'Pick n Pay', recipient: '', expected: 'Groceries' },
  { merchant: 'Spaza Shop', recipient: 'Local Spaza', expected: 'Groceries' },
  { merchant: 'Mukuru', recipient: 'Mum - Harare', expected: 'Sent Home' },
  { merchant: 'Mukuru', recipient: 'Sister - Bulawayo', expected: 'Sent Home' },
  { merchant: 'Vodacom', recipient: '', expected: 'Airtime' },
  { merchant: 'MTN', recipient: '', expected: 'Airtime' },
  { merchant: 'Taxi', recipient: 'Taxi Rank', expected: 'Transport' },
  { merchant: 'Bus', recipient: 'Putco', expected: 'Transport' },
  { merchant: 'Mr Price Property', recipient: 'Landlord', expected: 'Rent' },
  { merchant: 'Savings', recipient: 'Savings Account', expected: 'Savings' },
  { merchant: 'Unknown', recipient: '', expected: 'Other' },
  { merchant: 'Chicken Inn', recipient: '', expected: 'Other' },
];

let passed = 0;
for (const test of tests) {
  const result = categorize(test.merchant, test.recipient);
  if (result === test.expected) {
    passed++;
  } else {
    console.error('  FAIL: categorize("' + test.merchant + '", "' + test.recipient + '") = "' + result + '", expected "' + test.expected + '"');
    failures++;
  }
}

console.log('  ' + passed + ' passed, ' + failures + ' failed');

if (failures > 0) {
  console.error('\nCategorize tests failed!');
  process.exit(1);
} else {
  console.log('All categorize tests passed!');
  process.exit(0);
}
