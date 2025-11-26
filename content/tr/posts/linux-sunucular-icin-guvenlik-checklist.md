---
title: "Linux Sunucular İçin Güvenlik Checklist"
date: 2025-11-26T20:07:00+03:00
categories: ["Sistem Güvenliği"]
tags: ["linux", "hardening", "ssh", "auditd", "iptables"]
author: "VyOfGod"
showToc: true
TocOpen: true
draft: false
hidemeta: false
comments: true
description: "Üretim ortamına çıkmadan önce her Linux sunucuda kontrol edilmesi gereken pratik güvenlik checklist'i."
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
UseHugoToc: true
---

# Linux Sunucular İçin Güvenlik Checklist

Yeni kurulan bir Linux sunucuyu doğrudan internete açmak büyük risktir. Aşağıdaki checklist, özellikle üretim ortamındaki Linux sunucular için pratik bir başlangıç noktası sunar.

## 1. Kullanıcı ve SSH Güvenliği

- Root ile direkt SSH bağlantısını kapat (`PermitRootLogin no`)
- Parola ile giriş yerine anahtar tabanlı kimlik doğrulama kullan
- SSH portunu değiştirmek tek başına çözüm değildir ama gürültüyü azaltır

## 2. Paket ve Servis Yönetimi

- Kullanılmayan paketleri kaldır
- Gereksiz servisleri devre dışı bırak (telnet, ftp vb.)
- Otomatik güvenlik güncellemelerini etkinleştir

## 3. Firewall ve Ağ Kuralları

- `iptables`/`nftables` veya dağıtımın sunduğu firewall aracıyla sadece gereken portları aç
- Sunucu outbound trafiğini de kısıtlamayı düşün

## 4. Loglama ve Denetim

- `auditd` ile kritik eylemleri (sudo, dosya değişiklikleri vb.) izle
- Logları merkezi bir sunucuya veya SIEM'e gönder

## 5. Dosya Sistemi ve Yetkiler

- `sudo` kullanımını sınırlı kullanıcılarla kısıtla
- `/tmp` ve benzeri dizinler için `noexec` gibi mount seçeneklerini değerlendir

## Sonuç

Bu checklist tam bir hardening kılavuzu değildir, ancak çoğu ortamda risk seviyesini ciddi anlamda aşağı çeker. Her sunucuyu devreye almadan önce bu maddeleri gözden geçirmek iyi bir güvenlik alışkanlığıdır.
