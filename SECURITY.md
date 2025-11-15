# 🔒 Güvenlik Politikası

## Güvenlik Açığı Bildirimi

Centrion Blog'da bir güvenlik açığı keşfettiyseniz, lütfen sorumlu bir şekilde bildirin.

### 📧 İletişim

Güvenlik açıklarını bildirmek için:

1. **GitHub Security Advisory** (Tercih Edilen):
   - [Yeni Güvenlik Bildirimi Oluştur](https://github.com/vyofgod/Centrion-Blog/security/advisories/new)

2. **E-posta**:
   - GitHub profilimdeki e-posta adresine gönderin
   - Konu: `[SECURITY] Centrion Blog Güvenlik Açığı`

### 🔍 Bildirim İçeriği

Lütfen aşağıdaki bilgileri ekleyin:

- **Açıklama**: Güvenlik açığının detaylı açıklaması
- **Etki**: Potansiyel risk ve etki alanı
- **Adımlar**: Açığı yeniden oluşturma adımları
- **PoC**: Mümkünse proof-of-concept kodu
- **Öneriler**: Düzeltme önerileri (opsiyonel)

### ⏱️ Yanıt Süresi

- **İlk Yanıt**: 48 saat içinde
- **Durum Güncellemesi**: 7 gün içinde
- **Düzeltme**: Kritiklik seviyesine göre 7-30 gün

### 🏆 Tanınma

Güvenlik araştırmacılarını takdir ediyoruz! Sorumlu açıklama yapan araştırmacılar:

- Blog'da teşekkür sayfasında yer alır (isteğe bağlı)
- GitHub'da contributor olarak listelenir
- LinkedIn'de referans (talep edilirse)

### ⚖️ Kapsam

**Kapsam İçinde:**
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- SQL Injection
- Yetkilendirme sorunları
- Veri sızıntısı
- Güvenli olmayan dependencies
- CSP bypass

**Kapsam Dışında:**
- DDoS saldırıları
- Social engineering
- Fiziksel erişim
- Üçüncü parti servisler (Giscus, GitHub vb.)
- Rate limiting issues
- SPF/DKIM/DMARC sorunları

### 📜 Kurallar

Lütfen:
- ✅ Özel/gizli verilere erişmeyin
- ✅ Servisleri aksatmayın
- ✅ Diğer kullanıcıları etkilemeyin
- ✅ Sorumlu açıklama sürecini takip edin
- ❌ Açığı herkese açık paylaşmayın
- ❌ Otomatik tarama araçlarını agresif kullanmayın

### 🛡️ Mevcut Güvenlik Önlemleri

Centrion Blog aşağıdaki güvenlik önlemlerini kullanır:

1. **Content Security Policy (CSP)** - XSS koruması
2. **HSTS** - HTTPS zorunluluğu
3. **X-Frame-Options** - Clickjacking koruması
4. **X-Content-Type-Options** - MIME sniffing koruması
5. **Referrer Policy** - Gizlilik koruması
6. **Subresource Integrity (SRI)** - CDN güvenliği
7. **Security Headers** - Çoklu katman koruma

### 📊 Desteklenen Versiyonlar

| Versiyon | Destek Durumu |
| ------- | ------------- |
| Ana dal (main) | ✅ Aktif destek |
| Eski dallar | ❌ Destek yok |

### 🙏 Teşekkürler

Güvenliğimizi geliştirmeye yardımcı olduğunuz için teşekkür ederiz!

---

*Son güncelleme: 13 Kasım 2025*
