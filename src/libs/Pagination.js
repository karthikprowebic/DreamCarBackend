const buildSearchFilters = require('./searchFilters');
const buildSortOrder = require('./sortOrder');

class Pagination {
  /**
   * Initializes a Pagination instance.
   * @param {Model} model - Sequelize model to perform pagination on.
   * @param {number} [page=1] - Page number for pagination.
   * @param {number} [limit=10] - Maximum records per page.
   * @param {string} [searchParams=''] - Search parameters string. Example: 'name=John Doe,age=25'
   * @param {string} [sortBy=''] - Sorting parameters string. Example: 'name=DESC,age=ASC'
   * @param {string[]} [fieldName=[]] - Fields to include in the response.
   * @param {Object} [options={}] - Additional Sequelize query options (e.g., where, include).
   */
  constructor(model, page = 1, limit = 10, searchParams = '', sortBy = '',fieldName=[], options = {}) {
    this.model = model;
    this.page = parseInt(page, 10) || 1;
    this.limit = parseInt(limit, 10) || 10;
    this.offset = (this.page - 1) * this.limit;
    this.searchParams = this.parseParams(searchParams); // Parse search parameters
    this.sortParams = this.parseSortParams(sortBy);     // Parse sorting parameters
    this.options = options;           // Any additional Sequelize query options (e.g., where, include)
    this.fieldName=fieldName;
  }

  /**
   * Parse searchParams string into an object.
   * Example: 'product_name=All Life Stages Cat Food,quantity=100' => { product_name: 'All Life Stages Cat Food', quantity: 100 }
   */
  parseParams(params) {
    if (!params) return {};
    return params.split(',').reduce((acc, param) => {
      const [key, value] = param.split('=');
      acc[key.trim()] = value ? value.trim() : null;
      return acc;
    }, {});
  }

  /**
   * Parse sortBy string into an object.
   * Example: 'name=DESC,user_name=DESC' => { name: 'DESC', user_name: 'DESC' }
   */
  parseSortParams(sortBy) {
    if (!sortBy) return {};
    return sortBy.split(',').reduce((acc, param) => {
      const [key, value] = param.split('=');
      acc[key.trim()] = value ? value.trim().toUpperCase() : 'ASC'; // Default to ASC if not provided
      return acc;
    }, {});
  }

  /**
   * Paginates records from the associated model.
   * @returns {Promise<Object>} Paginated response object with success status, message, data, and pagination metadata.
   */
  async paginate() {
    try {
      // Define fields that can be searched or sorted
      const searchableFields = this.fieldName;
      const sortableFields = this.fieldName;

      // Build search filters dynamically using external utility
      const searchFilters = buildSearchFilters(this.searchParams, searchableFields);

      // Build sort order dynamically using external utility
      const sortOrder = buildSortOrder(this.sortParams, sortableFields);

      // Merge search filters and sort order with existing options
      const finalOptions = {
        ...this.options,
        where: {
          ...this.options.where,  // Retain existing conditions (if any)
          ...searchFilters,       // Apply dynamic search filters
        },
        order: sortOrder.length > 0 ? sortOrder : [['createdAt', 'DESC']], // Default sort by created_at if no sort provided
        limit: this.limit,
        offset: this.offset,
      };

      // Fetch total count of records for pagination metadata
      const totalItems = await this.model.count({ where: finalOptions.where });

      // Fetch records with limit, offset, and sorting
      const records = await this.model.findAll(finalOptions);

      // Calculate total pages
      const totalPages = Math.ceil(totalItems / this.limit);

      // Return the paginated response
      return {
        success: true,
        message: 'Records retrieved successfully',
        data: records,
        pagination: {
          current_page: this.page,
          total_pages: totalPages,
          total_items: totalItems,
          per_page: this.limit,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = Pagination;
