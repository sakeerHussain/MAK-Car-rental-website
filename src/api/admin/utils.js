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
  if (data?.employees) return data.employees;
  if (data?.maintenance) return data.maintenance;
  if (data?.inspections) return data.inspections;
  if (data?.trips) return data.trips;
  if (data?.settlements) return data.settlements;
  if (data?.reviews) return data.reviews;
  if (data?.accounts) return data.accounts;
  if (data?.memberships) return data.memberships;
  return [];
}

/** @param {Blob} blob @param {string} filename */
export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** @param {*} data */
export function normalizeEntity(data) {
  if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    return data.data;
  }
  return data;
}
