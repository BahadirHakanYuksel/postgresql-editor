# PostgreSQL Playground

PostgreSQL ile deneyim yapabileceğiniz, tablolar oluşturup ilişkilendirebileceğiniz ve SQL işlemlerini hem yazıp hem gözlemleyebileceğiniz etkileşimli web uygulaması.

## Özellikler

- 🔍 **SQL Editörü**: Syntax highlighting ile SQL sorguları yazın
- 📊 **Tablo Yönetimi**: Kolayca tablo oluşturun ve silin
- 📋 **Veri Görüntüleme**: Sorgu sonuçlarını tablo formatında görün
- 🔗 **İlişki Kurma**: Tablolar arasında foreign key ilişkileri oluşturun
- 📝 **Örnek Sorgular**: Hazır SQL örnekleriyle hızla başlayın
- 🎯 **Eğitim Odaklı**: SQL öğrenmek isteyenler için ideal

## Teknolojiler

- **Next.js 15** - React tabanlı web framework
- **Tailwind CSS** - Modern CSS framework
- **CodeMirror** - SQL syntax highlighting
- **Lucide React** - Modern ikonlar
- **JavaScript** - Programlama dili

## Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Kullanım

### SQL Sorguları

- SQL editöründe sorgularınızı yazın
- "Çalıştır" butonuna tıklayarak sorguları çalıştırın
- Sonuçları tablo formatında görüntüleyin

### Tablo Yönetimi

- "Tablo Yönetimi" sekmesine gidin
- "Yeni Tablo" butonuyla yeni tablolar oluşturun
- Sütun türlerini, primary key ve not null kısıtlamalarını belirleyin
- Mevcut tabloları görüntüleyin ve silin

### Örnek Sorgular

- Hazır örnek sorgularla hızlıca başlayın
- SELECT, INSERT, JOIN işlemlerini deneyin
- Tablolar listesinden hızla SELECT sorguları oluşturun

## Örnek Tablolar

Uygulama varsayılan olarak şu tablolarla gelir:

- **users**: Kullanıcı bilgileri (id, name, email, age)
- **posts**: Blog yazıları (id, user_id, title, content)

## Desteklenen SQL Komutları

- `SELECT` - Veri sorgulama
- `INSERT` - Veri ekleme
- `UPDATE` - Veri güncelleme (simüle edilmiş)
- `DELETE` - Veri silme (simüle edilmiş)
- `CREATE TABLE` - Tablo oluşturma
- `DROP TABLE` - Tablo silme

## Geliştirme

Bu proje eğitim amaçlıdır ve gerçek PostgreSQL veritabanı yerine bellek içi simülasyon kullanır. Gerçek PostgreSQL bağlantısı için `lib/database.js` dosyasını güncellemeniz gerekir.

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
