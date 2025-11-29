---
title: "Saldırı Yüzeyi Azaltma Stratejileri"
date: 2025-11-26T19:55:00+03:00
categories: ["Savunma Mimarisi"]
tags: ["saldırı yüzeyi", "hardening", "blue team", "siber güvenlik"]
author: "VyOfGod"
showToc: true
TocOpen: true
draft: false
hidemeta: false
comments: true
description: "Kurumsal ve kişisel sistemlerde saldırı yüzeyini küçültmek için uygulanabilir, pratik stratejiler."
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
UseHugoToc: true
---

# Saldırı Yüzeyi Azaltma Stratejileri

Siber güvenlikte en temel prensiplerden biri **saldırı yüzeyini küçültmek**tir. Ne kadar az servis, port, yetki ve bileşen dışa açıksa; istismar edilebilecek nokta da o kadar az olur. Bu yazıda, gerçek dünyada uygulanabilir saldırı yüzeyi azaltma (attack surface reduction) tekniklerine odaklanacağız.

## 1. Envanter Çıkarmadan Güvenlik Olmaz

Bir ortamı korumadan önce onu tanımanız gerekir:

- Tüm sunucular, istemciler ve ağ cihazlarının listesi
- Üzerlerinde çalışan servisler, portlar ve uygulamalar
- Kimlerin hangi sistemlere eriştiği

Bu envanteri düzenli olarak otomatik araçlarla (Nmap, agent tabanlı envanter yazılımları vb.) güncellemek, saldırı yüzeyi yönetiminin ilk adımıdır.

## 2. Gereksiz Servisleri Kapatın

- Kullanılmayan RDP, SSH, FTP, Telnet gibi servisleri devre dışı bırakın
- Varsayılan olarak gelen demo uygulamaları ve örnek sayfaları kaldırın
- Sunucu rolleri net olsun: web sunucusu veritabanı, DNS veya dosya paylaşımı yapmasın

Her kapattığınız servis, potansiyel bir zafiyeti de ortadan kaldırır.

## 3. Yetki Minimizasyonu ve Ayrıcalıkların Ayrılması

- Kullanıcı ve servis hesaplarına **en az ayrıcalık** verin
- Yönetici hesaplarını günlük kullanım için kullanmayın
- Hizmet hesaplarını kişisel hesaplardan ayırın
- Kritik sistemlerde rol tabanlı erişim kontrolü (RBAC) uygulayın

Yetki ne kadar genişse, ele geçirildiğinde vereceği zarar da o kadar büyüktür.

## 4. Uygulama ve Sistem Hardening

- Güvenlik benchmark'larını (CIS, STIG vb.) referans alın
- Kernel ve servis konfigürasyonlarını sıkılaştırın
- Gereksiz modülleri ve paketleri kaldırın
- Loglama ve denetim (audit) modüllerini aktif edin

Hardening bir defalık iş değildir; her güncellemeden sonra tekrar gözden geçirilmelidir.

## 5. Ağ Segmentasyonu ve Mikro Segmentasyon

- Aynı ağda hem kullanıcı bilgisayarları hem sunucular olmamalı
- Misafirler, IoT cihazları ve kritik sistemler ayrı VLAN'larda tutulmalı
- Zero Trust yaklaşımıyla, "aynı ağda" olmayı otomatik güven anlamına gelmekten çıkarın

Mikro segmentasyon ile, saldırgan ağa sızsa bile **yatay hareket alanını** ciddi şekilde kısıtlayabilirsiniz.

## 6. Varsayılan Ayarların Tehlikesi

Birçok saldırı, değiştirilmemiş varsayılan yapılandırmalar üzerinden yapılır:

- Varsayılan şifreler
- Örnek uygulamalar
- Açık gelen yönetim panelleri

Yeni kurulan her sistem için bir **güvenlik checklist'i** oluşturun ve devreye almadan önce bu listeyi eksiksiz uygulayın.

## 7. Saldırı Yüzeyi İzleme ve Sürekli İyileştirme

- Otomatik zafiyet taramaları
- İnternet yüzü açık varlıkların düzenli test edilmesi
- "Shadow IT" tespiti için DNS ve proxy loglarının incelenmesi

Saldırı yüzeyi **statik** değildir; yeni projeler, geçici test ortamları, yanlış yapılandırılmış servisler yüzeyi sürekli büyütür. Bu yüzden süreçler otomatikleştirilmeli ve düzenli raporlanmalıdır.

## Sonuç

Saldırı yüzeyi azaltma, uçtan uca bir güvenlik programının en yüksek ROI sağlayan adımlarından biridir. Araçlardan önce, mimariyi ve süreçleri doğru tasarlamak gerekir. Gereksiz her port, servis ve yetkiyi kapatmak; gelecekte yaşayacağınız birçok olayı daha oluşmadan engellemenizi sağlar.
