import { CAR_TYPES, TRANSMISSIONS } from '@/shared/models/enums';

const DEFAULT_FILTERS = {
  pickup: '',
  ret: '',
  type: '',
  minSeats: '',
  transmission: '',
  maxPrice: '',
  withDriver: 'false',
  pickupLocation: '',
  dropLocation: '',
  promo: '',
  vehicleKind: 'CAR',
};

/**
 * @param {URLSearchParams} params
 */
export function parseCarFilters(params) {
  return {
    pickup: params.get('pickup') || '',
    ret: params.get('ret') || '',
    type: params.get('type') || '',
    minSeats: params.get('minSeats') || '',
    transmission: params.get('transmission') || '',
    maxPrice: params.get('maxPrice') || '',
    withDriver: params.get('withDriver') || 'false',
    pickupLocation: params.get('pickupLocation') || '',
    dropLocation: params.get('dropLocation') || '',
    promo: params.get('promo') || '',
    vehicleKind: params.get('vehicleKind') || 'CAR',
  };
}

/**
 * @param {Record<string, string>} filters
 * @returns {URLSearchParams}
 */
export function filtersToSearchParams(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== DEFAULT_FILTERS[key]) {
      params.set(key, value);
    }
  });
  return params;
}

/**
 * @param {Record<string, string>} filters
 * @returns {Record<string, string>}
 */
export function filtersToApiParams(filters) {
  const apiParams = {};
  if (filters.type) apiParams.type = filters.type;
  if (filters.minSeats) apiParams.minSeats = filters.minSeats;
  if (filters.transmission) apiParams.transmission = filters.transmission;
  if (filters.maxPrice) apiParams.maxPrice = filters.maxPrice;
  if (filters.withDriver) apiParams.withDriver = filters.withDriver;
  if (filters.vehicleKind) apiParams.vehicleKind = filters.vehicleKind;
  return apiParams;
}

export { DEFAULT_FILTERS, CAR_TYPES, TRANSMISSIONS };
