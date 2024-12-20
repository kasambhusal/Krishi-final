// /utils/formatNumber.js

/**
 * Format numbers into shorthand notation (e.g., 1.2K, 1.2M, 1.2B)
 * @param {number} num - The number to format
 * @returns {string} The formatted number
 */
export const formatNumber = (num) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B'; // Billion
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M'; // Million
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K'; // Thousand
    }
    return num.toString();
  };
  