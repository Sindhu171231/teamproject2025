-- Insert additional products to enhance search functionality
INSERT INTO products (id, name, description, price, category, seller_id, image_url, stock, rating, reviews_count, created_at, updated_at) VALUES
-- Electronics
('prod_15', 'Gaming Mechanical Keyboard', 'RGB backlit mechanical keyboard with blue switches, perfect for gaming and typing', 89.99, 'Electronics', 'seller_1', '/placeholder.svg?height=200&width=200&text=Gaming+Keyboard', 25, 4.6, 89, NOW(), NOW()),
('prod_16', '4K Webcam', 'Ultra HD webcam with auto-focus and noise cancellation microphone', 129.99, 'Electronics', 'seller_1', '/placeholder.svg?height=200&width=200&text=4K+Webcam', 18, 4.4, 67, NOW(), NOW()),
('prod_17', 'Portable SSD 1TB', 'High-speed external SSD with USB-C connectivity', 149.99, 'Electronics', 'seller_1', '/placeholder.svg?height=200&width=200&text=Portable+SSD', 30, 4.7, 156, NOW(), NOW()),

-- Clothing & Fashion
('prod_18', 'Premium Cotton T-Shirt', 'Soft, breathable cotton t-shirt in multiple colors', 24.99, 'Clothing', 'seller_2', '/placeholder.svg?height=200&width=200&text=Cotton+T-Shirt', 50, 4.3, 234, NOW(), NOW()),
('prod_19', 'Denim Jacket', 'Classic blue denim jacket with vintage wash', 79.99, 'Clothing', 'seller_2', '/placeholder.svg?height=200&width=200&text=Denim+Jacket', 20, 4.5, 98, NOW(), NOW()),
('prod_20', 'Running Sneakers', 'Lightweight running shoes with cushioned sole', 119.99, 'Clothing', 'seller_2', '/placeholder.svg?height=200&width=200&text=Running+Sneakers', 35, 4.6, 187, NOW(), NOW()),

-- Home & Garden
('prod_21', 'Indoor Plant Set', 'Collection of 3 easy-care indoor plants with decorative pots', 49.99, 'Home & Garden', 'seller_3', '/placeholder.svg?height=200&width=200&text=Indoor+Plants', 15, 4.4, 76, NOW(), NOW()),
('prod_22', 'LED Desk Lamp', 'Adjustable LED desk lamp with touch controls and USB charging port', 39.99, 'Home & Garden', 'seller_3', '/placeholder.svg?height=200&width=200&text=LED+Desk+Lamp', 40, 4.5, 123, NOW(), NOW()),
('prod_23', 'Ceramic Dinnerware Set', '16-piece ceramic dinnerware set for 4 people', 89.99, 'Home & Garden', 'seller_3', '/placeholder.svg?height=200&width=200&text=Dinnerware+Set', 12, 4.7, 89, NOW(), NOW()),

-- Sports & Fitness
('prod_24', 'Yoga Mat Premium', 'Non-slip yoga mat with alignment lines and carrying strap', 34.99, 'Sports', 'seller_4', '/placeholder.svg?height=200&width=200&text=Yoga+Mat', 45, 4.6, 167, NOW(), NOW()),
('prod_25', 'Resistance Bands Set', 'Set of 5 resistance bands with different resistance levels', 29.99, 'Sports', 'seller_4', '/placeholder.svg?height=200&width=200&text=Resistance+Bands', 60, 4.4, 134, NOW(), NOW()),
('prod_26', 'Water Bottle Insulated', 'Stainless steel insulated water bottle keeps drinks cold for 24h', 24.99, 'Sports', 'seller_4', '/placeholder.svg?height=200&width=200&text=Water+Bottle', 80, 4.5, 298, NOW(), NOW()),

-- Beauty & Personal Care
('prod_27', 'Skincare Routine Set', 'Complete 4-step skincare routine with cleanser, toner, serum, and moisturizer', 79.99, 'Beauty', 'seller_5', '/placeholder.svg?height=200&width=200&text=Skincare+Set', 25, 4.6, 145, NOW(), NOW()),
('prod_28', 'Hair Styling Tool', 'Professional hair straightener and curler 2-in-1 with ceramic plates', 59.99, 'Beauty', 'seller_5', '/placeholder.svg?height=200&width=200&text=Hair+Styling+Tool', 30, 4.3, 87, NOW(), NOW()),
('prod_29', 'Makeup Brush Set', 'Professional makeup brush set with 12 brushes and carrying case', 39.99, 'Beauty', 'seller_5', '/placeholder.svg?height=200&width=200&text=Makeup+Brushes', 40, 4.7, 203, NOW(), NOW());

-- Add a new seller for Beauty products
INSERT INTO sellers (id, name, email, phone, address, created_at, updated_at) VALUES
('seller_5', 'BeautyPro', 'contact@beautypro.com', '+1-555-0105', '789 Beauty Ave, Cosmetics City, CC 12345', NOW(), NOW());

-- Update some existing products to have better variety
UPDATE products SET 
  description = 'Latest smartphone with 5G connectivity, triple camera system, and all-day battery life',
  stock = 45,
  rating = 4.8,
  reviews_count = 342
WHERE id = 'prod_1';

UPDATE products SET 
  description = 'High-performance laptop perfect for gaming, content creation, and professional work',
  stock = 12,
  rating = 4.7,
  reviews_count = 156
WHERE id = 'prod_2';
