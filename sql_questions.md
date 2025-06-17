# PostgreSQL Soru Bankası - TechMart E-Ticaret 🎯

## KOLAY SEVIYE (Temel SQL İşlemleri) 🟢

### Tablo Oluşturma ve Veri Ekleme

**1. Veritabanı Şemasını Oluşturun**

```sql
-- Önce kategoriler tablosunu oluşturun
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Müşteriler tablosunu oluşturun
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

-- Ürünler tablosunu oluşturun
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

-- Siparişler tablosunu oluşturun
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    shipping_address TEXT
);

-- Sipariş detayları tablosunu oluşturun
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- Yorumlar tablosunu oluşturun
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. Kategorileri Ekleyin**

```sql
INSERT INTO categories (name, description) VALUES
('Laptops', 'Portable computers and notebooks'),
('Smartphones', 'Mobile phones and accessories'),
('Tablets', 'Tablet computers and e-readers'),
('Gaming', 'Gaming consoles and accessories'),
('Audio', 'Headphones, speakers, and audio equipment'),
('Accessories', 'Computer and mobile accessories');
```

**3. Müşterileri Ekleyin**

```sql
INSERT INTO customers (first_name, last_name, email, phone, birth_date, city, country) VALUES
('Ahmet', 'Yılmaz', 'ahmet.yilmaz@email.com', '+90 555 123 4567', '1990-05-15', 'Istanbul', 'Turkey'),
('Fatma', 'Demir', 'fatma.demir@email.com', '+90 555 234 5678', '1985-08-22', 'Ankara', 'Turkey'),
('Mehmet', 'Kaya', 'mehmet.kaya@email.com', '+90 555 345 6789', '1992-12-03', 'Izmir', 'Turkey'),
('Ayşe', 'Çelik', 'ayse.celik@email.com', '+90 555 456 7890', '1988-03-18', 'Bursa', 'Turkey'),
('Ali', 'Özkan', 'ali.ozkan@email.com', '+90 555 567 8901', '1995-09-27', 'Antalya', 'Turkey'),
('Zeynep', 'Acar', 'zeynep.acar@email.com', '+90 555 678 9012', '1991-06-14', 'Istanbul', 'Turkey'),
('Emre', 'Şahin', 'emre.sahin@email.com', '+90 555 789 0123', '1987-11-08', 'Ankara', 'Turkey'),
('Elif', 'Güneş', 'elif.gunes@email.com', '+90 555 890 1234', '1993-04-25', 'Izmir', 'Turkey');
```

**4. Ürünleri Ekleyin**

```sql
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
```

### Temel Sorgular

**Soru 1:** Tüm kategorileri listeleyin.

```sql
-- ÇÖZÜM:
SELECT * FROM categories;
```

**Soru 2:** Fiyatı 1000 TL'den fazla olan ürünleri listeleyin.

```sql
-- ÇÖZÜM:
SELECT * FROM products WHERE price > 1000;
```

**Soru 3:** Apple markasının ürünlerini listeleyin.

```sql
-- ÇÖZÜM:
SELECT * FROM products WHERE brand = 'Apple';
```

**Soru 4:** Müşterileri şehirlerine göre sıralayarak listeleyin.

```sql
-- ÇÖZÜM:
SELECT * FROM customers ORDER BY city;
```

**Soru 5:** Stok miktarı 20'den az olan ürünleri listeleyin.

```sql
-- ÇÖZÜM:
SELECT * FROM products WHERE stock_quantity < 20;
```

**Soru 6:** İstanbul'da yaşayan müşterileri listeleyin.

```sql
-- ÇÖZÜM:
SELECT * FROM customers WHERE city = 'Istanbul';
```

**Soru 7:** En pahalı 5 ürünü listeleyin.

```sql
-- ÇÖZÜM:
SELECT * FROM products ORDER BY price DESC LIMIT 5;
```

**Soru 8:** 1990 yılından sonra doğan müşterileri listeleyin.

```sql
-- ÇÖZÜM:
SELECT * FROM customers WHERE birth_date > '1990-01-01';
```

## ORTA SEVIYE (JOIN, Aggregate, Subquery) 🟡

### Önce Sipariş Verilerini Ekleyelim

**Siparişleri Ekleyin:**

```sql
INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_address) VALUES
(1, '2024-01-15 10:30:00', 'completed', 2750.00, 'Beşiktaş, Istanbul'),
(2, '2024-01-20 14:45:00', 'shipped', 1350.00, 'Çankaya, Ankara'),
(3, '2024-02-05 09:15:00', 'completed', 600.00, 'Konak, Izmir'),
(4, '2024-02-10 16:20:00', 'pending', 1100.00, 'Nilüfer, Bursa'),
(1, '2024-02-15 11:00:00', 'completed', 430.00, 'Beşiktaş, Istanbul'),
(5, '2024-03-01 13:30:00', 'shipped', 500.00, 'Muratpaşa, Antalya'),
(6, '2024-03-05 15:45:00', 'completed', 850.00, 'Kadıköy, Istanbul'),
(7, '2024-03-10 12:15:00', 'processing', 1200.00, 'Keçiören, Ankara');
```

**Sipariş Detaylarını Ekleyin:**

```sql
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
```

**Yorumları Ekleyin:**

```sql
INSERT INTO reviews (customer_id, product_id, rating, comment) VALUES
(1, 1, 5, 'Mükemmel performans, çok memnunum!'),
(1, 9, 4, 'Ses kalitesi harika ama biraz pahalı'),
(2, 2, 4, 'Güzel laptop, öneriyorum'),
(3, 5, 5, 'iPad gerçekten çok kullanışlı'),
(4, 3, 5, 'iPhone kamerası muhteşem!'),
(5, 7, 3, 'PS5 bulması zor ama oyunları süper'),
(6, 4, 4, 'Samsung telefon çok iyi, Android seviyorum'),
(7, 2, 5, 'Dell laptop iş için mükemmel');
```

### JOIN Sorguları

**Soru 9:** Her ürünü kategori adıyla birlikte listeleyin.

```sql
-- ÇÖZÜM:
SELECT p.name AS product_name, c.name AS category_name, p.price
FROM products p
JOIN categories c ON p.category_id = c.id;
```

**Soru 10:** Müşterilerin sipariş bilgilerini getirin (müşteri adı, sipariş tarihi, toplam tutar).

```sql
-- ÇÖZÜM:
SELECT c.first_name, c.last_name, o.order_date, o.total_amount
FROM customers c
JOIN orders o ON c.id = o.customer_id
ORDER BY o.order_date;
```

**Soru 11:** Her siparişte hangi ürünlerin alındığını gösterin.

```sql
-- ÇÖZÜM:
SELECT o.id AS order_id, p.name AS product_name, oi.quantity, oi.total_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY o.id;
```

**Soru 12:** Müşterilerin yaptıkları yorumları ürün adlarıyla birlikte listeleyin.

```sql
-- ÇÖZÜM:
SELECT c.first_name, c.last_name, p.name AS product_name, r.rating, r.comment
FROM customers c
JOIN reviews r ON c.id = r.customer_id
JOIN products p ON r.product_id = p.id;
```

### Aggregate Fonksiyonlar

**Soru 13:** Her kategoride kaç ürün var?

```sql
-- ÇÖZÜM:
SELECT c.name AS category_name, COUNT(p.id) AS product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;
```

**Soru 14:** Her müşterinin toplam sipariş tutarını hesaplayın.

```sql
-- ÇÖZÜM:
SELECT c.first_name, c.last_name, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.last_name
ORDER BY total_spent DESC;
```

**Soru 15:** En çok satılan 3 ürünü bulun.

```sql
-- ÇÖZÜM:
SELECT p.name, SUM(oi.quantity) AS total_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 3;
```

**Soru 16:** Her markanın ortalama ürün fiyatını hesaplayın.

```sql
-- ÇÖZÜM:
SELECT brand, AVG(price) AS average_price, COUNT(*) AS product_count
FROM products
GROUP BY brand
ORDER BY average_price DESC;
```

### Subquery'ler

**Soru 17:** Ortalama fiyatın üzerindeki ürünleri listeleyin.

```sql
-- ÇÖZÜM:
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

