-- Insert sample categories
INSERT INTO categories (id, name, description) VALUES
  ('cat-1', 'Electronics', 'Electronic devices and accessories'),
  ('cat-2', 'Clothing', 'Fashion and apparel'),
  ('cat-3', 'Wearables', 'Smart watches and fitness trackers'),
  ('cat-4', 'Photography', 'Cameras and photography equipment'),
  ('cat-5', 'Gaming', 'Gaming accessories and equipment'),
  ('cat-6', 'Home & Garden', 'Home improvement and garden supplies');

-- Insert sample users (customers)
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, address) VALUES
  ('user-1', 'john.doe@example.com', '$2b$10$hash1', 'customer', 'John', 'Doe', '+1-555-0101', '123 Main St, New York, NY 10001'),
  ('user-2', 'jane.smith@example.com', '$2b$10$hash2', 'customer', 'Jane', 'Smith', '+1-555-0102', '456 Oak Ave, Los Angeles, CA 90210'),
  ('user-3', 'mike.johnson@example.com', '$2b$10$hash3', 'customer', 'Mike', 'Johnson', '+1-555-0103', '789 Pine St, Chicago, IL 60601');

-- Insert sample seller users
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, address) VALUES
  ('seller-user-1', 'contact@techgear.com', '$2b$10$hash4', 'seller', 'Tech', 'Admin', '+1-555-1001', '100 Tech Blvd, San Francisco, CA 94105'),
  ('seller-user-2', 'info@fittech.com', '$2b$10$hash5', 'seller', 'Fit', 'Admin', '+1-555-1002', '200 Fitness Ave, Austin, TX 78701'),
  ('seller-user-3', 'hello@ecowear.com', '$2b$10$hash6', 'seller', 'Eco', 'Admin', '+1-555-1003', '300 Green St, Portland, OR 97201');

-- Insert sellers
INSERT INTO sellers (id, user_id, business_name, business_type, description, verified, rating, total_sales) VALUES
  ('seller-1', 'seller-user-1', 'TechGear Pro', 'LLC', 'Premium electronics and tech accessories', TRUE, 4.8, 2890),
  ('seller-2', 'seller-user-2', 'FitTech Solutions', 'Corporation', 'Fitness and health technology products', TRUE, 4.7, 1456),
  ('seller-3', 'seller-user-3', 'EcoWear', 'LLC', 'Sustainable and organic clothing', TRUE, 4.6, 3421);

-- Insert sample products
INSERT INTO products (id, seller_id, category_id, name, description, price, original_price, stock, sold, rating, review_count, images, tags, specifications, featured) VALUES
  (
    'prod-1', 
    'seller-1', 
    'cat-1', 
    'Wireless Bluetooth Headphones',
    'Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    79.99,
    99.99,
    45,
    2890,
    4.5,
    1234,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['wireless', 'bluetooth', 'noise-cancelling', 'premium'],
    '{"Battery Life": "30 hours", "Connectivity": "Bluetooth 5.0", "Weight": "250g", "Warranty": "2 years"}',
    TRUE
  ),
  (
    'prod-2',
    'seller-2',
    'cat-3',
    'Smart Fitness Watch',
    'Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration. Track your health and stay connected.',
    199.99,
    249.99,
    12,
    1456,
    4.7,
    856,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['fitness', 'smartwatch', 'health', 'gps'],
    '{"Display": "1.4 AMOLED", "Battery": "7 days", "Water Resistance": "5ATM", "Sensors": "Heart Rate, GPS, Accelerometer"}',
    TRUE
  ),
  (
    'prod-3',
    'seller-3',
    'cat-2',
    'Organic Cotton T-Shirt',
    'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.',
    24.99,
    34.99,
    89,
    3421,
    4.3,
    567,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['organic', 'cotton', 'sustainable', 'comfortable'],
    '{"Material": "100% Organic Cotton", "Fit": "Regular", "Care": "Machine Washable", "Origin": "Fair Trade Certified"}',
    FALSE
  ),
  (
    'prod-4',
    'seller-1',
    'cat-4',
    'Professional Camera Lens',
    'High-quality camera lens for professional photography. Compatible with major camera brands.',
    299.99,
    399.99,
    8,
    234,
    4.8,
    234,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['photography', 'lens', 'professional', 'camera'],
    '{"Focal Length": "50mm", "Aperture": "f/1.4", "Mount": "Universal", "Weight": "600g"}',
    TRUE
  ),
  (
    'prod-5',
    'seller-1',
    'cat-5',
    'Gaming Mechanical Keyboard',
    'RGB backlit mechanical keyboard designed for gaming enthusiasts. Tactile switches and customizable lighting.',
    149.99,
    179.99,
    25,
    892,
    4.6,
    892,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['gaming', 'mechanical', 'rgb', 'keyboard'],
    '{"Switch Type": "Mechanical Blue", "Backlight": "RGB", "Layout": "Full Size", "Connectivity": "USB-C"}',
    FALSE
  ),
  (
    'prod-6',
    'seller-2',
    'cat-1',
    'Wireless Charging Pad',
    'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
    39.99,
    49.99,
    67,
    445,
    4.2,
    445,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['wireless', 'charging', 'qi', 'fast'],
    '{"Power Output": "15W", "Compatibility": "Qi-enabled devices", "Design": "Slim", "LED": "Status indicator"}',
    FALSE
  );

-- Insert sample orders
INSERT INTO orders (id, customer_id, order_number, status, total_amount, shipping_address, payment_method) VALUES
  (
    'order-1',
    'user-1',
    'ORD-001',
    'delivered',
    79.99,
    '{"street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA"}',
    'Credit Card'
  ),
  (
    'order-2',
    'user-1',
    'ORD-002',
    'shipped',
    199.99,
    '{"street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA"}',
    'PayPal'
  ),
  (
    'order-3',
    'user-2',
    'ORD-003',
    'processing',
    24.99,
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zipCode": "90210", "country": "USA"}',
    'Credit Card'
  );

-- Insert order items
INSERT INTO order_items (order_id, product_id, seller_id, quantity, price) VALUES
  ('order-1', 'prod-1', 'seller-1', 1, 79.99),
  ('order-2', 'prod-2', 'seller-2', 1, 199.99),
  ('order-3', 'prod-3', 'seller-3', 1, 24.99);

-- Insert sample cart items
INSERT INTO cart (customer_id, product_id, quantity) VALUES
  ('user-1', 'prod-4', 1),
  ('user-1', 'prod-5', 2),
  ('user-2', 'prod-1', 1);

-- Insert sample wishlist items
INSERT INTO wishlist (customer_id, product_id) VALUES
  ('user-1', 'prod-4'),
  ('user-1', 'prod-5'),
  ('user-1', 'prod-6'),
  ('user-2', 'prod-1'),
  ('user-2', 'prod-2');

-- Insert sample reviews
INSERT INTO reviews (product_id, customer_id, order_id, rating, comment, helpful_count) VALUES
  ('prod-1', 'user-1', 'order-1', 5, 'Excellent headphones! Great sound quality and battery life is amazing.', 12),
  ('prod-1', 'user-2', NULL, 4, 'Good headphones, comfortable to wear for long periods. Noise cancellation works well.', 8),
  ('prod-2', 'user-1', 'order-2', 5, 'Perfect fitness watch! Tracks everything I need and the battery lasts for days.', 15),
  ('prod-3', 'user-2', 'order-3', 4, 'Nice quality t-shirt, very comfortable and the organic cotton feels great.', 6);
