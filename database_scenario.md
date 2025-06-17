# E-Ticaret Veritabanı Senaryosu 🛒

## Senaryo: TechMart Online Mağaza

TechMart, teknoloji ürünleri satan bir online mağazadır. Müşteriler siteye kayıt olur, ürünleri inceler, sepete ekler ve sipariş verir. Her sipariş birden fazla ürün içerebilir ve her ürün farklı kategorilerde olabilir.

## Veritabanı Şeması

### 1. Müşteriler (customers)

- `id` (SERIAL PRIMARY KEY)
- `first_name` (VARCHAR(50))
- `last_name` (VARCHAR(50))
- `email` (VARCHAR(100) UNIQUE)
- `phone` (VARCHAR(20))
- `birth_date` (DATE)
- `registration_date` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `city` (VARCHAR(50))
- `country` (VARCHAR(50))

### 2. Kategoriler (categories)

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) UNIQUE)
- `description` (TEXT)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 3. Ürünler (products)

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(200))
- `description` (TEXT)
- `price` (DECIMAL(10,2))
- `stock_quantity` (INTEGER)
- `category_id` (INTEGER REFERENCES categories(id))
- `brand` (VARCHAR(100))
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 4. Siparişler (orders)

- `id` (SERIAL PRIMARY KEY)
- `customer_id` (INTEGER REFERENCES customers(id))
- `order_date` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `status` (VARCHAR(20) DEFAULT 'pending')
- `total_amount` (DECIMAL(10,2))
- `shipping_address` (TEXT)

### 5. Sipariş Detayları (order_items)

- `id` (SERIAL PRIMARY KEY)
- `order_id` (INTEGER REFERENCES orders(id))
- `product_id` (INTEGER REFERENCES products(id))
- `quantity` (INTEGER)
- `unit_price` (DECIMAL(10,2))
- `total_price` (DECIMAL(10,2))

### 6. Yorumlar (reviews)

- `id` (SERIAL PRIMARY KEY)
- `customer_id` (INTEGER REFERENCES customers(id))
- `product_id` (INTEGER REFERENCES products(id))
- `rating` (INTEGER CHECK (rating >= 1 AND rating <= 5))
- `comment` (TEXT)
- `review_date` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## İlişkiler

- Bir müşteri birden fazla sipariş verebilir (1:N)
- Bir kategori birden fazla ürün içerebilir (1:N)
- Bir sipariş birden fazla ürün içerebilir (N:M - order_items üzerinden)
- Bir müşteri birden fazla ürün için yorum yapabilir (N:M - reviews üzerinden)
