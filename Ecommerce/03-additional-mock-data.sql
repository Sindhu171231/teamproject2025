-- Insert additional users (customers)
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, address) VALUES
  ('user-4', 'sarah.wilson@example.com', '$2b$10$hash4', 'customer', 'Sarah', 'Wilson', '+1-555-0104', '456 Oak Ave, Los Angeles, CA 90210'),
  ('user-5', 'david.brown@example.com', '$2b$10$hash5', 'customer', 'David', 'Brown', '+1-555-0105', '789 Pine St, Chicago, IL 60601'),
  ('user-6', 'emma.davis@example.com', '$2b$10$hash6', 'customer', 'Emma', 'Davis', '+1-555-0106', '321 Elm St, Houston, TX 77001'),
  ('user-7', 'alex.johnson@example.com', '$2b$10$hash7', 'customer', 'Alex', 'Johnson', '+1-555-0107', '654 Maple Ave, Phoenix, AZ 85001'),
  ('user-8', 'lisa.garcia@example.com', '$2b$10$hash8', 'customer', 'Lisa', 'Garcia', '+1-555-0108', '987 Cedar St, Philadelphia, PA 19101');

-- Insert additional seller users
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, address) VALUES
  ('seller-user-4', 'contact@audiotech.com', '$2b$10$hash9', 'seller', 'Audio', 'Admin', '+1-555-1004', '400 Sound Blvd, Nashville, TN 37201'),
  ('seller-user-5', 'info@securetech.com', '$2b$10$hash10', 'seller', 'Secure', 'Admin', '+1-555-1005', '500 Security Ave, Denver, CO 80201'),
  ('seller-user-6', 'hello@hometech.com', '$2b$10$hash11', 'seller', 'Home', 'Admin', '+1-555-1006', '600 Smart St, Seattle, WA 98101');

-- Insert additional sellers
INSERT INTO sellers (id, user_id, business_name, business_type, description, verified, rating, total_sales) VALUES
  ('seller-4', 'seller-user-4', 'AudioTech Pro', 'LLC', 'Premium audio equipment and accessories', TRUE, 4.5, 1234),
  ('seller-5', 'seller-user-5', 'SecureTech', 'Corporation', 'Home security and surveillance systems', TRUE, 4.7, 892),
  ('seller-6', 'seller-user-6', 'HomeTech Solutions', 'LLC', 'Smart home devices and automation', TRUE, 4.4, 567);

-- Insert additional products
INSERT INTO products (id, seller_id, category_id, name, description, price, original_price, stock, sold, rating, review_count, images, tags, specifications, featured) VALUES
  (
    'prod-7',
    'seller-4',
    'cat-1',
    'Bluetooth Wireless Earbuds',
    'True wireless earbuds with active noise cancellation and premium sound quality. Perfect for music and calls.',
    89.99,
    119.99,
    15,
    567,
    4.4,
    567,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['bluetooth', 'wireless', 'earbuds', 'noise-cancelling'],
    '{"Battery Life": "8 hours + 24h case", "Connectivity": "Bluetooth 5.2", "Water Resistance": "IPX7", "Charging": "USB-C + Wireless"}',
    TRUE
  ),
  (
    'prod-8',
    'seller-5',
    'cat-1',
    'Smart Home Security Camera',
    '4K wireless security camera with night vision, motion detection, and smartphone alerts. Easy setup and monitoring.',
    129.99,
    159.99,
    12,
    324,
    4.5,
    324,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['security', 'camera', 'smart-home', '4k'],
    '{"Resolution": "4K Ultra HD", "Night Vision": "Yes", "Storage": "Cloud + Local", "Power": "Battery + Solar"}',
    FALSE
  ),
  (
    'prod-9',
    'seller-1',
    'cat-4',
    'Camera Lens Cap',
    'Universal camera lens cap to protect your valuable lenses. Compatible with most camera brands.',
    29.99,
    39.99,
    50,
    156,
    4.1,
    156,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['camera', 'lens', 'protection', 'accessory'],
    '{"Material": "High-grade plastic", "Compatibility": "Universal", "Size": "Multiple sizes", "Color": "Black"}',
    FALSE
  ),
  (
    'prod-10',
    'seller-6',
    'cat-6',
    'Smart LED Light Bulbs (4-Pack)',
    'WiFi-enabled smart LED bulbs with 16 million colors, dimming, and voice control compatibility.',
    49.99,
    69.99,
    30,
    445,
    4.3,
    445,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['smart-home', 'led', 'wifi', 'voice-control'],
    '{"Wattage": "9W (60W equivalent)", "Colors": "16 million", "Compatibility": "Alexa, Google", "Lifespan": "25,000 hours"}',
    TRUE
  ),
  (
    'prod-11',
    'seller-2',
    'cat-3',
    'Fitness Tracker Band',
    'Affordable fitness tracker with heart rate monitoring, step counting, and sleep tracking. 7-day battery life.',
    39.99,
    59.99,
    25,
    789,
    4.2,
    789,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['fitness', 'tracker', 'health', 'affordable'],
    '{"Display": "1.1 inch color", "Battery": "7 days", "Water Resistance": "5ATM", "Sensors": "Heart Rate, Accelerometer"}',
    FALSE
  ),
  (
    'prod-12',
    'seller-3',
    'cat-2',
    'Eco-Friendly Hoodie',
    'Comfortable hoodie made from recycled materials. Soft, warm, and environmentally conscious.',
    59.99,
    79.99,
    18,
    234,
    4.6,
    234,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['eco-friendly', 'hoodie', 'recycled', 'sustainable'],
    '{"Material": "70% Recycled Cotton, 30% Recycled Polyester", "Fit": "Unisex", "Care": "Machine Washable", "Certification": "GOTS Certified"}',
    FALSE
  );

