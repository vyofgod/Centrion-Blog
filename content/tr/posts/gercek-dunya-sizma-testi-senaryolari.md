---
title: "Gerçek Dünya Sızma Testi Senaryoları"
date: 2025-11-26T19:56:00+03:00
categories: ["Sızma Testi"]
tags: ["pentest", "red team", "osint", "web güvenliği", "sosyal mühendislik"]
author: "VyOfGod"
showToc: true
TocOpen: true
draft: false
hidemeta: false
comments: true
description: "Kurumsal ortamlarda karşılaşılan gerçekçi sızma testi senaryoları ve kullanılan teknikler."
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
UseHugoToc: true
---

# Gerçek Dünya Sızma Testi Senaryoları

Teorik bilgiler önemlidir, ancak sızma testini değerli kılan şey **gerçekçi senaryolarla** kurumun risklerini ortaya çıkarmaktır. Bu yazıda, sahada sıkça karşılaşılan ve müşterilere ciddi farkındalık kazandıran üç farklı senaryoyu adım adım inceleyeceğiz.

## Senaryo 1: OSINT ile Başlayan Web Uygulaması İhlali

1. Açık kaynak istihbaratı (OSINT) ile hedef alan adları, alt alanlar ve teknolojiler tespit edilir.
2. Eski bir alt alan altında güncellenmeyen bir uygulama bulunur.
3. Teknoloji yığını ve versiyon bilgileri üzerinden bilinen zafiyetler araştırılır.
4. Düşük karmaşıklıkta bir RCE zafiyeti kullanılarak sunucuya erişim sağlanır.
5. Erişim sonrası, aynı sunucu üzerindeki diğer uygulamalara yanal hareket denenir.

Bu senaryoda asıl amaç, görünürde "önemsiz" olan bir test ortamının nasıl üretim verisine giden kapı olabileceğini göstermektir.

## Senaryo 2: Kimlik Avı ile VPN Erişimi Ele Geçirme

1. LinkedIn ve benzeri platformlardan IT ekibinde çalışan hedefler belirlenir.
2. Kurumun kullandığı VPN veya SSO çözümü hakkında teknoloji bilgisi toplanır.
3. Gerçekçi görünen, marka kimliğine uygun bir phishing e-postası hazırlanır.
4. E-postada, parola yenileme veya acil güvenlik uyarısı temasından yararlanılır.
5. Gelen tıklamalar izlenir, girilen kimlik bilgileri kontrollü şekilde kaydedilir.
6. Elde edilen kimlik bilgileriyle VPN'e giriş denenir; başarılı olursa iç ağ keşfine geçilir.

Bu senaryo sonunda, teknik zafiyetten bağımsız olarak **kullanıcı farkındalığının** ne kadar kritik olduğu rakamlarla gösterilir.

## Senaryo 3: İç Ağda Yetki Yükseltme ve Etki Analizi

1. Varsayalım ki saldırgan bir şekilde kullanıcı makinesine erişim sağladı.
2. İlk adımda yerel kullanıcı haklarıyla çalışan bir shell elde edilir.
3. Zayıf yapılandırılmış servisler, yanlış atanan yetkiler veya eski sürücüler üzerinden yetki yükseltme denenir.
4. Alan denetleyicisine giden yol haritası çıkarılır; pass-the-hash / Kerberoasting gibi teknikler uygulanır.
5. Domain Admin hakları elde edilirse, kritik sistemlere erişim ve veri sızıntısı senaryosu çalışılır.

Bu tip bir çalışma, yönetim katmanına "bir makine ele geçirilirse neler olur?" sorusunun cevabını net şekilde verir.

## Raporlama ve Değer Üretme

Her senaryonun sonunda, sadece teknik detayları değil **iş etkisini** de anlatan bir rapor hazırlanmalıdır:

- Hangi varlıklar risk altındaydı?
- Hangi veriler sızdırılabilir durumdaydı?
- Hangi kontroller saldırıyı durduramadı?
- Hangi iyileştirmeler öncelikli?

Teknik başarı tek başına yeterli değildir; kurumun güvenlik olgunluğunu artıracak önerilerle desteklenmelidir.

## Sonuç

Gerçek dünya senaryolarına dayalı sızma testleri, hem teknik ekipler hem de yönetim için güçlü bir farkındalık aracıdır. Doğru planlandığında, tek bir tatbikat bile şirketin yatırım önceliklerini tamamen değiştirebilir.
