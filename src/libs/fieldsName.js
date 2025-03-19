module.exports.productFields = ['id', 'product_name', 'image', 'images', 'category_id', 'description', 'old_price', 'purchase_price', 'sale_price', 'product_unit', 'enable_stock', 'stock_alert', 'quantity', 'supplier', 'createdAt', 'updatedAt'];
module.exports.categoryFields = ['id', 'name', 'user_name', 'description', 'icon', 'image', 'parent_id', 'createdAt', 'updatedAt'];
module.exports.orderFields = ['id', 'customer_id', 'shipping_address_id', 'order_date', 'order_status', 'order_total', 'shipping_method', 'shipping_cost', 'payment_method', 'payment_status', 'transaction_id', 'discount', 'tax', 'order_notes', 'tracking_number', 'gift_option', 'createdAt', 'updatedAt'];
module.exports.userFields = [
  'id', 
  'full_name', 
  'email', 
  'password', 
  'avatar', 
  'mobile', 
  'first_name', 
  'last_name', 
  'gender', 
  'mobile_otp', 
  'role', 
  'active', 
  'login_attempts', 
  'login_attempts_date', 
  'expiry', 
  'createdAt', 
  'updatedAt'
];

module.exports.addressFields = ['id', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'createdAt', 'updatedAt'];
module.exports.customFields = ['id', 'name', 'createdAt', 'updatedAt'];
module.exports.routeFields = ['id', 'source_city','destination_city','distance', 'createdAt', 'updatedAt'];
module.exports.BoardingPointsFields = ['route_id', 'location_name', 'arrival_time', 'updatedAt', 'sequence_number', 'createdAt', 'id'];
module.exports.SchedulesFields = ['id', 'route_id', 'departure_time', 'arrival_time', 'bus_type', 'base_fare', 'departure_date', 'arrival_date', 'status', 'createdAt'];
module.exports.DroppingFields = ['id', 'route_id', 'location_name', 'arrival_time', 'sequence_number', 'updatedAt', 'createdAt'];
module.exports.LayoutFields = ['id', 'layout_name', 'total_seats', 'total_sleeper_seats', 'total_seater_seats', 'rows_lower', 'columns_lower', 'rows_upper', 'columns_upper', 'createdAt', 'updatedAt'];
module.exports.BookingFields = [
  'id', 
  'user_id', 
  'vendor_id', 
  'schedule_id', 
  'vehicle_id', 
  'first_name', 
  'last_name', 
  'email', 
  'gender', 
  'route_id', 
  'mobile_number', 
  'payment_type_id', 
  'boarding_point_id', 
  'dropping_point_id', 
  'booking_date', 
  'total_amount', 
  'discount_amount', 
  'final_amount', 
  'payment_method', 
  'set_number', 
  'status', 
  'cancellation_reason', 
  'cancellation_charge', 
  'refund_amount', 
  'createdAt', 'updatedAt'
];

module.exports.VendorFields = [
  'id', 
  'company_name', 
  'company_logo', 
  'contact_person', 
  'email', 
  'phone', 
  'alternate_phone', 
  'address', 
  'city', 
  'state', 
  'pincode', 
  'gst_number', 
  'pan_number', 
  'bank_account_number', 
  'bank_name'
];

module.exports.BusFields = [
  'id', 
  'vehicle_name', 
  'vehicle_number', 
  'vehicle_image', 
  'vehicle_status', 
  'vehicle_rating', 
  'total_seats', 
  'start_date', 
  'has_ac', 
  'driver_name', 
  'driver_mobile', 
  'gear_system', 
  'amenities', 
  'vehicle_type', 
  'vehicle_brand', 
  'available_city', 
  'sleeper_price', 
  'seater_price', 
  'fuel_type', 
  'user_id', 
  'vendor_id', 
  'routes_id', 
  'schedules_id', 
  'layouts_id'
];