-- Insert additional orders
INSERT INTO orders (id, customer_id, order_number, status, total_amount, shipping_address, payment_method, created_at, updated_at) VALUES
  (
    'order-4',
    'user-4',
    'ORD-004',
    'cancelled',
    149.99,
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zipCode": "90210", "country": "USA"}',
    'Credit Card',
    '2024-01-08 11:30:00',
    '2024-01-09 09:15:00'
  ),
  (
    'order-5',
    'user-1',
    'ORD-005',
    'pending',
    329.98,
    '{"street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA"}',
    'Credit Card',
    '2024-01-20 16:45:00',
    '2024-01-20 16:45:00'
  ),
  (
    'order-6',
    'user-5',
    'ORD-006',
    'delivered',
    89.99,
    '{"street": "789 Pine St", "city": "Chicago", "state": "IL", "zipCode": "60601", "country": "USA"}',
    'PayPal',
    '2024-01-05 14:20:00',
    '2024-01-08 10:30:00'
  ),
  (
    'order-7',
    'user-6',
    'ORD-007',
    'shipped',
    179.98,
    '{"street": "321 Elm St", "city": "Houston", "state": "TX", "zipCode": "77001", "country": "USA"}',
    'Credit Card',
    '2024-01-18 09:45:00',
    '2024-01-19 15:20:00'
  );

-- Insert additional order items
INSERT INTO order_items (order_id, product_id, seller_id, quantity, price) VALUES
  ('order-4', 'prod-5', 'seller-1', 1, 149.99),
  ('order-5', 'prod-4', 'seller-1', 1, 299.99),
  ('order-5', 'prod-9', 'seller-1', 1, 29.99),
  ('order-6', 'prod-7', 'seller-4', 1, 89.99),
  ('order-7', 'prod-8', 'seller-5', 1, 129.99),
  ('order-7', 'prod-10', 'seller-6', 1, 49.99);

-- Insert additional cart items
INSERT INTO cart (customer_id, product_id, quantity) VALUES
  ('user-4', 'prod-7', 1),
  ('user-4', 'prod-8', 1),
  ('user-5', 'prod-10', 2),
  ('user-6', 'prod-11', 1),
  ('user-7', 'prod-12', 1),
  ('user-8', 'prod-1', 1);

-- Insert additional wishlist items
INSERT INTO wishlist (customer_id, product_id) VALUES
  ('user-1', 'prod-7'),
  ('user-1', 'prod-8'),
  ('user-1', 'prod-9'),
  ('user-4', 'prod-1'),
  ('user-4', 'prod-2'),
  ('user-4', 'prod-10'),
  ('user-5', 'prod-3'),
  ('user-5', 'prod-11'),
  ('user-6', 'prod-4'),
  ('user-6', 'prod-12'),
  ('user-7', 'prod-5'),
  ('user-7', 'prod-6'),
  ('user-8', 'prod-7'),
  ('user-8', 'prod-8');

-- Insert additional reviews
INSERT INTO reviews (product_id, customer_id, order_id, rating, comment, helpful_count, created_at) VALUES
  ('prod-7', 'user-5', 'order-6', 5, 'Amazing sound quality! The noise cancellation works perfectly and battery life is excellent.', 18, '2024-01-10 12:00:00'),
  ('prod-7', 'user-4', NULL, 4, 'Good earbuds for the price. Comfortable fit and decent sound quality.', 12, '2024-01-12 15:30:00'),
  ('prod-8', 'user-6', 'order-7', 5, 'Great security camera! Easy to set up and the 4K quality is crystal clear.', 22, '2024-01-22 10:15:00'),
  ('prod-8', 'user-7', NULL, 4, 'Works well but the app could be more user-friendly. Good value overall.', 8, '2024-01-19 14:45:00'),
  ('prod-10', 'user-6', 'order-7', 4, 'Smart bulbs work great with Alexa. Colors are vibrant and setup was easy.', 15, '2024-01-21 16:20:00'),
  ('prod-11', 'user-8', NULL, 4, 'Good basic fitness tracker. Battery life is as advertised and tracks steps accurately.', 9, '2024-01-16 11:30:00'),
  ('prod-12', 'user-7', NULL, 5, 'Love this hoodie! Super comfortable and I feel good knowing it\'s made from recycled materials.', 14, '2024-01-14 13:45:00');

-- Update product ratings based on reviews (this would normally be done with triggers)
UPDATE products SET 
  rating = 4.4,
  review_count = 567
WHERE id = 'prod-7';

UPDATE products SET 
  rating = 4.5,
  review_count = 324
WHERE id = 'prod-8';

UPDATE products SET 
  rating = 4.3,
  review_count = 445
WHERE id = 'prod-10';

UPDATE products SET 
  rating = 4.2,
  review_count = 789
WHERE id = 'prod-11';

UPDATE products SET 
  rating = 4.6,
  review_count = 234
WHERE id = 'prod-12';

-- Insert some sample notifications/activity data
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO notifications (user_id, type, title, message) VALUES
  ('user-1', 'order_shipped', 'Order Shipped', 'Your order ORD-002 has been shipped and is on its way!'),
  ('user-1', 'order_delivered', 'Order Delivered', 'Your order ORD-001 has been delivered successfully.'),
  ('user-1', 'price_drop', 'Price Drop Alert', 'The Professional Camera Lens in your wishlist is now 25% off!'),
  ('user-4', 'order_cancelled', 'Order Cancelled', 'Your order ORD-004 has been cancelled and refund is being processed.'),
  ('user-5', 'order_delivered', 'Order Delivered', 'Your order ORD-006 has been delivered. How was your experience?'),
  ('user-6', 'order_shipped', 'Order Shipped', 'Your order ORD-007 is now on its way to you!');

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
