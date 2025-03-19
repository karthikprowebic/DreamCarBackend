require('dotenv').config();
const { Sequelize } = require('sequelize');
const { VehicleType, Category, Brand, Feature, Coupon } = require('../models/vehicle.model');

// Create Sequelize instance
// const sequelize = new Sequelize(process.env.DB_NAME || 'rent-car', process.env.DB_USER || 'root', process.env.DB_PASSWORD ||'', {
//   const sequelize = new Sequelize(process.env.DB_NAME || 'rent-car', process.env.DB_USER || 'root', 123456 ||'', {
//   host: process.env.DB_HOST || 'localhost',
//   dialect: 'mysql',
//   logging: false
// });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'rent-car',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

console.log('Connecting with:');
console.log('DB:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD);
console.log('Host:', process.env.DB_HOST);


async function seedDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Force sync all tables (this will drop existing tables)
    await sequelize.sync({ force: true });
    console.log('Database synced. All tables recreated.');

    // 1. Create Vehicle Types
    console.log('Seeding Vehicle Types...');
    const vehicleTypes = await VehicleType.bulkCreate([
      { name: 'Sedan', description: 'A comfortable passenger car with separate trunk', icon: 'fa-car' },
      { name: 'SUV', description: 'Sport Utility Vehicle with high ground clearance', icon: 'fa-truck' },
      { name: 'Hatchback', description: 'Compact car with rear door that opens upwards', icon: 'fa-car-side' },
      { name: 'Convertible', description: 'Car with retractable roof', icon: 'fa-car-side' },
      { name: 'Pickup', description: 'Vehicle with an open cargo area', icon: 'fa-truck-pickup' },
      { name: 'Van', description: 'Large vehicle for transporting people or cargo', icon: 'fa-shuttle-van' },
      { name: 'Luxury', description: 'Premium vehicles with high-end features', icon: 'fa-car-side' },
      { name: 'Sports', description: 'High-performance vehicles', icon: 'fa-car-side' }
    ]);
    console.log('Vehicle Types seeded successfully.');

    // 2. Create Categories
    console.log('Seeding Categories...');
    await Category.bulkCreate([
      { name: 'Economy', description: 'Budget-friendly vehicles', vehicle_type_id: 1 },
      { name: 'Premium', description: 'High-end luxury vehicles', vehicle_type_id: 7 },
      { name: 'Family', description: 'Spacious family-friendly vehicles', vehicle_type_id: 2 },
      { name: 'Business', description: 'Professional transportation', vehicle_type_id: 1 },
      { name: 'Adventure', description: 'Vehicles for outdoor activities', vehicle_type_id: 5 },
      { name: 'Sports', description: 'Performance-oriented vehicles', vehicle_type_id: 8 }
    ]);
    console.log('Categories seeded successfully.');

    // 3. Create Brands
    console.log('Seeding Brands...');
    await Brand.bulkCreate([
      { name: 'Toyota', logo_url: '/brands/toyota.png' },
      { name: 'Honda', logo_url: '/brands/honda.png' },
      { name: 'BMW', logo_url: '/brands/bmw.png' },
      { name: 'Mercedes', logo_url: '/brands/mercedes.png' },
      { name: 'Audi', logo_url: '/brands/audi.png' },
      { name: 'Ford', logo_url: '/brands/ford.png' },
      { name: 'Tesla', logo_url: '/brands/tesla.png' },
      { name: 'Porsche', logo_url: '/brands/porsche.png' },
      { name: 'Lexus', logo_url: '/brands/lexus.png' },
      { name: 'Volvo', logo_url: '/brands/volvo.png' }
    ]);
    console.log('Brands seeded successfully.');

    // 4. Create Features
    console.log('Seeding Features...');
    await Feature.bulkCreate([
      { name: 'Air Conditioning', icon: 'fa-snowflake', vehicle_type_id: 1 },
      { name: 'GPS Navigation', icon: 'fa-map-marker', vehicle_type_id: 1 },
      { name: 'Bluetooth', icon: 'fa-bluetooth', vehicle_type_id: 1 },
      { name: 'Leather Seats', icon: 'fa-chair', vehicle_type_id: 7 },
      { name: 'Sunroof', icon: 'fa-sun', vehicle_type_id: 7 },
      { name: 'Backup Camera', icon: 'fa-camera', vehicle_type_id: 1 },
      { name: 'Third Row Seating', icon: 'fa-users', vehicle_type_id: 2 },
      { name: 'Roof Rack', icon: 'fa-luggage-cart', vehicle_type_id: 2 },
      { name: 'Premium Audio', icon: 'fa-music', vehicle_type_id: 7 },
      { name: 'Keyless Entry', icon: 'fa-key', vehicle_type_id: 1 },
      { name: 'Cruise Control', icon: 'fa-tachometer-alt', vehicle_type_id: 1 },
      { name: 'Lane Departure Warning', icon: 'fa-road', vehicle_type_id: 7 },
      { name: 'Blind Spot Monitor', icon: 'fa-eye', vehicle_type_id: 7 },
      { name: 'Apple CarPlay', icon: 'fa-apple', vehicle_type_id: 1 },
      { name: 'Android Auto', icon: 'fa-android', vehicle_type_id: 1 }
    ]);
    console.log('Features seeded successfully.');

    // 5. Create Coupons
    console.log('Seeding Coupons...');
    const currentDate = new Date();
    const threeMonthsLater = new Date(currentDate.getTime());
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    await Coupon.bulkCreate([
      {
        code: 'NEWUSER25',
        type: 'percentage',
        value: 25,
        start_date: currentDate,
        end_date: threeMonthsLater,
        min_rental_days: 2,
        usage_limit: 100,
        used_count: 0,
        min_amount: 100,
        max_discount_amount: 250,
        description: 'New user discount - 25% off your first rental',
        status: 'active'
      },
      {
        code: 'PREMIUM50',
        type: 'percentage',
        value: 50,
        start_date: currentDate,
        end_date: threeMonthsLater,
        min_rental_days: 3,
        usage_limit: 50,
        used_count: 0,
        min_amount: 300,
        max_discount_amount: 500,
        description: '50% off premium vehicle rentals',
        status: 'active',
        category_id: 2
      },
      {
        code: 'SUMMER100',
        type: 'fixed',
        value: 100,
        start_date: currentDate,
        end_date: threeMonthsLater,
        min_rental_days: 3,
        usage_limit: 200,
        used_count: 0,
        min_amount: 200,
        description: 'Summer special - $100 off',
        status: 'active'
      },
      {
        code: 'FAMILY30',
        type: 'percentage',
        value: 30,
        start_date: currentDate,
        end_date: threeMonthsLater,
        min_rental_days: 5,
        max_rental_days: 15,
        usage_limit: 100,
        used_count: 0,
        min_amount: 250,
        max_discount_amount: 400,
        description: 'Family vacation discount - 30% off',
        status: 'active',
        category_id: 3
      },
      {
        code: 'BMW20',
        type: 'percentage',
        value: 20,
        start_date: currentDate,
        end_date: threeMonthsLater,
        min_rental_days: 2,
        usage_limit: 75,
        used_count: 0,
        min_amount: 150,
        max_discount_amount: 300,
        description: '20% off BMW rentals',
        status: 'active',
        brand_id: 3
      },
      {
        code: 'SUV35',
        type: 'percentage',
        value: 35,
        start_date: currentDate,
        end_date: threeMonthsLater,
        min_rental_days: 3,
        usage_limit: 150,
        used_count: 0,
        min_amount: 200,
        max_discount_amount: 450,
        description: '35% off SUV rentals',
        status: 'active',
        vehicle_type_id: 2
      }
    ]);
    console.log('Coupons seeded successfully.');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('All seeding operations completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error in seed script:', error);
    process.exit(1);
  });
