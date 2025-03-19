-- Vehicle Types
INSERT INTO vehicle_types (name, description, icon, created_at, updated_at) VALUES
('Car', 'Standard passenger vehicles', 'car-icon.svg', NOW(), NOW()),
('SUV', 'Sport Utility Vehicles', 'suv-icon.svg', NOW(), NOW()),
('Van', 'Passenger and cargo vans', 'van-icon.svg', NOW(), NOW()),
('Luxury', 'Premium luxury vehicles', 'luxury-icon.svg', NOW(), NOW());

-- Categories
INSERT INTO categories (vehicle_type_id, name, description, status, created_at, updated_at) VALUES
(1, 'Sedan', 'Standard 4-door sedan', 'active', NOW(), NOW()),
(1, 'Compact', 'Small efficient cars', 'active', NOW(), NOW()),
(2, 'Compact SUV', 'Small sport utility vehicles', 'active', NOW(), NOW()),
(2, 'Full-size SUV', 'Large sport utility vehicles', 'active', NOW(), NOW()),
(3, 'Passenger Van', 'People carrier vans', 'active', NOW(), NOW()),
(4, 'Executive', 'Premium executive vehicles', 'active', NOW(), NOW());

-- Brands
INSERT INTO brands (name, logo_url, created_at, updated_at) VALUES
('Toyota', 'https://example.com/logos/toyota.png', NOW(), NOW()),
('Honda', 'https://example.com/logos/honda.png', NOW(), NOW()),
('BMW', 'https://example.com/logos/bmw.png', NOW(), NOW()),
('Mercedes-Benz', 'https://example.com/logos/mercedes.png', NOW(), NOW()),
('Ford', 'https://example.com/logos/ford.png', NOW(), NOW());

-- Vehicles
INSERT INTO vehicles (
    vehicle_type_id,
    category_id,
    brand_id,
    vendor_id,
    name,
    number_plate,
    model_year,
    color,
    engine_capacity,
    fuel_type,
    transmission_type,
    mileage,
    seating_capacity,
    status,
    hourly_rate,
    daily_rate,
    weekly_rate,
    monthly_rate,
    security_deposit,
    minimum_rental_period,
    current_location_address,
    pickup_location,
    city,
    state,
    main_image,
    features,
    created_at,
    updated_at
) VALUES
(1, 1, 1, 1, 'Toyota Camry', 'ABC123', 2023, 'Silver', '2500', 'Petrol', 'Automatic', 25.5, 5, 'Available', 10.00, 75.00, 450.00, 1800.00, 500.00, 1, '123 Main St, City', '123 Main St, City', 'New York', 'NY', '/uploads/vehicles/camry.jpg', '["Bluetooth","Backup Camera","Cruise Control"]', NOW(), NOW()),

(1, 1, 2, 1, 'Honda Civic', 'XYZ789', 2023, 'Blue', '1800', 'Petrol', 'Automatic', 30.2, 5, 'Available', 8.00, 65.00, 390.00, 1560.00, 400.00, 1, '456 Oak St, City', '456 Oak St, City', 'Los Angeles', 'CA', '/uploads/vehicles/civic.jpg', '["Apple CarPlay","Android Auto","Lane Departure Warning"]', NOW(), NOW()),

(1, 2, 5, 1, 'Ford Focus', 'DEF456', 2022, 'Red', '2000', 'Petrol', 'Manual', 28.7, 5, 'Available', 7.50, 60.00, 360.00, 1440.00, 400.00, 1, '789 Pine St, City', '789 Pine St, City', 'Chicago', 'IL', '/uploads/vehicles/focus.jpg', '["Turbo Engine","Sport Mode","Premium Audio"]', NOW(), NOW()),

(2, 3, 5, 1, 'Ford Escape', 'GHI789', 2023, 'White', '2500', 'Hybrid', 'Automatic', 24.3, 5, 'Available', 10.00, 85.00, 510.00, 2040.00, 600.00, 1, '321 Elm St, City', '321 Elm St, City', 'Houston', 'TX', '/uploads/vehicles/escape.jpg', '["Panoramic Roof","Navigation","Wireless Charging"]', NOW(), NOW()),

(3, 4, 4, 1, 'Mercedes-Benz GLS', 'JKL012', 2023, 'Black', '3000', 'Petrol', 'Automatic', 20.1, 7, 'Available', 18.75, 150.00, 900.00, 3600.00, 1000.00, 1, '654 Maple St, City', '654 Maple St, City', 'Miami', 'FL', '/uploads/vehicles/gls.jpg', '["Premium Leather","360 Camera","Air Suspension"]', NOW(), NOW()),

(4, 6, 3, 1, 'BMW 7 Series', 'MNO345', 2023, 'Gray', '3000', 'Petrol', 'Automatic', 22.4, 5, 'Available', 21.88, 175.00, 1050.00, 4200.00, 1200.00, 1, '987 Cedar St, City', '987 Cedar St, City', 'Boston', 'MA', '/uploads/vehicles/bmw7.jpg', '["Executive Package","Massage Seats","Night Vision"]', NOW(), NOW()),

(2, 5, 1, 1, 'Toyota Sienna', 'PQR678', 2023, 'Silver', '2500', 'Hybrid', 'Automatic', 26.8, 8, 'Available', 11.88, 95.00, 570.00, 2280.00, 700.00, 1, '147 Birch St, City', '147 Birch St, City', 'Seattle', 'WA', '/uploads/vehicles/sienna.jpg', '["Power Sliding Doors","Rear Entertainment","3-Zone Climate"]', NOW(), NOW()),

(1, 1, 2, 1, 'Honda Accord', 'STU901', 2023, 'Black', '2000', 'Hybrid', 'Automatic', 29.5, 5, 'Available', 10.00, 80.00, 480.00, 1920.00, 500.00, 1, '258 Walnut St, City', '258 Walnut St, City', 'Denver', 'CO', '/uploads/vehicles/accord.jpg', '["Head-Up Display","Ventilated Seats","Bose Audio"]', NOW(), NOW()),

(4, 6, 4, 1, 'Mercedes-Benz S-Class', 'VWX234', 2023, 'Diamond White', '3000', 'Petrol', 'Automatic', 21.2, 5, 'Available', 25.00, 200.00, 1200.00, 4800.00, 1500.00, 1, '369 Pine St, City', '369 Pine St, City', 'San Francisco', 'CA', '/uploads/vehicles/sclass.jpg', '["Executive Rear Seats","Burmester 4D Sound","Digital Light"]', NOW(), NOW()),

(2, 3, 5, 1, 'Ford Bronco Sport', 'YZA567', 2023, 'Cyber Orange', '2500', 'Petrol', 'Automatic', 23.6, 5, 'Available', 11.25, 90.00, 540.00, 2160.00, 600.00, 1, '480 Oak St, City', '480 Oak St, City', 'Portland', 'OR', '/uploads/vehicles/bronco.jpg', '["Off-Road Capability","Trail Control","GOAT Modes"]', NOW(), NOW());
