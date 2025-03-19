const axios = require('axios');
const { API_URL } = require('../config/config');

class WebApi {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Set auth token for subsequent requests
  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Vehicle APIs
  
  // Get paginated list of vehicles
  async getVehicles(params = {}) {
    try {
      const response = await this.api.get('/vehicles', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get vehicle list with advanced filtering
  async getVehicleList(params = {}) {
    try {
      const response = await this.api.get('/vehicles/list', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single vehicle details
  async getVehicle(id) {
    try {
      const response = await this.api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Calculate rental price
  async calculateRentalPrice(id, days) {
    try {
      const response = await this.api.get(`/vehicles/${id}/rental-price`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new vehicle
  async createVehicle(data, images = []) {
    try {
      const formData = new FormData();
      
      // Append vehicle data
      formData.append('data', JSON.stringify(data));
      
      // Append images
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      const response = await this.api.post('/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update vehicle
  async updateVehicle(id, data, images = []) {
    try {
      const formData = new FormData();
      
      // Append vehicle data
      formData.append('data', JSON.stringify(data));
      
      // Append images
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      const response = await this.api.put(`/vehicles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete vehicle
  async deleteVehicle(id) {
    try {
      const response = await this.api.delete(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Filter vehicles by type
  async filterVehiclesByType(typeId, params = {}) {
    try {
      const response = await this.api.get('/vehicles/list', {
        params: {
          ...params,
          filter: {
            ...params.filter,
            vehicle_type_id: typeId
          }
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Filter vehicles by category
  async filterVehiclesByCategory(categoryId, params = {}) {
    try {
      const response = await this.api.get('/vehicles/list', {
        params: {
          ...params,
          filter: {
            ...params.filter,
            category_id: categoryId
          }
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Filter vehicles by brand
  async filterVehiclesByBrand(brandId, params = {}) {
    try {
      const response = await this.api.get('/vehicles/list', {
        params: {
          ...params,
          filter: {
            ...params.filter,
            brand_id: brandId
          }
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Filter vehicles by vendor
  async filterVehiclesByVendor(vendorId, params = {}) {
    try {
      const response = await this.api.get('/vehicles/list', {
        params: {
          ...params,
          filter: {
            ...params.filter,
            vendor_id: vendorId
          }
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search vehicles
  async searchVehicles(searchTerm, params = {}) {
    try {
      const response = await this.api.get('/vehicles/list', {
        params: {
          ...params,
          search: searchTerm
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Filter vehicles by price range
  async filterVehiclesByPrice(minPrice, maxPrice, params = {}) {
    try {
      const response = await this.api.get('/vehicles/list', {
        params: {
          ...params,
          filter: {
            ...params.filter,
            price_range: {
              min: minPrice,
              max: maxPrice
            }
          }
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error
      const { data, status } = error.response;
      return {
        success: false,
        status,
        message: data.message || 'An error occurred',
        errors: data.errors
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        status: 503,
        message: 'Service unavailable'
      };
    } else {
      // Error setting up request
      return {
        success: false,
        status: 500,
        message: error.message
      };
    }
  }
}

module.exports = new WebApi();
