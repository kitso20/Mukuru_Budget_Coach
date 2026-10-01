// Auto-categorisation by keyword matching
// Returns the best-matching category name, or 'Other' if no match.

const KEYWORD_MAP = {
  Rent: ['rent', 'landlord', 'property', 'housing', 'accommodation'],
  'Sent Home': ['mukuru', 'mum', 'dad', 'sister', 'brother', 'harare', 'bulawayo', 'zimbabwe', 'remittance', 'send home', 'family'],
  Groceries: ['shoprite', 'pick n pay', 'spaza', 'supermarket', 'groceries', 'food', 'fruit', 'veg', 'butcher', 'checkers', 'woolworths'],
  Transport: ['taxi', 'bus', 'putco', 'uber', 'bolt', 'train', 'petrol', 'fuel', 'transport', 'rank'],
  Airtime: ['vodacom', 'mtn', 'telkom', 'cell c', 'airtime', 'data', 'bundle'],
  Savings: ['savings', 'invest', 'stokvel', 'savings account'],
  Other: [], // fallback
};

function categorize(merchant = '', recipient = '') {
  const text = `${merchant} ${recipient}`.toLowerCase();

  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    if (category === 'Other') continue;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  return 'Other';
}

module.exports = { categorize };
