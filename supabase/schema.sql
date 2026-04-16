-- FoodHub Machakos Database Schema

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  icon text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  unit text DEFAULT 'piece',
  image_url text,
  in_stock boolean DEFAULT true,
  stock_quantity int DEFAULT 100,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text,
  order_type text CHECK (order_type IN ('delivery', 'pickup')) DEFAULT 'pickup',
  status text CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')) DEFAULT 'pending',
  subtotal decimal(10,2) NOT NULL,
  delivery_fee decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  notes text,
  payment_method text DEFAULT 'cash',
  payment_status text CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_price decimal(10,2) NOT NULL,
  quantity int NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Admin users (simple)
CREATE TABLE IF NOT EXISTS admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);
CREATE POLICY "Products are public" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view order items" ON order_items FOR SELECT USING (true);

-- Service role can do everything (for admin)
CREATE POLICY "Service role full access categories" ON categories USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access products" ON products USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access orders" ON orders FOR UPDATE USING (true);

-- Seed Categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('Fast Food', 'fast-food', 'Burgers, fries, chicken, samosas and more hot food ready to eat', '🍔', 1),
  ('Butchery', 'butchery', 'Fresh beef, goat, pork, chicken and offals from local farms', '🥩', 2),
  ('Bakery', 'bakery', 'Fresh bread, mandazi, cakes, buns, and pastries baked daily', '🍞', 3),
  ('Groceries', 'groceries', 'Fresh sukuma wiki, tomatoes, onions, fruits and daily essentials', '🥦', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed Products - Fast Food
INSERT INTO products (category_id, name, description, price, unit, featured) VALUES
  ((SELECT id FROM categories WHERE slug='fast-food'), 'Chips (Fries)', 'Crispy golden chips', 50, 'serving', true),
  ((SELECT id FROM categories WHERE slug='fast-food'), 'Chips + Chicken', 'Chips with fried chicken piece', 150, 'serving', true),
  ((SELECT id FROM categories WHERE slug='fast-food'), 'Beef Burger', 'Juicy beef burger with vegetables', 120, 'piece', true),
  ((SELECT id FROM categories WHERE slug='fast-food'), 'Samosa (3pcs)', 'Crispy beef samosas', 60, 'pack', false),
  ((SELECT id FROM categories WHERE slug='fast-food'), 'Mandazi (5pcs)', 'Freshly fried mandazi', 50, 'pack', false),
  ((SELECT id FROM categories WHERE slug='fast-food'), 'Grilled Chicken', 'Full grilled chicken with kachumbari', 450, 'piece', true),
  ((SELECT id FROM categories WHERE slug='fast-food'), 'Sausage', 'Grilled pork sausage', 50, 'piece', false),
  ((SELECT id FROM categories WHERE slug='fast-food'), 'Pilau (Half)', 'Aromatic pilau with beef', 120, 'serving', false)
ON CONFLICT DO NOTHING;

-- Seed Products - Butchery
INSERT INTO products (category_id, name, description, price, unit, featured) VALUES
  ((SELECT id FROM categories WHERE slug='butchery'), 'Beef (1kg)', 'Fresh local beef - any cut', 650, 'kg', true),
  ((SELECT id FROM categories WHERE slug='butchery'), 'Goat Meat (1kg)', 'Fresh goat meat', 700, 'kg', true),
  ((SELECT id FROM categories WHERE slug='butchery'), 'Chicken (Whole)', 'Fresh whole chicken ~1.5kg', 550, 'piece', true),
  ((SELECT id FROM categories WHERE slug='butchery'), 'Chicken (Half)', 'Fresh half chicken', 300, 'piece', false),
  ((SELECT id FROM categories WHERE slug='butchery'), 'Pork (1kg)', 'Fresh pork ribs or chops', 600, 'kg', false),
  ((SELECT id FROM categories WHERE slug='butchery'), 'Liver (1kg)', 'Fresh beef liver', 400, 'kg', false),
  ((SELECT id FROM categories WHERE slug='butchery'), 'Minced Meat (500g)', 'Fresh minced beef', 350, 'pack', false),
  ((SELECT id FROM categories WHERE slug='butchery'), 'Bones (1kg)', 'Beef bones for soup', 100, 'kg', false)
ON CONFLICT DO NOTHING;

-- Seed Products - Bakery
INSERT INTO products (category_id, name, description, price, unit, featured) VALUES
  ((SELECT id FROM categories WHERE slug='bakery'), 'White Bread (Large)', 'Fresh sliced white bread', 65, 'loaf', true),
  ((SELECT id FROM categories WHERE slug='bakery'), 'Brown Bread', 'Whole wheat brown bread', 70, 'loaf', true),
  ((SELECT id FROM categories WHERE slug='bakery'), 'Mandazi (10pcs)', 'Fresh daily mandazi', 80, 'pack', false),
  ((SELECT id FROM categories WHERE slug='bakery'), 'Doughnuts (6pcs)', 'Soft glazed doughnuts', 100, 'pack', true),
  ((SELECT id FROM categories WHERE slug='bakery'), 'Birthday Cake', 'Custom birthday cake (order ahead)', 1500, 'cake', false),
  ((SELECT id FROM categories WHERE slug='bakery'), 'Buns (6pcs)', 'Soft sweet buns', 90, 'pack', false),
  ((SELECT id FROM categories WHERE slug='bakery'), 'Scones (6pcs)', 'Buttery scones', 120, 'pack', false),
  ((SELECT id FROM categories WHERE slug='bakery'), 'Chapati (5pcs)', 'Soft layered chapati', 100, 'pack', true)
ON CONFLICT DO NOTHING;

-- Seed Products - Groceries
INSERT INTO products (category_id, name, description, price, unit, featured) VALUES
  ((SELECT id FROM categories WHERE slug='groceries'), 'Sukuma Wiki (1kg)', 'Fresh kale greens', 30, 'kg', true),
  ((SELECT id FROM categories WHERE slug='groceries'), 'Tomatoes (1kg)', 'Fresh red tomatoes', 60, 'kg', true),
  ((SELECT id FROM categories WHERE slug='groceries'), 'Onions (1kg)', 'Red onions', 50, 'kg', false),
  ((SELECT id FROM categories WHERE slug='groceries'), 'Potatoes (1kg)', 'Irish potatoes', 60, 'kg', false),
  ((SELECT id FROM categories WHERE slug='groceries'), 'Carrots (1kg)', 'Fresh carrots', 60, 'kg', false),
  ((SELECT id FROM categories WHERE slug='groceries'), 'Cabbage (1 head)', 'Fresh cabbage', 40, 'piece', true),
  ((SELECT id FROM categories WHERE slug='groceries'), 'Maize Flour (2kg)', 'Unga wa ugali', 120, 'bag', true),
  ((SELECT id FROM categories WHERE slug='groceries'), 'Rice (1kg)', 'Long grain white rice', 130, 'kg', false),
  ((SELECT id FROM categories WHERE slug='groceries'), 'Cooking Oil (1L)', 'Refined vegetable oil', 220, 'bottle', true),
  ((SELECT id FROM categories WHERE slug='groceries'), 'Sugar (1kg)', 'White sugar', 120, 'kg', false)
ON CONFLICT DO NOTHING;
