/** Ensures any _id or ref (ObjectId) is always returned as string for API consistency */
function toIdString(value) {
  if (value == null) return value;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(toIdString);
  if (value && typeof value === 'object' && value._id != null) return toIdString(value._id);
  if (value && typeof value.toString === 'function' && value.constructor?.name === 'ObjectID') return value.toString();
  return value;
}

module.exports = { toIdString };
