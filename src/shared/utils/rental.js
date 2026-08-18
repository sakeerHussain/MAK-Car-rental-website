/**
 * @param {Date} date
 * @returns {string}
 */
export function toDatetimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * @param {string} pickup
 * @param {string} ret
 * @returns {number}
 */
export function getRentalDays(pickup, ret) {
  if (!pickup || !ret) return 0;
  const ms = new Date(ret).getTime() - new Date(pickup).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/**
 * @param {import('@/shared/models/typedefs').Car} car
 * @param {number} days
 * @param {'DAY'|'MONTH'} rentalUnit
 */
export function estimateCarPrice(car, days, rentalUnit = 'DAY') {
  if (rentalUnit === 'MONTH') {
    const months = Math.max(1, Math.ceil(days / 30));
    return car.monthlyRate * months;
  }
  return car.dailyRate * days;
}

/**
 * @param {string} locationValue
 * @param {{ value: string, label: string }[]} locations
 */
export function getLocationLabel(locationValue, locations) {
  return locations.find((l) => l.value === locationValue)?.label || locationValue;
}

/**
 * @param {string | Date} dateStr
 */
export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-AE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateStr));
}