**Soru 18:** Hiç sipariş vermemiş müşterileri bulun.

```sql
-- ÇÖZÜM:
SELECT first_name, last_name, email
FROM customers
WHERE id NOT IN (SELECT DISTINCT customer_id FROM orders WHERE customer_id IS NOT NULL);
```

**Soru 19:** En pahalı ürünü alan müşterinin bilgilerini getirin.

```sql
-- ÇÖZÜM:
SELECT c.first_name, c.last_name, p.name AS product_name, p.price
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE p.price = (SELECT MAX(price) FROM products);
```

## ZOR SEVIYE (Complex Queries, Window Functions, Advanced) 🔴

**Soru 20:** Her kategorinin aylık satış trendini gösterin.

```sql
-- ÇÖZÜM:
SELECT
    c.name AS category_name,
    DATE_TRUNC('month', o.order_date) AS month,
    SUM(oi.total_price) AS monthly_sales,
    COUNT(DISTINCT o.id) AS order_count
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
GROUP BY c.id, c.name, DATE_TRUNC('month', o.order_date)
ORDER BY c.name, month;
```

**Soru 21:** Müşterileri satın alma davranışlarına göre sınıflandırın (VIP, Normal, Yeni).

```sql
-- ÇÖZÜM:
SELECT
    c.first_name,
    c.last_name,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    COUNT(o.id) AS order_count,
    CASE
        WHEN COALESCE(SUM(o.total_amount), 0) > 2000 THEN 'VIP'
        WHEN COALESCE(SUM(o.total_amount), 0) > 500 THEN 'Normal'
        ELSE 'Yeni'
    END AS customer_segment
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.last_name
ORDER BY total_spent DESC;
```

