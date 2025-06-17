-- TechMart E-Ticaret Veritabanı - Başlangıç SQL'leri
-- Bu dosyayı PostgreSQL Playground'da adım adım çalıştırın

-- 1. Tabloları oluşturun (sırasıyla çalıştırın)

-- Kategoriler tablosu
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Müşteriler tablosu
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    city VARCHAR(50),
    country VARCHAR(50)
);

-- Ürünler tablosu
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    brand VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Siparişler tablosu
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    shipping_address TEXT
);

-- Sipariş detayları tablosu
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- Yorumlar tablosu
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Kategorileri ekleyin
INSERT INTO categories (name, description) VALUES
('Laptops', 'Portable computers and notebooks'),
('Smartphones', 'Mobile phones and accessories'),
('Tablets', 'Tablet computers and e-readers'),
('Gaming', 'Gaming consoles and accessories'),
('Audio', 'Headphones, speakers, and audio equipment'),
('Accessories', 'Computer and mobile accessories');

-- 3. Müşterileri ekleyin
INSERT INTO customers (first_name, last_name, email, phone, birth_date, city, country) VALUES
('Ahmet', 'Yılmaz', 'ahmet.yilmaz@email.com', '+90 555 123 4567', '1990-05-15', 'Istanbul', 'Turkey'),
('Fatma', 'Demir', 'fatma.demir@email.com', '+90 555 234 5678', '1985-08-22', 'Ankara', 'Turkey'),
('Mehmet', 'Kaya', 'mehmet.kaya@email.com', '+90 555 345 6789', '1992-12-03', 'Izmir', 'Turkey'),
('Ayşe', 'Çelik', 'ayse.celik@email.com', '+90 555 456 7890', '1988-03-18', 'Bursa', 'Turkey'),
('Ali', 'Özkan', 'ali.ozkan@email.com', '+90 555 567 8901', '1995-09-27', 'Antalya', 'Turkey'),
('Zeynep', 'Acar', 'zeynep.acar@email.com', '+90 555 678 9012', '1991-06-14', 'Istanbul', 'Turkey'),
('Emre', 'Şahin', 'emre.sahin@email.com', '+90 555 789 0123', '1987-11-08', 'Ankara', 'Turkey'),
('Elif', 'Güneş', 'elif.gunes@email.com', '+90 555 890 1234', '1993-04-25', 'Izmir', 'Turkey');

-- 4. Ürünleri ekleyin
INSERT INTO products (name, description, price, stock_quantity, category_id, brand) VALUES
('MacBook Pro 16"', 'Professional laptop with M2 chip', 2500.00, 15, 1, 'Apple'),
('Dell XPS 13', 'Ultra-portable business laptop', 1200.00, 25, 1, 'Dell'),
('iPhone 14 Pro', 'Latest flagship smartphone', 1100.00, 50, 2, 'Apple'),
('Samsung Galaxy S23', 'Android flagship smartphone', 950.00, 40, 2, 'Samsung'),
('iPad Air', 'Versatile tablet for work and play', 650.00, 30, 3, 'Apple'),
('Samsung Galaxy Tab S8', 'Premium Android tablet', 750.00, 20, 3, 'Samsung'),
('PlayStation 5', 'Next-gen gaming console', 500.00, 12, 4, 'Sony'),
('Xbox Series X', 'Powerful gaming console', 500.00, 18, 4, 'Microsoft'),
('AirPods Pro', 'Wireless noise-cancelling earphones', 250.00, 60, 5, 'Apple'),
('Sony WH-1000XM4', 'Premium noise-cancelling headphones', 350.00, 35, 5, 'Sony'),
('Logitech MX Master 3', 'Professional wireless mouse', 100.00, 80, 6, 'Logitech'),
('Magic Keyboard', 'Wireless keyboard for Mac', 180.00, 45, 6, 'Apple');

-- 5. Siparişleri ekleyin
INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_address) VALUES
(1, '2024-01-15 10:30:00', 'completed', 2750.00, 'Beşiktaş, Istanbul'),
(2, '2024-01-20 14:45:00', 'shipped', 1350.00, 'Çankaya, Ankara'),
(3, '2024-02-05 09:15:00', 'completed', 650.00, 'Konak, Izmir'),
(4, '2024-02-10 16:20:00', 'pending', 1100.00, 'Nilüfer, Bursa'),
(1, '2024-02-15 11:00:00', 'completed', 430.00, 'Beşiktaş, Istanbul'),
(5, '2024-03-01 13:30:00', 'shipped', 500.00, 'Muratpaşa, Antalya'),
(6, '2024-03-05 15:45:00', 'completed', 850.00, 'Kadıköy, Istanbul'),
(7, '2024-03-10 12:15:00', 'processing', 1200.00, 'Keçiören, Ankara');

-- 6. Sipariş detaylarını ekleyin
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
-- Sipariş 1 (Ahmet)
(1, 1, 1, 2500.00, 2500.00),
(1, 9, 1, 250.00, 250.00),
-- Sipariş 2 (Fatma)  
(2, 2, 1, 1200.00, 1200.00),
(2, 11, 1, 100.00, 100.00),
(2, 12, 1, 50.00, 50.00),
-- Sipariş 3 (Mehmet)
(3, 5, 1, 650.00, 650.00),
-- Sipariş 4 (Ayşe)
(4, 3, 1, 1100.00, 1100.00),
-- Sipariş 5 (Ahmet tekrar)
(5, 10, 1, 350.00, 350.00),
(5, 11, 1, 80.00, 80.00),
-- Sipariş 6 (Ali)
(6, 7, 1, 500.00, 500.00),
-- Sipariş 7 (Zeynep)
(7, 4, 1, 950.00, 950.00),
-- Sipariş 8 (Emre)
(8, 2, 1, 1200.00, 1200.00);

-- 7. Yorumları ekleyin
INSERT INTO reviews (customer_id, product_id, rating, comment) VALUES
(1, 1, 5, 'Mükemmel performans, çok memnunum!'),
(1, 9, 4, 'Ses kalitesi harika ama biraz pahalı'),
(2, 2, 4, 'Güzel laptop, öneriyorum'),
(3, 5, 5, 'iPad gerçekten çok kullanışlı'),
(4, 3, 5, 'iPhone kamerası muhteşem!'),
(5, 7, 3, 'PS5 bulması zor ama oyunları süper'),
(6, 4, 4, 'Samsung telefon çok iyi, Android seviyorum'),
(7, 2, 5, 'Dell laptop iş için mükemmel');

-- 8. İndexleri oluşturun (performans için)
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);

-- BAŞLANGIÇ SORULARI - Bu sorguları deneyebilirsiniz:

-- Kolay Seviye Örnekler:
-- SELECT * FROM categories;
-- SELECT * FROM products WHERE price > 1000;
-- SELECT * FROM customers WHERE city = 'Istanbul';

-- Orta Seviye Örnekler:
-- SELECT p.name, c.name AS category FROM products p JOIN categories c ON p.category_id = c.id;
-- SELECT c.first_name, c.last_name, SUM(o.total_amount) AS total_spent FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.first_name, c.last_name;

-- Zor Seviye Örnekler:
-- WITH customer_stats AS (SELECT customer_id, COUNT(*) as order_count, SUM(total_amount) as total_spent FROM orders GROUP BY customer_id) SELECT c.first_name, c.last_name, cs.order_count, cs.total_spent FROM customers c JOIN customer_stats cs ON c.id = cs.customer_id ORDER BY cs.total_spent DESC;

-- Veritabanınız hazır! Artık sql_questions.md dosyasındaki soruları çözebilirsiniz.
