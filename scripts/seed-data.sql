-- Insert sample sellers
INSERT INTO public.sellers (id, user_id, name, email, shop_name, shop_description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', NULL, 'TechStore Inc', 'contact@techstore.com', 'TechStore', 'Your one-stop shop for electronics'),
  ('550e8400-e29b-41d4-a716-446655440002', NULL, 'Fashion Hub', 'info@fashionhub.com', 'Fashion Hub', 'Trendy clothing and accessories'),
  ('550e8400-e29b-41d4-a716-446655440003', NULL, 'Home Essentials', 'hello@homeessentials.com', 'Home Essentials', 'Everything for your home');

-- Insert sample products
INSERT INTO public.products (id, name, description, price, image, stock_count, type, seller_id) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Ergonomic Office Chair', 'Comfortable and supportive chair designed for long working hours.', 249.99, '/placeholder.svg?height=400&width=400&text=Office+Chair', 15, 'furniture', '550e8400-e29b-41d4-a716-446655440003'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Portable Blender', 'Compact and powerful blender for smoothies and shakes on the go.', 39.99, '/placeholder.svg?height=400&width=400&text=Blender', 25, 'electronics', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Wireless Bluetooth Headphones', 'High-quality sound with noise cancellation and comfortable earcups.', 79.99, '/placeholder.svg?height=400&width=400&text=Headphones', 30, 'electronics', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Noise-Cancelling Earbuds', 'Compact earbuds with excellent sound quality and active noise cancellation.', 99.99, '/placeholder.svg?height=400&width=400&text=Earbuds', 20, 'electronics', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Summer Dress', 'Lightweight and breathable dress perfect for summer days.', 45.99, '/placeholder.svg?height=400&width=400&text=Summer+Dress', 12, 'clothing', '550e8400-e29b-41d4-a716-446655440002'),
  ('660e8400-e29b-41d4-a716-446655440006', 'Casual T-Shirt', 'Comfortable cotton t-shirt for everyday wear.', 19.99, '/placeholder.svg?height=400&width=400&text=T-Shirt', 50, 'clothing', '550e8400-e29b-41d4-a716-446655440002'),
  ('660e8400-e29b-41d4-a716-446655440007', 'Smart Watch', 'Feature-rich smartwatch with fitness tracking and notifications.', 199.99, '/placeholder.svg?height=400&width=400&text=Smart+Watch', 8, 'electronics', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440008', 'Coffee Maker', 'Programmable coffee maker with thermal carafe.', 89.99, '/placeholder.svg?height=400&width=400&text=Coffee+Maker', 18, 'home', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample reviews
INSERT INTO public.reviews (product_id, user_id, rating, comment) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', NULL, 5, 'Excellent chair! Very comfortable for long work sessions.'),
  ('660e8400-e29b-41d4-a716-446655440001', NULL, 4, 'Good quality, but assembly was a bit tricky.'),
  ('660e8400-e29b-41d4-a716-446655440002', NULL, 5, 'Perfect for my morning smoothies. Highly recommend!'),
  ('660e8400-e29b-41d4-a716-446655440003', NULL, 4, 'Great sound quality and battery life.'),
  ('660e8400-e29b-41d4-a716-446655440004', NULL, 5, 'Amazing noise cancellation. Worth every penny!');
