/** @param {*} data */
export function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (data?.content) return data.content;
  if (data?.data) return normalizeList(data.data);
  if (data?.items) return data.items;
  if (data?.cars) return data.cars;
  if (data?.drivers) return data.drivers;
  if (data?.bookings) return data.bookings;
  if (data?.vendors) return data.vendors;
  return [];
}

/** @param {*} data */
export function normalizeEntity(data) {
  if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    return data.data;
  }
  return data;
}
