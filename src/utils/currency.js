
const VND_TO_USD_RATE = 0.000041; // 1 VND = ~0.000041 USD (as of 2024)

/**
 * Convert VND amount to USD
 * @param {number} vndAmount 
 * @returns {number} 
 */
export const convertVNDtoUSD = (vndAmount) => {
  if (!vndAmount || vndAmount <= 0) return 0;

  const usdAmount = vndAmount * VND_TO_USD_RATE;
  return Math.round(usdAmount * 100) / 100; 
};

/**
 
 * @param {number} usdAmount 
 * @returns {number} 
 */
export const convertUSDtoVND = (usdAmount) => {
  if (!usdAmount || usdAmount <= 0) return 0;

  const vndAmount = usdAmount / VND_TO_USD_RATE;
  return Math.round(vndAmount); 
};

/**
 *
 * @param {number} amount 
 * @returns {string} 
 */
export const formatVND = (amount) => {
  if (!amount) return '0 VND';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * 
 * @param {number} amount 
 * @returns {string} 
 */
export const formatUSD = (amount) => {
  if (!amount) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 
 * @returns {number} 
 */
export const getExchangeRate = () => {
  return VND_TO_USD_RATE;
};

/**
 
 * @param {number} newRate
 */
export const updateExchangeRate = (newRate) => { 
  onsole.log(`Exchange rate updated to: ${newRate}`);
};