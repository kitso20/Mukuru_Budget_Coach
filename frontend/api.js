// API client for Mukuru Budget Coach
// Transforms backend API response to match dashboard expectations

export async function getSummary() {
  try {
    const response = await fetch('/api/summary', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendData = await response.json();

    // Transform backend data to match dashboard expectations
    const summary = {
      income_total: backendData.totalIncome || 0,
      categories: backendData.categories.map(category => ({
        name: category.category,
        percent_used: category.percent > 0 ? (category.spent / category.budget) * 100 : 0,
        spent: category.spent,
        budget: category.budget,
        remaining: category.remaining
      }))
    };

    return summary;
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
}

export async function getCategories() {
  try {
    const response = await fetch('/api/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function addIncome(data) {
  try {
    const response = await fetch('/api/income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding income:', error);
    throw error;
  }
}

export async function updateCategories(categoriesData) {
  try {
    const response = await fetch('/api/categories', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(categoriesData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating categories:', error);
    throw error;
  }
}

export async function addTransaction(data) {
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}