**Soru 22:** Her ürün için ortalama değerlendirme puanını ve satış performansını gösterin.

```sql
-- ÇÖZÜM:
SELECT
    p.name,
    p.price,
    COALESCE(AVG(r.rating), 0) AS avg_rating,
    COALESCE(SUM(oi.quantity), 0) AS total_sold,
    COALESCE(SUM(oi.total_price), 0) AS total_revenue,
    COUNT(DISTINCT r.id) AS review_count
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.price
ORDER BY total_revenue DESC;
```

**Soru 23:** Window Functions kullanarak müşterilerin sipariş sıralamasını bulun.

```sql
-- ÇÖZÜM:
SELECT
    c.first_name,
    c.last_name,
    o.order_date,
    o.total_amount,
    ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY o.order_date) AS order_sequence,
    SUM(o.total_amount) OVER (PARTITION BY c.id ORDER BY o.order_date) AS cumulative_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
ORDER BY c.id, o.order_date;
```

**Soru 24:** Cohort analizi - müşteri tutma oranını hesaplayın.

```sql
-- ÇÖZÜM:
WITH customer_cohorts AS (
    SELECT
        c.id,
        DATE_TRUNC('month', c.registration_date) AS cohort_month,
        DATE_TRUNC('month', o.order_date) AS order_month
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
),
cohort_data AS (
    SELECT
        cohort_month,
        order_month,
        COUNT(DISTINCT id) AS customers
    FROM customer_cohorts
    WHERE order_month IS NOT NULL
    GROUP BY cohort_month, order_month
),
cohort_sizes AS (
    SELECT
        cohort_month,
        COUNT(DISTINCT id) AS cohort_size
    FROM customer_cohorts
    GROUP BY cohort_month
)
SELECT
    cd.cohort_month,
    cd.order_month,
    cd.customers,
    cs.cohort_size,
    ROUND(100.0 * cd.customers / cs.cohort_size, 2) AS retention_rate
FROM cohort_data cd
JOIN cohort_sizes cs ON cd.cohort_month = cs.cohort_month
ORDER BY cd.cohort_month, cd.order_month;
```

**Soru 25:** RFM Analizi (Recency, Frequency, Monetary) yapın.

```sql
-- ÇÖZÜM:
WITH rfm_calc AS (
    SELECT
        c.id,
        c.first_name,
        c.last_name,
        EXTRACT(DAYS FROM NOW() - MAX(o.order_date)) AS recency,
        COUNT(o.id) AS frequency,
        SUM(o.total_amount) AS monetary
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    GROUP BY c.id, c.first_name, c.last_name
),
rfm_scores AS (
    SELECT *,
        NTILE(5) OVER (ORDER BY recency DESC) AS recency_score,
        NTILE(5) OVER (ORDER BY frequency) AS frequency_score,
        NTILE(5) OVER (ORDER BY monetary) AS monetary_score
    FROM rfm_calc
)
SELECT
    first_name,
    last_name,
    recency,
    frequency,
    monetary,
    recency_score,
    frequency_score,
    monetary_score,
    CASE
        WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
        WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Loyal Customers'
        WHEN recency_score >= 3 AND frequency_score <= 2 THEN 'Potential Loyalists'
        WHEN recency_score <= 2 AND frequency_score >= 3 THEN 'At Risk'
        ELSE 'Others'
    END AS customer_segment
FROM rfm_scores
ORDER BY monetary_score DESC, frequency_score DESC, recency_score DESC;
```

**Soru 26:** Pivot table benzeri rapor - kategorilere göre aylık satışlar.

```sql
-- ÇÖZÜM:
SELECT
    DATE_TRUNC('month', o.order_date) AS month,
    SUM(CASE WHEN c.name = 'Laptops' THEN oi.total_price ELSE 0 END) AS laptops_sales,
    SUM(CASE WHEN c.name = 'Smartphones' THEN oi.total_price ELSE 0 END) AS smartphones_sales,
    SUM(CASE WHEN c.name = 'Tablets' THEN oi.total_price ELSE 0 END) AS tablets_sales,
    SUM(CASE WHEN c.name = 'Gaming' THEN oi.total_price ELSE 0 END) AS gaming_sales,
    SUM(CASE WHEN c.name = 'Audio' THEN oi.total_price ELSE 0 END) AS audio_sales,
    SUM(CASE WHEN c.name = 'Accessories' THEN oi.total_price ELSE 0 END) AS accessories_sales,
    SUM(oi.total_price) AS total_sales
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
GROUP BY DATE_TRUNC('month', o.order_date)
ORDER BY month;
```

