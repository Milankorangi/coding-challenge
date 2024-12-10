const fs = require('fs');

//Currency formatter helper function
function formatCurrency(currency) {
  return '$' + currency.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Function to calculate revenue
function calculateRevenue(data) {
  return data
    .filter(currentData => currentData.account_category === "revenue")
    .reduce((total, currentData) => total + currentData.total_value, 0);
}

//Function to calculate expenses
function calculateExpenses(data) {
  return data
    .filter(currentData => currentData.account_category === "expense")
    .reduce((total, currentData) => total + currentData.total_value, 0);
}

//Function to calculate Gross Profit Margin
function calculateGrossProfitMargin(data, revenue) {
  const totalSale = data
    .filter(currentData => currentData.account_type === "sales" && currentData.value_type === "debit")
    .reduce((total, currentData) => total + currentData.total_value, 0);
  
  if (revenue === 0) return 0;
  return ((totalSale / revenue) * 100).toFixed(2);
}

//Function to calculate Net Profit Margin calculation
function calculateNetProfitMargin(revenue, expenses) {
  if (revenue === 0) return 0;
  return (((revenue - expenses) / revenue) * 100).toFixed(2);
}

//Function to calculate Working Capital Ratio
function calculateWorkingCapitalRatio(data) {
  //Adding assets where value_type is debit and account_type is one of current, bank or current_accounts_receivable
  const totalAssetsDebits = data
    .filter(currentData => currentData.account_category === "assets" && currentData.value_type === "debit" && 
                     (currentData.account_type === "current" || currentData.account_type === "bank" || currentData.account_type === "current_accounts_receivable"))
    .reduce((total, currentData) => total + currentData.total_value, 0);

  //Adding assets where value_type is credit and account_type is one of current, bank or current_accounts_receivable
  const totalAssetsCredits = data
    .filter(currentData => currentData.account_category === "assets" && currentData.value_type === "credit" && 
                     (currentData.account_type === "current" || currentData.account_type === "bank" || currentData.account_type === "current_accounts_receivable"))
    .reduce((total, currentData) => total + currentData.total_value, 0);
  
  //Net assets calculation
  const totalAssests = totalAssetsDebits - totalAssetsCredits;

  //Adding liabilities where value_type is credit and account_type is one of current or current_accounts_payable
  const totalLiabilitiesCredits = data
    .filter(currentData => currentData.account_category === "liability" && currentData.value_type === "credit" &&
                     (currentData.account_type === "current" || currentData.account_type === "current_accounts_payable"))
    .reduce((total, currentData) => total + currentData.total_value, 0);

  //Adding liabilities where value_type is debit and account_type is one of current or current_accounts_payable
  const totalLiabilitiesDebits = data
    .filter(currentData => currentData.account_category === "liability" && currentData.value_type === "debit" &&
                     (currentData.account_type === "current" || currentData.account_type === "current_accounts_payable"))
    .reduce((total, currentData) => total + currentData.total_value, 0);

  //Net liabilities calculation
  const totalLiabilities = totalLiabilitiesCredits - totalLiabilitiesDebits;

  if (totalLiabilities === 0) return 0;
  return ((totalAssests / totalLiabilities) * 100).toFixed(2);
}


// Read JSON data from file
fs.readFile('data.json', 'utf8', (err, data) => {
    //handle error while reading json data
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Parse JSON data
    const parsedData = JSON.parse(data);

    //Calculation after JSON data reading success
    const revenue = calculateRevenue(parsedData.data);
    const expenses = calculateExpenses(parsedData.data);
    const grossProfitMargin = calculateGrossProfitMargin(parsedData.data, revenue);
    const netProfitMargin = calculateNetProfitMargin(revenue, expenses);
    const workingCapitalRatio = calculateWorkingCapitalRatio(parsedData.data);

    // Print the outputs
    console.log("Revenue:", formatCurrency(revenue));
    console.log("Expenses:", formatCurrency(expenses));
    console.log("Gross Profit Margin:", grossProfitMargin + "%");
    console.log("Net Profit Margin:", netProfitMargin + "%");
    console.log("Working Capital Ratio:", workingCapitalRatio);
});

// Export functions 
module.exports = {
    formatCurrency,
    calculateRevenue,
    calculateExpenses,
    calculateGrossProfitMargin,
    calculateNetProfitMargin,
    calculateWorkingCapitalRatio
  };