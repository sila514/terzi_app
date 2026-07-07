# 🧵 Terzi Uygulaması

Küçük ve orta ölçekli terzi atölyelerine özel geliştirilmiş bir iş takip ve muhasebe uygulamasıdır.

Terziler günlük işlerini, müşterilerini, siparişlerini ve ödemelerini tek bir yerden kolayca yönetebilir.
Randevu defteri, ölçü kartı, sipariş takibi ve muhasebe — hepsi bir arada.

---

## 🎯 Ne İşe Yarıyor?

Bir terzi atölyesinde her gün onlarca şey oluyor:
- Yeni müşteri geliyor, ölçüsü alınıyor
- Sipariş veriliyor, teslim tarihi belirleniyor
- İş kesimden dikişe, dikişten denemeye geçiyor
- Ödeme alınıyor ama bazen eksik kalıyor
- Kira, kumaş, fatura gibi giderler oluyor

Bu uygulama tüm bunları dijital ortama taşıyor.
Terzi sabah uygulamayı açıyor, o gün teslim etmesi gerekenleri görüyor,
müşteri gelince ölçülerine bakıyor, ödeme alınca sisteme işliyor.

---

## 👥 Ekip ve Katkılar

### 🔧 Sıla — Backend Lead
Projenin teknik altyapısını kurdu.
- Node.js, TypeScript, Express kurulumu
- PostgreSQL veritabanı tasarımı (Supabase)
- Tüm tabloların oluşturulması ve migration
- Kullanıcı giriş/çıkış sistemi (JWT ile güvenli auth)
- GitHub repository kurulumu ve ekip davetleri

### 🔧 Meryem — Backend Developer
Muhasebe ve gider modülünü geliştirdi.
- Gider ekleme, listeleme, güncelleme, silme endpointleri
- Aylık gelir/gider özet raporu
- Ekip için env.example şablonu
- Proje dokümantasyonu (README)

### 🎨 Hümeyra — Frontend Developer
Kullanıcı arayüzünü geliştiriyor.
- React + Vite + Tailwind CSS kurulumu
- Tüm sayfa tasarımları ve bileşenler
- API bağlantıları (Axios)
- Kullanıcı deneyimi ve arayüz akışı

---

| Sayfa | Açıklama |
|-------|----------|
| 🏠 Dashboard | Bugün teslim edilecekler, aktif işler, bildirimler |
| 👤 Müşteri & Sipariş | Müşteri arama, ölçüler, kalem kalem iş listesi, borç durumu |
| 👥 Çalışan Yönetimi | Çalışan kartları, sipariş atama |
| 💰 Muhasebe & Rapor | Gelir/gider grafiği, nakit akışı, ödenmemiş borçlar |
| 📅 Randevu Sistemi | Haftalık takvim, günlük randevu listesi |
| 🖼 Sipariş Galerisi | Sipariş başına fotoğraflar |
| ⚙️ Genel Ayarlar | Profil, işletme bilgileri, bildirim tercihleri |

## 🚀 Kurulum

### 1. Projeyi klonla
```bash
git clone https://github.com/sila514/terzi_app.git
cd terzi_app
```

### 2. Paketleri yükle
```bash
npm install
```

### 3. Ortam değişkenlerini ayarla
```bash
cp .env.example .env
```
`.env` dosyasını aç, Sıla'dan aldığın DATABASE_URL ve JWT_SECRET bilgilerini gir.

### 4. Projeyi başlat
```bash
npm run dev
```
✅ Sunucu http://localhost:3000 adresinde çalışıyor.

---

## 🛠️ Kullanılan Teknolojiler

### Backend
- **Node.js + TypeScript** — Sunucu dili
- **Express.js** — API framework
- **Prisma ORM** — Veritabanı yönetimi
- **PostgreSQL / Supabase** — Bulut veritabanı
- **JWT** — Güvenli kullanıcı girişi

### Frontend
- **React + Vite** — Kullanıcı arayüzü
- **Tailwind CSS** — Tasarım
- **Axios** — API istekleri

---

## 📡 API Endpointleri

### 🔐 Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | /api/auth/register | Kayıt ol |
| POST | /api/auth/login | Giriş yap |
| GET | /api/auth/me | Kullanıcı bilgisi |

### 💸 Giderler
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/expenses | Tüm giderleri listele |
| POST | /api/expenses | Yeni gider ekle |
| PUT | /api/expenses/:id | Gider güncelle |
| DELETE | /api/expenses/:id | Gider sil |
| GET | /api/expenses/summary | Aylık gelir/gider özeti |

---

