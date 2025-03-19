// sortOrder.js
const pick = require('./pick'); // Assuming pick function is in the same directory

/**
 * Build dynamic sort order for Sequelize queries.
 * @param {Object} sortParams - Parsed sorting parameters.
 * @param {Array} sortableFields - Fields allowed for sorting.
 * @returns {Array} Sequelize-compatible sort order array.
 */
function buildSortOrder(sortParams, sortableFields) {
  // Pick only the valid sort params based on allowed fields
  const pickedSortParams = pick(sortParams, sortableFields);

  // Convert the sortParams object into an array that Sequelize expects
  const order = Object.entries(pickedSortParams).map(([key, value]) => [key, value]);

  return order;
}

module.exports = buildSortOrder;
