/**
 * Format a number as Indian Rupee currency.
 * e.g. 150000 → "₹1,50,000"
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  // Indian numbering: last 3 digits, then groups of 2
  const str = Math.abs(Math.round(num)).toString();
  if (str.length <= 3) return `₹${num < 0 ? '-' : ''}${str}`;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  return `₹${num < 0 ? '-' : ''}${formatted}`;
}

/**
 * Compact currency: ₹1.5L, ₹50K, ₹500
 */
export function formatCompactCurrency(amount) {
  if (amount == null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  if (num >= 100000) return `₹${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
  return `₹${num}`;
}
