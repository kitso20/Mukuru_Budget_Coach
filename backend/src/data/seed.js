// Seed data for Grace — a Zimbabwean in SA supporting two households
// Salary: R6,500/month. Categories use default percentages.

const DEFAULT_CATEGORIES = [
  { name: 'Rent', budget_percent: 30 },
  { name: 'Sent Home', budget_percent: 20 },
  { name: 'Groceries', budget_percent: 18 },
  { name: 'Transport', budget_percent: 9 },
  { name: 'Airtime', budget_percent: 4 },
  { name: 'Savings', budget_percent: 7 },
  { name: 'Other', budget_percent: 12 },
];

const SALARY = { amount: 6500, source: 'Salary', date: '2026-09-01' };

const INCOMES = [
  { amount: 6500, source: 'Salary', date: '2026-07-01' },
  { amount: 6500, source: 'Salary', date: '2026-08-01' },
  { amount: 800, source: 'Side hustle', date: '2026-08-15' },
  SALARY,
  { amount: 1200, source: 'Side hustle', date: '2026-09-20' },
  { amount: 6500, source: 'Salary', date: '2026-10-01' },
];

// ~40 realistic transactions across September 2026
const TRANSACTIONS = [
  // July 2026
  { amount: 2200, merchant: 'Mr Price Property', recipient: 'Landlord', date: '2026-07-01', category: 'Rent' },
  { amount: 1000, merchant: 'Mukuru', recipient: 'Mum - Harare', date: '2026-07-05', category: 'Sent Home' },
  { amount: 410, merchant: 'Shoprite', recipient: 'Shoprite', date: '2026-07-03', category: 'Groceries' },
  { amount: 320, merchant: 'Pick n Pay', recipient: 'Pick n Pay', date: '2026-07-17', category: 'Groceries' },
  { amount: 50, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-07-08', category: 'Transport' },
  { amount: 60, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-07-22', category: 'Transport' },
  { amount: 100, merchant: 'Vodacom', recipient: 'Vodacom', date: '2026-07-10', category: 'Airtime' },
  { amount: 500, merchant: 'Savings', recipient: 'Savings Account', date: '2026-07-15', category: 'Savings' },
  { amount: 300, merchant: 'City Power', recipient: 'Electricity', date: '2026-07-06', category: 'Other' },
  { amount: 95, merchant: 'Chicken Inn', recipient: 'Chicken Inn', date: '2026-07-19', category: 'Other' },

  // August 2026
  { amount: 2200, merchant: 'Mr Price Property', recipient: 'Landlord', date: '2026-08-01', category: 'Rent' },
  { amount: 1300, merchant: 'Mukuru', recipient: 'Sister - Bulawayo', date: '2026-08-04', category: 'Sent Home' },
  { amount: 450, merchant: 'Shoprite', recipient: 'Shoprite', date: '2026-08-02', category: 'Groceries' },
  { amount: 370, merchant: 'Pick n Pay', recipient: 'Pick n Pay', date: '2026-08-19', category: 'Groceries' },
  { amount: 40, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-08-05', category: 'Transport' },
  { amount: 55, merchant: 'Bus', recipient: 'Putco', date: '2026-08-12', category: 'Transport' },
  { amount: 45, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-08-26', category: 'Transport' },
  { amount: 50, merchant: 'MTN', recipient: 'MTN', date: '2026-08-09', category: 'Airtime' },
  { amount: 500, merchant: 'Savings', recipient: 'Savings Account', date: '2026-08-10', category: 'Savings' },
  { amount: 290, merchant: 'City Power', recipient: 'Electricity', date: '2026-08-07', category: 'Other' },
  { amount: 110, merchant: 'KFC', recipient: 'KFC', date: '2026-08-14', category: 'Other' },
  { amount: 180, merchant: 'Mr Price', recipient: 'Clothing', date: '2026-08-23', category: 'Other' },

  // Rent
  { amount: 2200, merchant: 'Mr Price Property', recipient: 'Landlord', date: '2026-09-01', category: 'Rent' },

  // Sent home (remittances via Mukuru)
  { amount: 800, merchant: 'Mukuru', recipient: 'Mum - Harare', date: '2026-09-03', category: 'Sent Home' },
  { amount: 500, merchant: 'Mukuru', recipient: 'Mum - Harare', date: '2026-09-15', category: 'Sent Home' },
  { amount: 300, merchant: 'Mukuru', recipient: 'Sister - Bulawayo', date: '2026-09-22', category: 'Sent Home' },

  // Groceries (Shoprite, Pick n Pay, local spaza)
  { amount: 350, merchant: 'Shoprite', recipient: 'Shoprite', date: '2026-09-02', category: 'Groceries' },
  { amount: 280, merchant: 'Pick n Pay', recipient: 'Pick n Pay', date: '2026-09-06', category: 'Groceries' },
  { amount: 420, merchant: 'Shoprite', recipient: 'Shoprite', date: '2026-09-10', category: 'Groceries' },
  { amount: 190, merchant: 'Spaza Shop', recipient: 'Local Spaza', date: '2026-09-14', category: 'Groceries' },
  { amount: 310, merchant: 'Shoprite', recipient: 'Shoprite', date: '2026-09-18', category: 'Groceries' },
  { amount: 250, merchant: 'Pick n Pay', recipient: 'Pick n Pay', date: '2026-09-25', category: 'Groceries' },

  // Transport (taxi, bus)
  { amount: 40, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-09-02', category: 'Transport' },
  { amount: 60, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-09-05', category: 'Transport' },
  { amount: 35, merchant: 'Bus', recipient: 'Putco', date: '2026-09-08', category: 'Transport' },
  { amount: 45, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-09-12', category: 'Transport' },
  { amount: 50, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-09-16', category: 'Transport' },
  { amount: 40, merchant: 'Bus', recipient: 'Putco', date: '2026-09-20', category: 'Transport' },
  { amount: 55, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-09-26', category: 'Transport' },

  // Airtime & data
  { amount: 50, merchant: 'Vodacom', recipient: 'Vodacom', date: '2026-09-03', category: 'Airtime' },
  { amount: 100, merchant: 'Vodacom', recipient: 'Vodacom', date: '2026-09-11', category: 'Airtime' },
  { amount: 30, merchant: 'MTN', recipient: 'MTN', date: '2026-09-19', category: 'Airtime' },

  // Savings
  { amount: 500, merchant: 'Savings', recipient: 'Savings Account', date: '2026-09-05', category: 'Savings' },

  // Other (electricity, takeaway, clothing, etc.)
  { amount: 300, merchant: 'City Power', recipient: 'Electricity', date: '2026-09-04', category: 'Other' },
  { amount: 85, merchant: 'Chicken Inn', recipient: 'Chicken Inn', date: '2026-09-07', category: 'Other' },
  { amount: 120, merchant: 'KFC', recipient: 'KFC', date: '2026-09-13', category: 'Other' },
  { amount: 150, merchant: 'Mr Price', recipient: 'Clothing', date: '2026-09-17', category: 'Other' },
  { amount: 200, merchant: 'Clicks', recipient: 'Toiletries', date: '2026-09-21', category: 'Other' },
  { amount: 90, merchant: 'Chicken Inn', recipient: 'Chicken Inn', date: '2026-09-24', category: 'Other' },
  { amount: 110, merchant: 'Shoprite', recipient: 'Shoprite', date: '2026-09-27', category: 'Other' },
  { amount: 75, merchant: 'Vodacom', recipient: 'Vodacom', date: '2026-09-28', category: 'Other' },

  // Suspicious-looking transactions (for flag testing)
  { amount: 1500, merchant: 'Unknown', recipient: 'New Contact', date: '2026-09-23', category: 'Other' },
  { amount: 1500, merchant: 'Unknown', recipient: 'New Contact', date: '2026-09-23', category: 'Other' }, // duplicate
  { amount: 2000, merchant: 'Prize Claim', recipient: 'Verify Account', date: '2026-09-29', category: 'Other' },

  // October 2026
  { amount: 2200, merchant: 'Mr Price Property', recipient: 'Landlord', date: '2026-10-01', category: 'Rent' },
  { amount: 600, merchant: 'Mukuru', recipient: 'Mum - Harare', date: '2026-10-01', category: 'Sent Home' },
  { amount: 380, merchant: 'Shoprite', recipient: 'Shoprite', date: '2026-10-02', category: 'Groceries' },
  { amount: 45, merchant: 'Taxi', recipient: 'Taxi Rank', date: '2026-10-02', category: 'Transport' },
  { amount: 50, merchant: 'Vodacom', recipient: 'Vodacom', date: '2026-10-02', category: 'Airtime' },
];

module.exports = { DEFAULT_CATEGORIES, SALARY, INCOMES, TRANSACTIONS };
