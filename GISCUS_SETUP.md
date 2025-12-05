# 💬 Giscus Yorum Sistemi Kurulum Rehberi

Giscus, GitHub Discussions kullanarak blog yazılarınıza yorum sistemi ekleyen ücretsiz bir hizmettir.

## 📋 Gereksinimler

1. GitHub hesabı
2. Public GitHub repository (Centrion-Blog repo'nuz)
3. Repository'de Discussions özelliği aktif olmalı

## 🚀 Kurulum Adımları

### 1. GitHub Repository'yi Hazırlayın

1. GitHub'da `vyofgod/Centrion-Blog` repository'nize gidin
2. Settings → General → Features bölümünde **Discussions** checkbox'ını işaretleyin
3. Discussions sekmesi aktif olacak

### 2. Giscus App'i Kurun

1. [https://github.com/apps/giscus](https://github.com/apps/giscus) adresine gidin
2. **Install** butonuna tıklayın
3. Repository seçimi:
   - **Only select repositories** seçin
   - `Centrion-Blog` repository'nizi seçin
4. **Install** butonuna tıklayarak onaylayın

### 3. Giscus Ayarlarını Alın

1. [https://giscus.app/tr](https://giscus.app/tr) adresine gidin
2. **Dil** olarak **Türkçe** seçin
3. **Repository** bölümünde: `vyofgod/Centrion-Blog` girin
4. Sayfa biraz bekledikten sonra yeşil onay işareti gösterecek

**Yapılandırma** bölümünde:
- **Sayfa ↔️ Tartışma Eşleme**: `pathname` seçili bırakın
- **Tartışma Kategorisi**: `General` veya istediğiniz kategoriyi seçin
- **Özellikler**: 
  - ✅ Reactions etkinleştir
  - Ana yorumun üzerine yorum formu yerleştir (önerilir)
- **Tema**: `preferred_color_scheme` (otomatik tema geçişi için)

5. **Etkinleştirme** bölümünde aşağıdaki değerleri göreceksiniz:
   ```html
   data-repo="vyofgod/Centrion-Blog"
   data-repo-id="R_xxxxx"  ← Bu değeri kopyalayın
   data-category="General"
   data-category-id="DIC_xxxxx"  ← Bu değeri kopyalayın
   ```

### 4. Hugo Yapılandırmasını Güncelleyin

`hugo.yaml` dosyasını açın ve giscus bölümünü bulun (yaklaşık 100-114. satırlar):

```yaml
giscus:
  repo: "vyofgod/Centrion-Blog"
  repoID: "R_xxxxx"  # ← Giscus.app'ten aldığınız değeri buraya yapıştırın
  category: "General"
  categoryID: "DIC_xxxxx"  # ← Giscus.app'ten aldığınız değeri buraya yapıştırın
  mapping: "pathname"
  strict: "0"
  reactionsEnabled: "1"
  emitMetadata: "0"
  inputPosition: "top"
  theme: "preferred_color_scheme"
  lang: "tr"
  loading: "lazy"
```

### 5. Siteyi Rebuild Edin

```bash
cd ~/Masaüstü/Centrion-Blog
hugo server
```

Tarayıcınızda `http://localhost:1313` adresine gidin ve herhangi bir blog yazısını açın. Sayfanın en altında yorum bölümünü görmelisiniz!

## ✨ Özellikler

- ✅ **Otomatik Tema Geçişi**: Site teması değiştiğinde yorum kutusu da otomatik güncellenir
- ✅ **Türkçe Dil Desteği**: Arayüz tamamen Türkçe
- ✅ **Reactions**: Kullanıcılar yorumlara emoji ile tepki verebilir
- ✅ **GitHub Entegrasyonu**: Yorumlar GitHub Discussions'a kaydedilir
- ✅ **Modern Tasarım**: Site tasarımıyla uyumlu özel CSS stilleri
- ✅ **Responsive**: Mobil cihazlarda mükemmel görünüm

## 🎨 Özelleştirme

Yorum kutusunun görünümünü değiştirmek için `assets/css/extended/custom.css` dosyasının **GISCUS COMMENTS SECTION** bölümünü düzenleyebilirsiniz (1198-1276. satırlar).

## 🔧 Sorun Giderme

### Yorumlar Görünmüyor
1. `hugo.yaml` dosyasında `comments: true` olduğundan emin olun
2. `repoID` ve `categoryID` değerlerinin doğru girildiğini kontrol edin
3. Repository'de Discussions özelliğinin aktif olduğunu kontrol edin
4. Giscus App'in repository'nize yüklendiğini kontrol edin

### Tema Değişmediğinde Yorum Kutusu Güncellemiyor
Tarayıcı konsolunu açın (F12) ve JavaScript hatası olup olmadığını kontrol edin.

### Yorumlar Yanlış Tartışmaya Bağlanıyor
`mapping` değerini `pathname` yerine `title` veya `og:title` olarak değiştirmeyi deneyin.

## 📚 Ek Kaynaklar

- [Giscus Resmi Dokümantasyonu](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md)
- [GitHub Discussions Rehberi](https://docs.github.com/en/discussions)

## 🎉 Tamamlandı!

Artık blogunuzda tamamen ücretsiz, modern ve güvenli bir yorum sistemi var. Kullanıcılar GitHub hesaplarıyla yorum yapabilir, yorumlara tepki verebilir ve tartışmalara katılabilir.

Sorularınız için GitHub Discussions'da bir tartışma başlatabilirsiniz! 🚀
