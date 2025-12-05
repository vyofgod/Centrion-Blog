---
title: "Sızma Testi Temelleri"
date: 2025-11-09T00:21:00+03:00
tags: ["sızma testi", "pentest", "etik hacking", "siber güvenlik"]
author: "You"
showToc: true
TocOpen: true
draft: false
hidemeta: false
comments: true
description: "Sızma testi (pentest) temelleri, metodolojileri ve araçları hakkında kapsamlı rehber."
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
UseHugoToc: true
---

# Sızma Testi Temelleri

Sızma testi (pentest), yetkilendirilmiş kişiler tarafından bir bilgi sistemindeki güvenlik açıklarını tespit etmek ve değerlendirmek için gerçekleştirilen planlı saldırı simülasyonudur. Bu yazıda, sızma testi sürecinin temel adımlarını, kullanılan yöntemleri ve popüler araçları inceleyeceğiz.

## 1. Sızma Testi Nedir?

### Tanım ve Amaç
- Güvenlik açıklarını tespit etmek
- Açıkların etkisini değerlendirmek
- Güvenlik önlemlerinin etkinliğini test etmek
- Uyumluluk gereksinimlerini karşılamak

### Sızma Testi Türleri

#### Kapsama Göre
- **Kara Kutu Testi**: Sistem hakkında ön bilgi olmadan yapılan testler
- **Beyaz Kutu Testi**: Sistem hakkında tam bilgi ile yapılan testler
- **Gri Kutu Testi**: Sınırlı bilgi ile yapılan testler

#### Erişim Düzeyine Göre
- Dış ağ testleri
- İç ağ testleri
- Kablosuz ağ testleri
- Fiziksel güvenlik testleri
- Sosyal mühendislik testleri
- Web uygulama testleri

## 2. Sızma Testi Aşamaları

### 1. Planlama ve Keşif
- **Hedef Belirleme**: Test kapsamı ve kurallarının tanımlanması
- **Bilgi Toplama (OSINT)**: Açık kaynaklardan bilgi derleme
- **Aktif Keşif**: Port tarama, servis tespiti

### 2. Tarama ve Zafiyet Analizi
- Port taraması (Nmap)
- Servis ve sürüm tespiti
- Zafiyet taraması (Nessus, OpenVAS)

### 3. Sömürü (Exploitation)
- Zafiyetlerin istismarı
- Yetki yükseltme
- Yatay/dikey hareket

### 4. Erişimi Sürdürme
- Kalıcı erişim sağlama
- Veri sızdırma
- İzleri silme

### 5. Raporlama
- Bulguların dokümantasyonu
- Risk değerlendirmesi
- İyileştirme önerileri

## 3. Temel Sızma Testi Araçları

### Bilgi Toplama
- **Nmap**: Ağ keşfi ve güvenlik denetimi
- **Recon-ng**: Bilgi toplama çerçevesi
- **theHarvester**: E-posta, alan adı, IP toplama

### Zafiyet Taraması
- **Nessus**: Ticari zafiyet tarayıcısı
- **OpenVAS**: Açık kaynak zafiyet tarayıcısı
- **Nikto**: Web sunucusu tarayıcısı

### Sömürü Çerçeveleri
- **Metasploit Framework**: Sızma testi platformu
- **Burp Suite**: Web uygulama güvenlik testi aracı
- **OWASP ZAP**: Web uygulama güvenlik tarayıcısı

### Parola Kırma
- **John the Ripper**: Parola kırma aracı
- **Hashcat**: Gelişmiş parola kırma
- **Hydra**: Ağ servisleri için parola kırma

### Kablosuz Ağ Testleri
- **Aircrack-ng**: Kablosuz ağ güvenlik aracı
- **Wireshark**: Ağ protokol analizörü
- **Kismet**: Kablosuz ağ tespit aracı

## 4. Hukuki ve Etik Boyut

### Hukuki Düzenlemeler
- **Türkiye**: 5651 sayılı Kanun, KVKK
- **ABD**: Computer Fraud and Abuse Act (CFAA)
- **AB**: General Data Protection Regulation (GDPR)

### Etik Kurallar
- Yazılı izin olmadan test yapılmamalıdır
- Test kapsamı önceden belirlenmelidir
- Bulgular gizli tutulmalıdır
- Test sonrası sistemler eski haline getirilmelidir

## 5. Sızma Testi Sertifikaları

### Başlangıç Seviyesi
- **eJPT (eLearnSecurity Junior Penetration Tester)**
- **CompTIA Security+**
- **CEH (Certified Ethical Hacker)**

### Orta Seviye
- **OSCP (Offensive Security Certified Professional)**
- **eCPPT (eLearnSecurity Certified Professional Penetration Tester)**
- **GPEN (GIAC Penetration Tester)**

### İleri Seviye
- **OSCE (Offensive Security Certified Expert)**
- **OSEE (Offensive Security Exploitation Expert)**
- **GXPN (GIAC Exploit Researcher and Advanced Penetration Tester)**

## 6. Sızma Testi Raporlaması

### Rapor İçeriği
- Yapılan testler
- Tespit edilen zafiyetler
- Risk seviyeleri
- Kanıtlar (ekran görüntüleri, loglar)
- İyileştirme önerileri

### Önemli Noktalar
- Açık ve anlaşılır bir dil kullanın
- Teknik detayları açıklayın
- Öncelik sıralaması yapın
- Yönetici özeti ekleyin

## 7. Sızma Testi Zorlukları

### Teknik Zorluklar
- Yeni ortaya çıkan zafiyetler
- Sıfır gün açıkları
- Karmaşık ağ yapıları

### İdari Zorluklar
- Test süresinin yönetimi
- Ekip koordinasyonu
- Müşteri beklentilerinin yönetimi

## 8. Sızma Testi ve Red Team Tatbikatları

### Farklar
- **Sızma Testi**: Belirli sistemlerin test edilmesi
- **Red Team**: Gerçek saldırı senaryosu simülasyonu

### Mavi ve Mor Takımlar
- **Mavi Takım**: Savunma ekibi
- **Mor Takım**: Kırmızı ve mavi takım arasında köprü görevi

## 9. Sızma Testi Eğitim Kaynakları

### Çevrim İçi Platformlar
- Hack The Box
- TryHackMe
- VulnHub
- PentesterLab

### Laboratuvar Ortamları
- Kali Linux
- Parrot Security OS
- BlackArch Linux

## 10. Sızma Testi Kariyer Yolları

### Kariyer Seçenekleri
- Sızma Testi Uzmanı
- Red Team Üyesi
- Güvenlik Danışmanı
- Güvenlik Araştırmacısı

### Gelişim Alanları
- Web uygulama güvenliği
- Mobil uygulama güvenliği
- IoT güvenliği
- Bulut güvenliği

## Sonuç

Sızma testi, siber güvenlik dünyasının en dinamik ve heyecan verici alanlarından biridir. Sürekli değişen tehdit ortamında, etkili sızma testleri kurumların güvenlik duruşunu güçlendirmek için kritik öneme sahiptir.

Bu alanda başarı için sürekli öğrenme, pratik yapma ve güncel kalma şarttır. Unutmayın, etik hacker olmak bir bakış açısıdır ve sorumluluk gerektirir.

Bir sonraki yazımızda "Bulut Güvenliği ve Veri Koruma" konusunu ele alacağız.
