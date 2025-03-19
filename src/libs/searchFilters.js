// searchFilters.js
const { Op } = require('sequelize');
const pick = require('./pick'); // Assuming pick function is in the same directory

/**
 * Build dynamic search filters for Sequelize queries.
 * @param {Object} searchParams - Parsed search parameters.
 * @param {Array} searchableFields - Fields allowed for search.
 * @returns {Object} Sequelize-compatible filter object.
 */
function buildSearchFilters(searchParams, searchableFields) {
  const filters = {};

  // Pick only the relevant search params based on allowed fields
  const pickedSearchParams = pick(searchParams, searchableFields);

  // Loop through each search param and build the Sequelize query filter
  for (const [key, value] of Object.entries(pickedSearchParams)) {
    filters[key] = { [Op.like]: `%${value}%` }; // Add LIKE search for flexibility
  }

  return filters;
}

module.exports = buildSearchFilters;
