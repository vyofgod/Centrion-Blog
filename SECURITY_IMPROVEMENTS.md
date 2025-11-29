# 🛡️ Centrion Blog - Güvenlik İyileştirmeleri

Bu dokümanda blogunuza eklenen güvenlik önlemlerini bulabilirsiniz.

## ✅ Eklenen Güvenlik Katmanları

### 1. 🔒 HTTP Güvenlik Başlıkları (`static/_headers`)

**Content Security Policy (CSP)**
- XSS saldırılarına karşı koruma
- Sadece güvenilir kaynaklardan script yüklenmesine izin verir
- Inline script'leri kontrollü olarak sınırlandırır

**X-Frame-Options: DENY**
- Clickjacking saldırılarını önler
- Sitenizin iframe içinde gösterilmesini engeller

**X-Content-Type-Options: nosniff**
- MIME type sniffing saldırılarını önler
- Tarayıcıların içerik tipini yanlış yorumlamasını engeller

**X-XSS-Protection**
- Tarayıcı tabanlı XSS filtresini aktif eder
- Legacy browser desteği için

**Strict-Transport-Security (HSTS)**
- HTTPS kullanımını zorlar
- 2 yıl süreyle HTTPS bağlantısını zorunlu kılar
- Alt domainleri de kapsar

**Referrer-Policy**
- Kullanıcı gizliliğini korur
- Hassas URL parametrelerinin sızmasını önler

**Permissions-Policy**
- Gereksiz browser özelliklerini kapatır
- Kamera, mikrofon, konum gibi API'lere erişimi kısıtlar

### 2. 📋 Netlify Yapılandırması (`netlify.toml`)

**Otomatik HTTPS Yönlendirme**
- HTTP → HTTPS yönlendirmesi
- www subdomain'i kaldırma

**Önbellekleme Stratejisi**
- Static dosyalar: 1 yıl cache
- HTML dosyalar: No cache (her zaman güncel)

**DDoS Koruması**
- Netlify'ın built-in DDoS koruması
- Otomatik rate limiting

### 3. 📄 Security.txt (`static/.well-known/security.txt`)

**RFC 9116 Standardı**
- Güvenlik araştırmacıları için iletişim bilgileri
- Sorumlu açıklama (responsible disclosure) politikası
- Güvenlik açığı bildirimi için standart format

### 4. 🤖 Robots.txt (`static/robots.txt`)

**Bot Kontrolü**
- Kötü niyetli botları engeller
- Hassas dizinleri crawler'lardan gizler
- SEO için sitemap tanımı

### 5. ⚙️ Hugo Güvenlik Ayarları (`hugo.yaml`)

**Exec Kontrolü**
- Çalıştırılabilecek komutları kısıtlar
- Sadece güvenli environment variables'a erişim

**Privacy Ayarları**
- Google Analytics IP anonimizasyonu
- Do Not Track (DNT) desteği
- YouTube privacy-enhanced mode

### 6. 🔍 Güvenlik Kontrol Script'i (`scripts/security-check.sh`)

**Otomatik Güvenlik Kontrolü**
- Hassas dosyaların Git'e eklenmediğini kontrol eder
- Güvenlik başlıklarını doğrular
- Hardcoded secret'ları tarar
- Deploy öncesi otomatik kontrol

### 7. 📝 Güvenlik Politikası (`SECURITY.md`)

**Responsible Disclosure**
- Güvenlik açığı bildirimi süreci
- Yanıt süreleri ve SLA'lar
- Hall of Fame - Güvenlik araştırmacılarını tanıma

## 🚀 Kullanım Talimatları

### Deploy Öncesi Güvenlik Kontrolü

```bash
# Güvenlik kontrolünü çalıştır
./scripts/security-check.sh

# Eğer hata varsa, deploy etmeyin!
# Uyarıları gözden geçirin
```

### Manuel Güvenlik Testleri

```bash
# 1. Security headers test et
curl -I https://centrion.blog | grep -i "security\|content-security\|x-frame"

# 2. SSL/TLS test et
curl -I https://centrion.blog | grep -i "strict-transport"

# 3. security.txt kontrol et
curl https://centrion.blog/.well-known/security.txt
```

### Online Güvenlik Taramaları

Sitenizi bu araçlarla periyodik olarak test edin:

1. **Mozilla Observatory**: https://observatory.mozilla.org
   - Security headers analizi
   - TLS/SSL kontrol

2. **SecurityHeaders.com**: https://securityheaders.com
   - HTTP header scoring
   - Best practice kontrol

3. **SSL Labs**: https://www.ssllabs.com/ssltest/
   - TLS/SSL yapılandırması
   - Certificate kontrol

4. **CSP Evaluator**: https://csp-evaluator.withgoogle.com
   - Content Security Policy analizi
   - CSP bypass kontrolü

## 📊 Güvenlik Metrikleri

### Hedef Skorlar

- **Mozilla Observatory**: A+ (90+)
- **SecurityHeaders.com**: A+
- **SSL Labs**: A+
- **CSP Evaluator**: No high-severity issues

### Mevcut Korumalar

✅ XSS Protection  
✅ Clickjacking Protection  
✅ MIME Sniffing Protection  
✅ HTTPS Enforcement  
✅ Secure Cookies (when used)  
✅ CSP Policy  
✅ Referrer Policy  
✅ Permission Policy  

## 🔄 Düzenli Bakım

### Haftalık

- [ ] Giscus güvenlik güncellemelerini kontrol et
- [ ] Hugo yeni versiyonunu kontrol et

### Aylık

- [ ] Security headers test et (Mozilla Observatory)
- [ ] Dependencies'i güncelle
- [ ] security.txt expiry date'i kontrol et

### 3 Aylık

- [ ] Kapsamlı güvenlik audit
- [ ] Penetrasyon testi (opsiyonel)
- [ ] SECURITY.md'yi güncelle

## 🐛 Bilinen Sınırlamalar

### Giscus Güvenlik Açığı

**Durum**: Giscus, Next.js 12.3.4 kullanıyor (CVE-2025-29927)  
**Risk**: Medium - Authorization bypass potansiyeli  
**Etki**: Yorum sisteminde  
**Çözüm**: 
- Giscus'un güncellemesini bekle
- Veya alternatif yorum sistemi (Utterances) kullan

**Geçici Koruma**:
- CSP, Giscus'u strict şekilde sınırlandırıyor
- Kullanıcı verileri GitHub'da saklanıyor
- İçerik injection riski minimal

## 🎯 Gelecek İyileştirmeler

- [ ] Rate limiting (Cloudflare ile)
- [ ] Bot detection (hCaptcha veya Turnstile)
- [ ] Automatic security scanning (GitHub Actions)
- [ ] Vulnerability monitoring (Dependabot)
- [ ] WAF (Web Application Firewall) - Cloudflare
- [ ] DDoS mitigation - advanced rules

## 📚 Kaynaklar

- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Mozilla Web Security](https://infosec.mozilla.org/guidelines/web_security)
- [CSP Guide](https://content-security-policy.com/)
- [RFC 9116 - security.txt](https://www.rfc-editor.org/rfc/rfc9116.html)

---

**Son güncelleme**: 13 Kasım 2025  
**Versiyon**: 1.0  
**Hazırlayan**: VyOfGod
