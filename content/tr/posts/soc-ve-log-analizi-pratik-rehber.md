---
title: "SOC ve Log Analizi İçin Pratik Rehber"
date: 2025-11-26T20:00:00+03:00
categories: ["Blue Team"]
tags: ["soc", "siem", "log analizi", "olay müdahalesi", "mavi takım"]
author: "VyOfGod"
showToc: true
TocOpen: true
draft: false
hidemeta: false
comments: true
description: "Gerçek dünyada SOC analistlerinin log analizinde takip etmesi gereken adımlar ve pratik ipuçları."
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
UseHugoToc: true
---

# SOC ve Log Analizi İçin Pratik Rehber

Günümüzde neredeyse her sistem log üretiyor, ancak bu loglar doğru toplanıp analiz edilmediğinde **hiçbir anlam ifade etmiyor**. Bu yazıda, bir Güvenlik Operasyon Merkezi'nde (SOC) log analizinin nasıl yapılması gerektiğini pratik açıdan ele alıyoruz.

## 1. Toplanmayan Log Analiz Edilemez

- Hangi sistemlerden log topluyorsunuz?
- Loglar tek bir merkezde (SIEM, log sunucusu) konsolide mi?
- Zaman senkronizasyonu (NTP) düzgün mü çalışıyor?

Logların kaynağı, formatı ve zaman damgası net değilse, olay analizi sırasında korelasyon yapmak neredeyse imkânsız hale gelir.

## 2. Temel Log Kaynakları

- Kimlik yönetim sistemleri (AD, LDAP)
- Güvenlik duvarları ve IDS/IPS
- VPN ve uzak erişim çözümleri
- Web uygulama firewall (WAF)
- Kritik sunucular ve veritabanları

Bu kaynaklar, bir saldırının yaşam döngüsünü uçtan uca takip etmenizi sağlar.

## 3. SIEM Kuralları ve Gürültü Yönetimi

Her alarm değerli değildir. Gürültüyü kesmek için:

- Önce en kritik use-case'leri tanımlayın (yetkisiz oturum açma, başarısız admin denemeleri vb.)
- Basit korelasyon kurallarıyla başlayın, zamanla zenginleştirin
- Yanlış pozitifleri azaltmak için whitelisting ve eşik değerleri kullanın

Amaç, analistin ekranına gelen her alarmla gerçekten ilgilenilebilir bir sinyal getirmektir.

## 4. Olay Müdahale Akışı

Bir alarm geldiğinde:

1. **Doğrulama**: Loglar gerçekten şüpheli bir aktiviteyi mi gösteriyor?
2. **Kapsam Analizi**: Aynı IP/kullanıcı başka nerelerde loglarda görünüyor?
3. **İçerik Analizi**: Hangi sistem/uygulama etkilenmiş?
4. **Aksiyon**: İzole etme, hesabı kilitleme, kural ekleme vb.
5. **Raporlama ve Kök Neden Analizi**.

İyi bir SOC, sadece alarmları kapatmaz; tekrar oluşmasını engelleyecek önlemleri de devreye alır.

## Sonuç

Log analizi, sıkıcı görünen ama bir saldırıyı erken fark etmenin en güçlü yollarından biridir. Doğru toplanmış, normalize edilmiş ve korele edilmiş loglar; elinizdeki en değerli istihbarat kaynağıdır.