## Ekstra Challenging Sorular 💪

**Soru 27:** Recursive CTE kullanarak ürün öneri sistemi oluşturun.

```sql
-- ÇÖZÜM: Aynı kategoriyi alan müşterilere benzer ürünler öner
WITH RECURSIVE product_recommendations AS (
    -- Base case: Müşterinin aldığı ürünler
    SELECT DISTINCT
        o.customer_id,
        p.category_id,
        p.id AS product_id,
        1 AS level
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.customer_id = 1  -- Belirli bir müşteri için

    UNION

    -- Recursive case: Aynı kategorideki diğer ürünler
    SELECT
        pr.customer_id,
        p.category_id,
        p.id AS product_id,
        pr.level + 1
    FROM product_recommendations pr
    JOIN products p ON pr.category_id = p.category_id
    WHERE pr.level < 2 AND p.id NOT IN (
        SELECT DISTINCT oi.product_id
        FROM orders o2
        JOIN order_items oi ON o2.id = oi.order_id
        WHERE o2.customer_id = pr.customer_id
    )
)
SELECT DISTINCT p.name, p.price, c.name AS category
FROM product_recommendations pr
JOIN products p ON pr.product_id = p.id
JOIN categories c ON p.category_id = c.id
WHERE pr.level > 1
LIMIT 5;
```

**Soru 28:** JSON aggregation kullanarak müşteri sipariş özetini oluşturun.

```sql
-- ÇÖZÜM:
SELECT
    c.first_name,
    c.last_name,
    JSON_BUILD_OBJECT(
        'total_orders', COUNT(o.id),
        'total_spent', COALESCE(SUM(o.total_amount), 0),
        'orders', JSON_AGG(
            JSON_BUILD_OBJECT(
                'order_id', o.id,
                'date', o.order_date,
                'amount', o.total_amount,
                'status', o.status,
                'items', (
                    SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'product', p.name,
                            'quantity', oi.quantity,
                            'price', oi.unit_price
                        )
                    )
                    FROM order_items oi
                    JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = o.id
                )
            ) ORDER BY o.order_date DESC
        ) FILTER (WHERE o.id IS NOT NULL)
    ) AS customer_summary
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.last_name;
```

## Performans ve Optimizasyon Soruları 🚀

**Soru 29:** Gerekli indexleri oluşturun ve EXPLAIN ANALYZE kullanın.

```sql
-- ÇÖZÜM:
-- Index'ler oluşturun
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);

-- Performansı test edin
EXPLAIN ANALYZE
SELECT p.name, c.name AS category, COUNT(oi.id) AS sales_count
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, c.name
ORDER BY sales_count DESC;
```

**Soru 30:** View ve Materialized View oluşturun.

```sql
-- ÇÖZÜM:
-- Satış raporu view'ı
CREATE VIEW sales_report AS
SELECT
    p.id,
    p.name AS product_name,
    c.name AS category_name,
    p.brand,
    p.price,
    COALESCE(SUM(oi.quantity), 0) AS total_sold,
    COALESCE(SUM(oi.total_price), 0) AS total_revenue,
    COALESCE(AVG(r.rating), 0) AS avg_rating
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name, c.name, p.brand, p.price;

-- Materialized view için
CREATE MATERIALIZED VIEW monthly_sales_summary AS
SELECT
    DATE_TRUNC('month', o.order_date) AS month,
    c.name AS category,
    COUNT(DISTINCT o.id) AS orders_count,
    SUM(oi.quantity) AS items_sold,
    SUM(oi.total_price) AS revenue
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
GROUP BY DATE_TRUNC('month', o.order_date), c.name;

-- Materialized view'ı yenileyin
REFRESH MATERIALIZED VIEW monthly_sales_summary;
```

## Başarı Seviyeleri 🏆

- **🥉 Bronz (20+ soru):** Temel SQL becerilerini kazandınız
- **🥈 Gümüş (25+ soru):** Orta seviye veritabanı analizi yapabiliyorsunuz
- **🥇 Altın (30+ soru):** İleri seviye PostgreSQL uzmanısınız
- **💎 Elmas (Tümü):** PostgreSQL veri analisti seviyesindesiniz!

## İpuçları 💡

1. **EXPLAIN ANALYZE** kullanarak sorgu performansını inceleyin
2. **Index'leri** doğru yerde kullanın
3. **Window functions** ile analitik sorguları çözün
4. **CTE'ler** ile karmaşık sorguları parçalayın
5. **JSON fonksiyonlarını** modern raporlama için kullanın

İyi çalışmalar! 🚀
