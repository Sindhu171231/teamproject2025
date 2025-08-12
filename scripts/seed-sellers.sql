-- Insert demo sellers into sellers table
INSERT INTO public.sellers (id, user_id, email, name, shop_name, shop_description, is_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', NULL, 'seller@demo.com', 'Jane Seller', 'TechStore Inc', 'Your one-stop shop for electronics and gadgets', true),
  ('550e8400-e29b-41d4-a716-446655440002', NULL, 'fashion@demo.com', 'Fashion Hub Owner', 'Fashion Hub', 'Trendy clothing and accessories', true),
  ('550e8400-e29b-41d4-a716-446655440003', NULL, 'home@demo.com', 'Home Essentials Owner', 'Home Essentials', 'Everything for your home', true);

-- Update products to reference the correct seller IDs
UPDATE public.products SET seller_id = '550e8400-e29b-41d4-a716-446655440001' WHERE seller_id = '2';
UPDATE public.products SET seller_id = '550e8400-e29b-41d4-a716-446655440002' WHERE seller_id = '3';
UPDATE public.products SET seller_id = '550e8400-e29b-41d4-a716-446655440003' WHERE seller_id = '1';
