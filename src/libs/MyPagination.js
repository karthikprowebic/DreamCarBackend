const { Op } = require('sequelize');
const buildSortOrder = require('./sortOrder');

class MyPagination {
  constructor(model, page = 1, limit = 10, searchParams = '', sortBy = '', fieldName = [], options = {}) {
    this.model = model;
    this.page = parseInt(page, 10) || 1;
    this.limit = parseInt(limit, 10) || 10;
    this.offset = (this.page - 1) * this.limit;
    this.searchParams = this.parseParams(searchParams); // Parse search parameters
    this.sortParams = this.parseSortParams(sortBy);     // Parse sorting parameters
    this.options = options;           // Any additional Sequelize query options (e.g., where, include)
    this.fieldName = fieldName;
  }

  /**
   * Parse searchParams string into an object with custom operators.
   * Example: 'name=LIKE:John Doe,price=>:100,date=BETWEEN:2023-01-01,2023-12-31'
   */
parseParams(params) {
  if (!params) return {};

  return params.split(',').reduce((acc, param) => {
    const [key, condition] = param.split('=');
    const [operator, value] = condition.split(':');
    
    let parsedValue = value;

    // Handle `BETWEEN` operator with two values separated by `|`
    if (operator === 'BETWEEN') {
      parsedValue = value.split('|').map(v => v.trim());
    } else if (['>', '<', '>=', '<='].includes(operator)) {
      parsedValue = parseFloat(value);
    }

    acc[key.trim()] = { operator: operator.trim(), value: parsedValue };

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
   * Builds Sequelize where filters based on custom operators.
   * Supports: `=`, `LIKE`, `>`, `<`, `>=`, `<=`, `BETWEEN`
   */
  buildSearchFilters() {
    const filters = {};

    for (const [field, { operator, value }] of Object.entries(this.searchParams)) {
        
      switch (operator) {
        case '=':
          filters[field] = { [Op.eq]: value };
          break;
        case 'LIKE':
          filters[field] = { [Op.like]: `%${value}%` };
          break;
        case '>':
          filters[field] = { [Op.gt]: value };
          break;
        case '<':
          filters[field] = { [Op.lt]: value };
          break;
        case '>=':
          filters[field] = { [Op.gte]: value };
          break;
        case '<=':
          filters[field] = { [Op.lte]: value };
          break;
        case 'BETWEEN':
          filters[field] = { [Op.between]: value };
          break;
        default:
          filters[field] = { [Op.eq]: value };
      }
    }

    return filters;
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

      // Build search filters dynamically with custom operators
      const searchFilters = this.buildSearchFilters();

      // Build sort order dynamically using external utility
      const sortOrder = buildSortOrder(this.sortParams, sortableFields);

      // Merge search filters and sort order with existing options
      const finalOptions = {
        ...this.options,
        where: {
          ...this.options.where,  // Retain existing conditions (if any)
          ...searchFilters,       // Apply dynamic search filters
        },
        // order: sortOrder.length > 0 ? sortOrder : [['createdAt', 'DESC']], // Default sort by created_at if no sort provided
        order: sortOrder.length > 0 ? sortOrder : [['id', 'DESC']], // Default sort by created_at if no sort provided
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

module.exports = MyPagination;
