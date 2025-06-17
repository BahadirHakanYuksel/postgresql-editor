"use client";

import { useState, useEffect } from "react";
import DynamicQuestionCreator from "./DynamicQuestionCreator";
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Trophy,
  Star,
  Target,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Play,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Database,
  Table,
  Key,
  ArrowRight,
  X,
} from "lucide-react";

const QuestionBank = ({ onQuerySelect, tables }) => {
  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showQuestionCreator, setShowQuestionCreator] = useState(false);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [showSchemaModal, setShowSchemaModal] = useState(false);

  // Database Schema Definition
  const databaseSchema = {
    categories: {
      name: "categories",
      description: "Ürün kategorileri",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          isPrimary: true,
          description: "Kategori ID",
        },
        {
          name: "name",
          type: "VARCHAR(100)",
          isUnique: true,
          description: "Kategori adı",
        },
        {
          name: "description",
          type: "TEXT",
          description: "Kategori açıklaması",
        },
        {
          name: "created_at",
          type: "TIMESTAMP",
          description: "Oluşturma tarihi",
        },
      ],
    },
    customers: {
      name: "customers",
      description: "Müşteri bilgileri",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          isPrimary: true,
          description: "Müşteri ID",
        },
        { name: "first_name", type: "VARCHAR(50)", description: "Ad" },
        { name: "last_name", type: "VARCHAR(50)", description: "Soyad" },
        {
          name: "email",
          type: "VARCHAR(100)",
          isUnique: true,
          description: "E-posta",
        },
        { name: "phone", type: "VARCHAR(20)", description: "Telefon" },
        { name: "birth_date", type: "DATE", description: "Doğum tarihi" },
        {
          name: "registration_date",
          type: "TIMESTAMP",
          description: "Kayıt tarihi",
        },
        { name: "city", type: "VARCHAR(50)", description: "Şehir" },
        { name: "country", type: "VARCHAR(50)", description: "Ülke" },
      ],
    },
    products: {
      name: "products",
      description: "Ürün bilgileri",
      columns: [
        { name: "id", type: "SERIAL", isPrimary: true, description: "Ürün ID" },
        { name: "name", type: "VARCHAR(200)", description: "Ürün adı" },
        { name: "description", type: "TEXT", description: "Ürün açıklaması" },
        { name: "price", type: "DECIMAL(10,2)", description: "Fiyat" },
        {
          name: "stock_quantity",
          type: "INTEGER",
          description: "Stok miktarı",
        },
        {
          name: "category_id",
          type: "INTEGER",
          isForeign: true,
          references: "categories(id)",
          description: "Kategori referansı",
        },
        { name: "brand", type: "VARCHAR(100)", description: "Marka" },
        {
          name: "created_at",
          type: "TIMESTAMP",
          description: "Oluşturma tarihi",
        },
        {
          name: "updated_at",
          type: "TIMESTAMP",
          description: "Güncelleme tarihi",
        },
      ],
    },
    orders: {
      name: "orders",
      description: "Sipariş bilgileri",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          isPrimary: true,
          description: "Sipariş ID",
        },
        {
          name: "customer_id",
          type: "INTEGER",
          isForeign: true,
          references: "customers(id)",
          description: "Müşteri referansı",
        },
        {
          name: "order_date",
          type: "TIMESTAMP",
          description: "Sipariş tarihi",
        },
        { name: "status", type: "VARCHAR(20)", description: "Sipariş durumu" },
        {
          name: "total_amount",
          type: "DECIMAL(10,2)",
          description: "Toplam tutar",
        },
        {
          name: "shipping_address",
          type: "TEXT",
          description: "Teslimat adresi",
        },
      ],
    },
    order_items: {
      name: "order_items",
      description: "Sipariş detayları",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          isPrimary: true,
          description: "Kayıt ID",
        },
        {
          name: "order_id",
          type: "INTEGER",
          isForeign: true,
          references: "orders(id)",
          description: "Sipariş referansı",
        },
        {
          name: "product_id",
          type: "INTEGER",
          isForeign: true,
          references: "products(id)",
          description: "Ürün referansı",
        },
        { name: "quantity", type: "INTEGER", description: "Miktar" },
        {
          name: "unit_price",
          type: "DECIMAL(10,2)",
          description: "Birim fiyat",
        },
        {
          name: "total_price",
          type: "DECIMAL(10,2)",
          description: "Toplam fiyat",
        },
      ],
    },
    reviews: {
      name: "reviews",
      description: "Ürün yorumları",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          isPrimary: true,
          description: "Yorum ID",
        },
        {
          name: "customer_id",
          type: "INTEGER",
          isForeign: true,
          references: "customers(id)",
          description: "Müşteri referansı",
        },
        {
          name: "product_id",
          type: "INTEGER",
          isForeign: true,
          references: "products(id)",
          description: "Ürün referansı",
        },
        { name: "rating", type: "INTEGER", description: "Puan (1-5)" },
        { name: "comment", type: "TEXT", description: "Yorum metni" },
        { name: "review_date", type: "TIMESTAMP", description: "Yorum tarihi" },
      ],
    },
  };

  const questions = {
    easy: [
      {
        id: 1,
        title: "Tüm Kategorileri Listele",
        description: "Veritabanındaki tüm kategorileri görüntüleyin.",
        category: "Temel SELECT",
        difficulty: "Kolay",
        points: 10,
        hint: "SELECT * FROM ile tablonun tüm kolonlarını getirebilirsiniz.",
        solution: "SELECT * FROM categories;",
        explanation:
          "Bu sorgu categories tablosundaki tüm satırları ve kolonları getirir.",
        tags: ["SELECT", "Basic"],
      },
      {
        id: 2,
        title: "Pahalı Ürünleri Bul",
        description: "Fiyatı 1000 TL'den fazla olan ürünleri listeleyin.",
        category: "Filtreleme",
        difficulty: "Kolay",
        points: 15,
        hint: "WHERE koşulunda > operatörünü kullanın.",
        solution: "SELECT * FROM products WHERE price > 1000;",
        explanation:
          "WHERE price > 1000 koşulu ile fiyatı 1000'den büyük ürünleri filtreler.",
        tags: ["WHERE", "Comparison"],
      },
      {
        id: 3,
        title: "Apple Ürünleri",
        description: "Apple markasının tüm ürünlerini listeleyin.",
        category: "Filtreleme",
        difficulty: "Kolay",
        points: 15,
        hint: "String karşılaştırması için = operatörünü kullanın.",
        solution: "SELECT * FROM products WHERE brand = 'Apple';",
        explanation:
          "String değerler tek tırnak içinde yazılır ve = ile karşılaştırılır.",
        tags: ["WHERE", "String"],
      },
      {
        id: 4,
        title: "Müşterileri Şehre Göre Sırala",
        description:
          "Tüm müşterileri şehir adına göre alfabetik olarak sıralayın.",
        category: "Sıralama",
        difficulty: "Kolay",
        points: 20,
        hint: "ORDER BY kullanarak alfabetik sıralama yapabilirsiniz.",
        solution: "SELECT * FROM customers ORDER BY city;",
        explanation: "ORDER BY varsayılan olarak ASC (artan) sıralama yapar.",
        tags: ["ORDER BY", "Sorting"],
        relatedTables: ["customers"],
        schemaInfo:
          "customers tablosu: müşteri bilgileri (id, first_name, last_name, email, city, country, birth_date)",
      },
      {
        id: 5,
        title: "Stok Durumu Kontrolü",
        description: "Stok miktarı 20'den az olan ürünleri listeleyin.",
        category: "Filtreleme",
        difficulty: "Kolay",
        points: 15,
        hint: "WHERE koşulunda < operatörünü kullanın.",
        solution: "SELECT * FROM products WHERE stock_quantity < 20;",
        explanation:
          "WHERE stock_quantity < 20 koşulu ile az stoklu ürünleri filtreler.",
        tags: ["WHERE", "Comparison"],
        relatedTables: ["products"],
        schemaInfo:
          "products tablosu: ürün bilgileri (id, name, price, stock_quantity, category_id, brand)",
      },
      {
        id: 6,
        title: "Belirli Şehirdeki Müşteriler",
        description: "İstanbul'da yaşayan müşterileri listeleyin.",
        category: "Filtreleme",
        difficulty: "Kolay",
        points: 15,
        hint: "String eşleştirmesi için = operatörünü kullanın.",
        solution: "SELECT * FROM customers WHERE city = 'Istanbul';",
        explanation:
          "WHERE city = 'Istanbul' koşulu ile sadece İstanbul'daki müşterileri getirir.",
        tags: ["WHERE", "String"],
        relatedTables: ["customers"],
        schemaInfo:
          "customers tablosu: müşteri bilgileri - city kolonu şehir bilgisini tutar",
      },
      {
        id: 7,
        title: "En Pahalı Ürünler",
        description: "En pahalı 5 ürünü fiyat sırasına göre listeleyin.",
        category: "Sıralama",
        difficulty: "Kolay",
        points: 20,
        hint: "ORDER BY DESC ve LIMIT kullanın.",
        solution: "SELECT * FROM products ORDER BY price DESC LIMIT 5;",
        explanation:
          "ORDER BY price DESC ile fiyata göre azalan sıralama, LIMIT 5 ile ilk 5 kayıt.",
        tags: ["ORDER BY", "LIMIT", "DESC"],
        relatedTables: ["products"],
        schemaInfo:
          "products tablosu: price kolonu ürün fiyatını DECIMAL formatında tutar",
      },
      {
        id: 8,
        title: "Genç Müşteriler",
        description: "1990 yılından sonra doğan müşterileri listeleyin.",
        category: "Filtreleme",
        difficulty: "Kolay",
        points: 20,
        hint: "Date karşılaştırması için > operatörünü kullanın.",
        solution: "SELECT * FROM customers WHERE birth_date > '1990-01-01';",
        explanation:
          "Date değerleri tek tırnak içinde 'YYYY-MM-DD' formatında yazılır.",
        tags: ["WHERE", "Date"],
        relatedTables: ["customers"],
        schemaInfo:
          "customers tablosu: birth_date kolonu DATE formatında doğum tarihini tutar",
      },
      {
        id: 9,
        title: "Ürün Sayısı",
        description: "Veritabanında toplam kaç ürün olduğunu bulun.",
        category: "Aggregate",
        difficulty: "Kolay",
        points: 25,
        hint: "COUNT(*) fonksiyonunu kullanın.",
        solution: "SELECT COUNT(*) FROM products;",
        explanation:
          "COUNT(*) fonksiyonu tablodaki toplam satır sayısını döndürür.",
        tags: ["COUNT", "Aggregate"],
        relatedTables: ["products"],
        schemaInfo: "products tablosu: tüm ürün kayıtlarını içerir",
      },
      {
        id: 10,
        title: "Belirli Marka Filtreleme",
        description: "Samsung ve Sony markalarının ürünlerini listeleyin.",
        category: "Filtreleme",
        difficulty: "Kolay",
        points: 25,
        hint: "IN operatörünü kullanarak birden fazla değer kontrol edin.",
        solution: "SELECT * FROM products WHERE brand IN ('Samsung', 'Sony');",
        explanation:
          "IN operatörü ile birden fazla değer arasında kontrol yapabilirsiniz.",
        tags: ["WHERE", "IN", "Multiple Values"],
        relatedTables: ["products"],
        schemaInfo:
          "products tablosu: brand kolonu ürün markasını VARCHAR formatında tutar",
      },
    ],
    medium: [
      {
        id: 11,
        title: "Ürün-Kategori JOIN",
        description: "Her ürünü kategori adıyla birlikte listeleyin.",
        category: "JOIN İşlemleri",
        difficulty: "Orta",
        points: 30,
        hint: "İki tabloyu birleştirmek için JOIN kullanın. Foreign key ile primary key'i eşleştirin.",
        solution: `SELECT p.name AS product_name, c.name AS category_name, p.price 
FROM products p
JOIN categories c ON p.category_id = c.id;`,
        explanation:
          "INNER JOIN ile iki tabloyu category_id foreign key üzerinden birleştiriyoruz.",
        tags: ["JOIN", "Foreign Key"],
        relatedTables: ["products", "categories"],
        schemaInfo:
          "products.category_id → categories.id (Foreign Key ilişkisi)",
      },
      {
        id: 12,
        title: "Kategori Başına Ürün Sayısı",
        description: "Her kategoride kaç ürün olduğunu hesaplayın.",
        category: "Aggregate Fonksiyonlar",
        difficulty: "Orta",
        points: 35,
        hint: "GROUP BY ile gruplama yapın ve COUNT() fonksiyonunu kullanın.",
        solution: `SELECT c.name AS category_name, COUNT(p.id) AS product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;`,
        explanation:
          "LEFT JOIN ile tüm kategorileri, GROUP BY ile gruplama, COUNT ile sayım yapıyoruz.",
        tags: ["GROUP BY", "COUNT", "LEFT JOIN"],
        relatedTables: ["categories", "products"],
        schemaInfo: "LEFT JOIN: Ürünü olmayan kategoriler de gösterilir",
      },
      {
        id: 13,
        title: "Müşteri Harcama Toplamı",
        description: "Her müşterinin toplam sipariş tutarını hesaplayın.",
        category: "Aggregate Fonksiyonlar",
        difficulty: "Orta",
        points: 40,
        hint: "SUM() fonksiyonu ile toplamı hesaplayın ve GROUP BY ile müşterilere göre gruplandırın.",
        solution: `SELECT c.first_name, c.last_name, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.last_name
ORDER BY total_spent DESC;`,
        explanation:
          "JOIN ile müşteri-sipariş tablolarını birleştirip, SUM ile toplam harcamayı hesaplıyoruz.",
        tags: ["SUM", "GROUP BY", "JOIN"],
        relatedTables: ["customers", "orders"],
        schemaInfo:
          "customers.id → orders.customer_id ilişkisi ile müşteri siparişleri",
      },
      {
        id: 14,
        title: "En Çok Satan Ürünler",
        description: "Sipariş miktarına göre en çok satılan 3 ürünü bulun.",
        category: "Aggregate Fonksiyonlar",
        difficulty: "Orta",
        points: 45,
        hint: "SUM(quantity) ile toplam satış miktarını hesaplayın.",
        solution: `SELECT p.name, SUM(oi.quantity) AS total_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 3;`,
        explanation:
          "order_items tablosundaki quantity değerlerini toplayarak en çok satan ürünleri buluyoruz.",
        tags: ["SUM", "GROUP BY", "JOIN", "LIMIT"],
        relatedTables: ["products", "order_items"],
        schemaInfo:
          "products.id → order_items.product_id ilişkisi ile ürün satışları",
      },
      {
        id: 15,
        title: "Marka Bazında Ortalama Fiyat",
        description: "Her markanın ortalama ürün fiyatını hesaplayın.",
        category: "Aggregate Fonksiyonlar",
        difficulty: "Orta",
        points: 35,
        hint: "AVG() fonksiyonu ile ortalama hesaplayın.",
        solution: `SELECT brand, AVG(price) AS average_price, COUNT(*) AS product_count
FROM products
GROUP BY brand
ORDER BY average_price DESC;`,
        explanation:
          "GROUP BY brand ile markalar gruplandırılır, AVG() ile ortalama fiyat hesaplanır.",
        tags: ["AVG", "GROUP BY", "COUNT"],
        relatedTables: ["products"],
        schemaInfo:
          "products tablosu: brand ve price kolonları gruplandırma ve hesaplama için",
      },
      {
        id: 16,
        title: "Müşteri Sipariş Detayları",
        description:
          "Müşterilerin sipariş bilgilerini getirin (ad, sipariş tarihi, tutar).",
        category: "JOIN İşlemleri",
        difficulty: "Orta",
        points: 30,
        hint: "customers ve orders tablolarını JOIN ile birleştirin.",
        solution: `SELECT c.first_name, c.last_name, o.order_date, o.total_amount
FROM customers c
JOIN orders o ON c.id = o.customer_id
ORDER BY o.order_date;`,
        explanation:
          "İki tablo arasındaki ilişki ile müşteri ve sipariş bilgileri birleştirilir.",
        tags: ["JOIN", "SELECT"],
        relatedTables: ["customers", "orders"],
        schemaInfo: "customers.id = orders.customer_id (One-to-Many ilişki)",
      },
      {
        id: 17,
        title: "Sipariş İçerikleri",
        description: "Her siparişte hangi ürünlerin alındığını gösterin.",
        category: "JOIN İşlemleri",
        difficulty: "Orta",
        points: 40,
        hint: "Üç tabloyu JOIN ile birleştirin: orders, order_items, products.",
        solution: `SELECT o.id AS order_id, p.name AS product_name, oi.quantity, oi.total_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY o.id;`,
        explanation:
          "Üç tablo arasındaki ilişkiler ile sipariş detayları elde edilir.",
        tags: ["JOIN", "Multiple Tables"],
        relatedTables: ["orders", "order_items", "products"],
        schemaInfo:
          "orders → order_items → products (Many-to-Many ilişki order_items üzerinden)",
      },
      {
        id: 18,
        title: "Ortalama Üzeri Fiyatlar",
        description: "Ortalama fiyatın üzerindeki ürünleri listeleyin.",
        category: "Subqueries",
        difficulty: "Orta",
        points: 40,
        hint: "Subquery ile ortalama fiyatı hesaplayın, sonra karşılaştırın.",
        solution: `SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);`,
        explanation:
          "Alt sorgu ile ortalama fiyat hesaplanır, ana sorguda bu değerle karşılaştırma yapılır.",
        tags: ["Subquery", "AVG", "WHERE"],
        relatedTables: ["products"],
        schemaInfo:
          "products tablosu: price kolonu üzerinde ortalama hesaplama",
      },
      {
        id: 19,
        title: "Aktif Olmayan Müşteriler",
        description: "Hiç sipariş vermemiş müşterileri bulun.",
        category: "Subqueries",
        difficulty: "Orta",
        points: 45,
        hint: "NOT IN veya LEFT JOIN ile sipariş vermeyen müşterileri bulun.",
        solution: `SELECT first_name, last_name, email
FROM customers
WHERE id NOT IN (SELECT DISTINCT customer_id FROM orders WHERE customer_id IS NOT NULL);`,
        explanation:
          "NOT IN ile orders tablosunda bulunmayan müşteri ID'lerini filtreliyoruz.",
        tags: ["NOT IN", "Subquery", "NULL"],
        relatedTables: ["customers", "orders"],
        schemaInfo:
          "customers.id ↔ orders.customer_id ilişkisinde boşluk kontrolü",
      },
      {
        id: 20,
        title: "En Pahalı Ürünü Alan Müşteri",
        description:
          "En pahalı ürünü satın alan müşterinin bilgilerini getirin.",
        category: "Subqueries",
        difficulty: "Orta",
        points: 50,
        hint: "Subquery ile en yüksek fiyatı bulun, sonra bu fiyattaki ürünü alan müşteriyi bulun.",
        solution: `SELECT c.first_name, c.last_name, p.name AS product_name, p.price
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE p.price = (SELECT MAX(price) FROM products);`,
        explanation:
          "Subquery ile maksimum fiyat bulunur, JOIN'ler ile bu ürünü alan müşteri bilgileri getirilir.",
        tags: ["MAX", "Subquery", "JOIN"],
        relatedTables: ["customers", "orders", "order_items", "products"],
        schemaInfo:
          "4 tablo arasındaki ilişki zinciri ile en pahalı ürün alımı",
      },
      {
        id: 27,
        title: "Müşteri Segmentasyonu",
        description:
          "Müşterileri harcama tutarlarına göre segmentlere ayırın (Düşük, Orta, Yüksek).",
        category: "Data Analysis",
        difficulty: "Orta",
        points: 45,
        hint: "CASE WHEN ile harcama tutarına göre kategorilendirme yapın.",
        solution: `SELECT 
    c.first_name,
    c.last_name,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    CASE 
        WHEN COALESCE(SUM(o.total_amount), 0) >= 5000 THEN 'Yüksek Değerli'
        WHEN COALESCE(SUM(o.total_amount), 0) >= 1000 THEN 'Orta Değerli'
        ELSE 'Düşük Değerli'
    END AS customer_segment
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.last_name
ORDER BY total_spent DESC;`,
        explanation:
          "CASE WHEN ile harcama tutarına göre müşteri segmentasyonu yapılır.",
        tags: ["CASE WHEN", "SUM", "GROUP BY"],
        relatedTables: ["customers", "orders"],
        schemaInfo: "Müşteri ve sipariş tutarları ile segmentasyon analizi",
      },
      {
        id: 28,
        title: "Aylık Satış Trendi",
        description:
          "Son 12 ayın aylık satış tutarlarını ve büyüme oranlarını hesaplayın.",
        category: "Time Series",
        difficulty: "Orta",
        points: 50,
        hint: "LAG() window function ile önceki ayın değerini alın.",
        solution: `SELECT 
    DATE_TRUNC('month', order_date) AS month,
    SUM(total_amount) AS monthly_sales,
    LAG(SUM(total_amount)) OVER (ORDER BY DATE_TRUNC('month', order_date)) AS previous_month_sales,
    ROUND(
        ((SUM(total_amount) - LAG(SUM(total_amount)) OVER (ORDER BY DATE_TRUNC('month', order_date))) 
         / LAG(SUM(total_amount)) OVER (ORDER BY DATE_TRUNC('month', order_date))) * 100, 2
    ) AS growth_rate_percent
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;`,
        explanation:
          "LAG() window function ile önceki ay verisi alınarak büyüme oranı hesaplanır.",
        tags: ["LAG", "Window Functions", "DATE_TRUNC"],
        relatedTables: ["orders"],
        schemaInfo: "orders.order_date ve total_amount ile aylık trend analizi",
      },
      {
        id: 29,
        title: "Ürün Performans Analizi",
        description:
          "Ürünlerin satış performansını kategori ortalamalarıyla karşılaştırın.",
        category: "Performance Analysis",
        difficulty: "Orta",
        points: 45,
        hint: "Window function ile kategori ortalaması hesaplayın.",
        solution: `SELECT 
    p.name AS product_name,
    c.name AS category_name,
    COALESCE(SUM(oi.quantity), 0) AS units_sold,
    COALESCE(SUM(oi.total_price), 0) AS revenue,
    AVG(COALESCE(SUM(oi.total_price), 0)) OVER (PARTITION BY p.category_id) AS category_avg_revenue,
    CASE 
        WHEN COALESCE(SUM(oi.total_price), 0) > AVG(COALESCE(SUM(oi.total_price), 0)) OVER (PARTITION BY p.category_id) 
        THEN 'Ortalamanın Üstünde'
        ELSE 'Ortalamanın Altında'
    END AS performance_status
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, c.name, p.category_id
ORDER BY revenue DESC;`,
        explanation:
          "Window function ile kategori ortalaması hesaplanarak ürün performansı değerlendirilir.",
        tags: ["Window Functions", "AVG", "PARTITION BY"],
        relatedTables: ["products", "categories", "order_items"],
        schemaInfo: "3 tablo ilişkisi ile ürün performans karşılaştırması",
      },
      {
        id: 30,
        title: "Müşteri Yaşam Döngüsü",
        description:
          "Müşterilerin ilk ve son sipariş tarihleri arasındaki süreyi hesaplayın.",
        category: "Customer Analysis",
        difficulty: "Orta",
        points: 40,
        hint: "MIN ve MAX fonksiyonları ile tarih aralığı hesaplayın.",
        solution: `SELECT 
    c.first_name,
    c.last_name,
    MIN(o.order_date) AS first_order,
    MAX(o.order_date) AS last_order,
    COUNT(o.id) AS total_orders,
    EXTRACT(DAYS FROM MAX(o.order_date) - MIN(o.order_date)) AS customer_lifetime_days,
    ROUND(SUM(o.total_amount) / COUNT(o.id), 2) AS avg_order_value
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.last_name
HAVING COUNT(o.id) > 1
ORDER BY customer_lifetime_days DESC;`,
        explanation:
          "MIN/MAX ile müşterinin sipariş döngüsü ve yaşam boyu değeri hesaplanır.",
        tags: ["MIN", "MAX", "EXTRACT", "HAVING"],
        relatedTables: ["customers", "orders"],
        schemaInfo: "Müşteri sipariş geçmişi ile yaşam döngüsü analizi",
      },
    ],
    hard: [
      {
        id: 21,
        title: "Window Function - Sipariş Sıralaması",
        description: "Her müşterinin siparişlerini zamana göre numaralandırın.",
        category: "Window Functions",
        difficulty: "Zor",
        points: 60,
        hint: "ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) kullanın.",
        solution: `SELECT 
    c.first_name,
    c.last_name,
    o.order_date,
    o.total_amount,
    ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY o.order_date) AS order_sequence
FROM customers c
JOIN orders o ON c.id = o.customer_id
ORDER BY c.id, o.order_date;`,
        explanation:
          "Window function ile her müşteri için sipariş sırasını hesaplıyoruz.",
        tags: ["ROW_NUMBER", "OVER", "PARTITION BY"],
        relatedTables: ["customers", "orders"],
        schemaInfo:
          "Window function ile müşteri bazında sipariş sıralaması yapılır",
      },
      {
        id: 22,
        title: "RFM Analizi",
        description:
          "Müşterilerin Recency, Frequency, Monetary analizini yapın.",
        category: "Advanced Analytics",
        difficulty: "Zor",
        points: 80,
        hint: "CTE kullanın ve NTILE() fonksiyonu ile skorları hesaplayın.",
        solution: `WITH rfm_calc AS (
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
SELECT * FROM rfm_scores;`,
        explanation:
          "İki aşamalı CTE ile RFM değerlerini hesaplayıp skorlara dönüştürüyoruz.",
        tags: ["CTE", "NTILE", "EXTRACT"],
        relatedTables: ["customers", "orders"],
        schemaInfo:
          "CTE ile müşteri analizi: Recency (son sipariş), Frequency (sıklık), Monetary (harcama)",
      },
      {
        id: 23,
        title: "Korelasyon Analizi",
        description:
          "Ürün fiyatı ve satış miktarı arasındaki ilişkiyi analiz edin.",
        category: "Advanced Analytics",
        difficulty: "Zor",
        points: 70,
        hint: "CORR() fonksiyonu kullanın veya manuel korelasyon hesabı yapın.",
        solution: `SELECT 
    p.name,
    p.price,
    COALESCE(SUM(oi.quantity), 0) AS total_sales,
    AVG(p.price) OVER() AS avg_price,
    AVG(COALESCE(SUM(oi.quantity), 0)) OVER() AS avg_sales
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.price
ORDER BY total_sales DESC;`,
        explanation:
          "Ürün fiyatları ve satış miktarları arasındaki ilişki analiz edilir.",
        tags: ["CORR", "Window Functions", "Analytics"],
        relatedTables: ["products", "order_items"],
        schemaInfo:
          "products.price ve order_items.quantity arasındaki korelasyon analizi",
      },
      {
        id: 24,
        title: "Cohort Analizi",
        description:
          "Müşteri cohort analizini aylık kayıt tarihlerine göre yapın.",
        category: "Advanced Analytics",
        difficulty: "Zor",
        points: 85,
        hint: "DATE_TRUNC ve LAG/LEAD fonksiyonlarını kullanın.",
        solution: `WITH cohort_data AS (
    SELECT 
        c.id,
        DATE_TRUNC('month', c.registration_date) AS cohort_month,
        DATE_TRUNC('month', o.order_date) AS order_month
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
),
cohort_periods AS (
    SELECT 
        cohort_month,
        order_month,
        EXTRACT(MONTH FROM AGE(order_month, cohort_month)) AS period_number,
        COUNT(DISTINCT id) AS customers
    FROM cohort_data
    WHERE order_month IS NOT NULL
    GROUP BY cohort_month, order_month
)
SELECT 
    cohort_month,
    period_number,
    customers,
    FIRST_VALUE(customers) OVER (PARTITION BY cohort_month ORDER BY period_number) AS cohort_size,
    ROUND(100.0 * customers / FIRST_VALUE(customers) OVER (PARTITION BY cohort_month ORDER BY period_number), 2) AS retention_rate
FROM cohort_periods
ORDER BY cohort_month, period_number;`,
        explanation:
          "Cohort analizi ile müşteri elde tutma oranları hesaplanır.",
        tags: ["CTE", "DATE_TRUNC", "Cohort Analysis"],
        relatedTables: ["customers", "orders"],
        schemaInfo:
          "Müşteri kayıt tarihi ve sipariş tarihleri arasındaki cohort analizi",
      },
      {
        id: 25,
        title: "Pivot Table - Aylık Satışlar",
        description:
          "Aylık satışları kategorilere göre pivot table olarak gösterin.",
        category: "Data Transformation",
        difficulty: "Zor",
        points: 75,
        hint: "CASE WHEN ile conditional aggregation yapın.",
        solution: `SELECT 
    DATE_TRUNC('month', o.order_date) AS month,
    SUM(CASE WHEN cat.name = 'Electronics' THEN oi.total_price ELSE 0 END) AS electronics_sales,
    SUM(CASE WHEN cat.name = 'Clothing' THEN oi.total_price ELSE 0 END) AS clothing_sales,
    SUM(CASE WHEN cat.name = 'Books' THEN oi.total_price ELSE 0 END) AS books_sales,
    SUM(CASE WHEN cat.name = 'Sports' THEN oi.total_price ELSE 0 END) AS sports_sales,
    SUM(oi.total_price) AS total_sales
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN categories cat ON p.category_id = cat.id
GROUP BY DATE_TRUNC('month', o.order_date)
ORDER BY month;`,
        explanation:
          "CASE WHEN ile conditional aggregation yaparak pivot table oluşturulur.",
        tags: ["CASE WHEN", "Pivot", "DATE_TRUNC"],
        relatedTables: ["orders", "order_items", "products", "categories"],
        schemaInfo:
          "4 tablo ilişkisi: orders → order_items → products → categories",
      },
      {
        id: 26,
        title: "Recursive CTE - Kategori Hiyerarşisi",
        description:
          "Kategori hiyerarşisini recursive CTE ile gösterin (eğer parent-child ilişkisi varsa).",
        category: "Recursive Queries",
        difficulty: "Zor",
        points: 90,
        hint: "WITH RECURSIVE kullanarak hiyerarşik yapıyı gezin.",
        solution: `-- Bu örnek parent_id kolonu olduğunu varsayar
WITH RECURSIVE category_hierarchy AS (
    -- Base case: Root kategoriler
    SELECT id, name, parent_id, 1 as level, name as path
    FROM categories 
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: Alt kategoriler
    SELECT c.id, c.name, c.parent_id, ch.level + 1, ch.path || ' > ' || c.name
    FROM categories c
    JOIN category_hierarchy ch ON c.parent_id = ch.id
)
SELECT * FROM category_hierarchy ORDER BY path;`,
        explanation:
          "Recursive CTE ile kategorilerin hiyerarşik yapısı gezilir.",
        tags: ["Recursive CTE", "Hierarchy", "WITH RECURSIVE"],
        relatedTables: ["categories"],
        schemaInfo:
          "categories tablosu: parent_id ile self-referencing ilişki (bu örnekte varsayılan)",
      },
    ],
  };

  const levelConfig = {
    easy: {
      color: "emerald",
      icon: BookOpen,
      label: "Kolay",
      description: "Temel SQL öğrenin",
    },
    medium: {
      color: "blue",
      icon: Target,
      label: "Orta",
      description: "JOIN ve analiz yapın",
    },
    hard: {
      color: "purple",
      icon: Trophy,
      label: "Zor",
      description: "İleri seviye teknikler",
    },
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };
  const groupedQuestions = [
    ...questions[selectedLevel],
    ...customQuestions.filter((q) => q.difficulty === selectedLevel),
  ].reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {});

  const handleAddQuestion = (newQuestion) => {
    setCustomQuestions((prev) => [...prev, newQuestion]);

    // Save to localStorage
    const existingQuestions = JSON.parse(
      localStorage.getItem("customSQLQuestions") || "[]"
    );
    localStorage.setItem(
      "customSQLQuestions",
      JSON.stringify([...existingQuestions, newQuestion])
    );
  };

  // Load custom questions from localStorage on mount
  useEffect(() => {
    const savedQuestions = JSON.parse(
      localStorage.getItem("customSQLQuestions") || "[]"
    );
    setCustomQuestions(savedQuestions);
  }, []);

  const handleAnswerCheck = () => {
    if (!selectedQuestion || !userAnswer.trim()) return;

    const normalizedUserAnswer = userAnswer
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    const normalizedSolution = selectedQuestion.solution
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    // Basit karşılaştırma - gerçek uygulamada daha gelişmiş bir kontrol yapılabilir
    if (
      normalizedUserAnswer.includes(normalizedSolution.split(" ")[0]) &&
      normalizedUserAnswer.includes(normalizedSolution.split(" ")[1])
    ) {
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("incorrect");
    }
  };

  const runQuery = () => {
    if (selectedQuestion && onQuerySelect) {
      onQuerySelect(selectedQuestion.solution);
    }
  };

  const tryQuery = () => {
    if (userAnswer.trim() && onQuerySelect) {
      onQuerySelect(userAnswer);
    }
  };

  return (
    <div className="space-y-8">
      {/* Level Selector */}
      <div className="bg-gray-800/90 rounded-2xl p-6 border border-gray-700/50">
        {" "}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-400" />
            SQL Öğrenme Merkezi
          </h2>

          <button
            onClick={() => setShowQuestionCreator(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Yeni Soru Ekle
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(levelConfig).map(([level, config]) => {
            const Icon = config.icon;
            const isSelected = selectedLevel === level;

            return (
              <button
                key={level}
                onClick={() => {
                  setSelectedLevel(level);
                  setSelectedQuestion(null);
                  setShowHint(false);
                  setShowSolution(false);
                  setAnswerStatus(null);
                  setUserAnswer("");
                }}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? `bg-${config.color}-600/30 border-${config.color}-500/50 text-${config.color}-200`
                    : "bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50"
                }`}
              >
                <Icon className="h-8 w-8 mx-auto mb-2" />
                <div className="text-lg font-bold">{config.label}</div>
                <div className="text-sm opacity-80">{config.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-gray-800/90 rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 bg-gray-700/50 border-b border-gray-600/50">
          <h3 className="text-xl font-bold text-white">
            {levelConfig[selectedLevel].label} Seviye Sorular
          </h3>
        </div>

        <div className="p-6 space-y-4">
          {Object.entries(groupedQuestions).map(
            ([category, categoryQuestions]) => (
              <div
                key={category}
                className="border border-gray-600/30 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-4 py-3 bg-gray-700/30 hover:bg-gray-600/30 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-white">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {categoryQuestions.length} soru
                    </span>
                    {expandedCategories[category] ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedCategories[category] && (
                  <div className="p-4 space-y-3">
                    {categoryQuestions.map((question) => (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                          selectedQuestion?.id === question.id
                            ? "bg-blue-600/20 border-blue-500/50"
                            : "bg-gray-700/30 border-gray-600/30 hover:border-gray-500/50"
                        }`}
                        onClick={() => {
                          setSelectedQuestion(question);
                          setShowHint(false);
                          setShowSolution(false);
                          setAnswerStatus(null);
                          setUserAnswer("");
                        }}
                      >
                        {" "}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-white">
                                {question.title}
                              </h4>
                              {question.isCustom && (
                                <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                  Özel
                                </span>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm mb-2">
                              {question.description}
                            </p>
                            <div className="flex items-center gap-2">
                              {question.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-600/50 text-xs rounded-full text-gray-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {question.points}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Selected Question Detail */}
      {selectedQuestion && (
        <div className="bg-gray-800/90 rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="px-6 py-4 bg-gray-700/50 border-b border-gray-600/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {selectedQuestion.title}
              </h3>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="h-5 w-5" />
                <span className="font-bold">
                  {selectedQuestion.points} puan
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Question Description */}
            <div className="bg-blue-600/10 p-4 rounded-lg border border-blue-500/20">
              <p className="text-blue-200">{selectedQuestion.description}</p>
            </div>
            {/* Answer Input */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Çözümünüz:
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="SQL sorgunuzu buraya yazın..."
                className="w-full h-32 bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 text-gray-200 font-mono text-sm focus:border-blue-500/50 focus:outline-none"
              />
            </div>
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={tryQuery}
                disabled={!userAnswer.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4" />
                Sorguyu Çalıştır
              </button>
              <button
                onClick={handleAnswerCheck}
                disabled={!userAnswer.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4" />
                Cevabı Kontrol Et
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600/80 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                {showHint ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                İpucu
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                {showSolution ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                Çözümü Göster
              </button>{" "}
              <button
                onClick={runQuery}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                <Play className="h-4 w-4" />
                Doğru Cevabı Çalıştır
              </button>
              {/* Schema Button */}
              {selectedQuestion.relatedTables && (
                <button
                  onClick={() => setShowSchemaModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Database className="h-4 w-4" />
                  Tablo Şemasını Göster
                </button>
              )}
            </div>
            {/* Answer Status */}
            {answerStatus && (
              <div
                className={`p-4 rounded-lg border ${
                  answerStatus === "correct"
                    ? "bg-green-600/20 border-green-500/50 text-green-200"
                    : "bg-red-600/20 border-red-500/50 text-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {answerStatus === "correct" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span className="font-semibold">
                    {answerStatus === "correct"
                      ? "Tebrikler! Doğru cevap!"
                      : "Tekrar deneyin!"}
                  </span>
                </div>
              </div>
            )}
            {/* Hint */}
            {showHint && (
              <div className="bg-yellow-600/20 p-4 rounded-lg border border-yellow-500/50">
                <div className="flex items-start gap-2 text-yellow-200">
                  <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">İpucu:</div>
                    <p>{selectedQuestion.hint}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Solution */}
            {showSolution && (
              <div className="bg-purple-600/20 p-4 rounded-lg border border-purple-500/50">
                <div className="text-purple-200">
                  <div className="font-semibold mb-2">Çözüm:</div>
                  <pre className="bg-gray-900/50 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                    <code>{selectedQuestion.solution}</code>
                  </pre>
                  <div className="mt-3">
                    <div className="font-semibold mb-1">Açıklama:</div>
                    <p className="text-sm">{selectedQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}{" "}
          </div>
        </div>
      )}

      {/* Schema Modal */}
      {showSchemaModal && selectedQuestion?.relatedTables && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/95 rounded-2xl border border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-700/50 border-b border-gray-600/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-400" />
                Tablo Şeması Bilgileri
              </h3>{" "}
              <button
                onClick={() => setShowSchemaModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Question Schema Info */}
              {selectedQuestion.schemaInfo && (
                <div className="mb-6 p-4 bg-blue-600/10 rounded-lg border border-blue-500/20">
                  <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Bu Soru Hakkında
                  </h4>
                  <p className="text-blue-200">{selectedQuestion.schemaInfo}</p>
                </div>
              )}

              {/* Tables Schema */}
              <div className="space-y-6">
                {selectedQuestion.relatedTables.map((tableName) => {
                  const tableSchema = databaseSchema[tableName];
                  if (!tableSchema) return null;

                  return (
                    <div
                      key={tableName}
                      className="bg-gray-700/30 rounded-xl border border-gray-600/50 overflow-hidden"
                    >
                      {/* Table Header */}
                      <div className="px-4 py-3 bg-gray-600/50 border-b border-gray-500/50">
                        <div className="flex items-center gap-3">
                          <Table className="h-5 w-5 text-green-400" />
                          <h4 className="text-lg font-bold text-white">
                            {tableSchema.name}
                          </h4>
                          <span className="text-sm text-gray-400">
                            ({tableSchema.description})
                          </span>
                        </div>
                      </div>

                      {/* Columns List */}
                      <div className="p-4">
                        <div className="space-y-3">
                          {tableSchema.columns.map((column, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {column.isPrimary && (
                                  <Key
                                    className="h-4 w-4 text-yellow-400"
                                    title="Primary Key"
                                  />
                                )}
                                {column.isForeign && (
                                  <ArrowRight
                                    className="h-4 w-4 text-blue-400"
                                    title="Foreign Key"
                                  />
                                )}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">
                                      {column.name}
                                    </span>
                                    <span className="text-xs bg-gray-600/50 px-2 py-1 rounded text-gray-300">
                                      {column.type}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-400">
                                    {column.description}
                                  </p>
                                  {column.references && (
                                    <p className="text-xs text-blue-300">
                                      → {column.references}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {column.isPrimary && (
                                  <span className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded">
                                    PK
                                  </span>
                                )}
                                {column.isForeign && (
                                  <span className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded">
                                    FK
                                  </span>
                                )}
                                {column.isUnique && (
                                  <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                                    UNIQUE
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Relationships Info */}
              {selectedQuestion.relatedTables.length > 1 && (
                <div className="mt-6 p-4 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                  <h4 className="text-indigo-300 font-semibold mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Tablo İlişkileri
                  </h4>
                  <div className="text-indigo-200 text-sm space-y-1">
                    {selectedQuestion.relatedTables.map((tableName) => {
                      const tableSchema = databaseSchema[tableName];
                      const foreignKeys =
                        tableSchema?.columns.filter((col) => col.isForeign) ||
                        [];

                      return foreignKeys.map((fk, index) => (
                        <div
                          key={`${tableName}-${index}`}
                          className="flex items-center gap-2"
                        >
                          <span className="font-mono">
                            {tableName}.{fk.name}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="font-mono">{fk.references}</span>
                        </div>
                      ));
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Question Creator Modal */}
      {showQuestionCreator && (
        <DynamicQuestionCreator
          onQuestionAdd={handleAddQuestion}
          onClose={() => setShowQuestionCreator(false)}
        />
      )}
    </div>
  );
};

export default QuestionBank;
