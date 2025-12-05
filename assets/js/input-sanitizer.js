/**
 * Input Sanitizer - XSS ve SQL Injection Koruması
 * Centrion Blog için güvenlik katmanı
 */

(function() {
    'use strict';

    // Tehlikeli karakterler ve pattern'ler
    const DANGEROUS_CHARS = [
        '+', '%', '/', "'", '"', '<', '>', '\\', ';', 
        '&', '|', '`', '$', '(', ')', '{', '}', '[', ']',
        '=', '--', '/*', '*/', 'script', 'javascript:', 
        'onerror', 'onload', 'onclick'
    ];

    // SQL injection pattern'leri
    const SQL_PATTERNS = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|WHERE)\b)/gi,
        /(--|\/\*|\*\/|;|'|"|xp_)/gi,
        /(\bOR\b.*=.*|1=1|' OR ')/gi
    ];

    // XSS pattern'leri
    const XSS_PATTERNS = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<img[^>]+src[^>]*>/gi,
        /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
        /<embed\b[^>]*>/gi
    ];

    /**
     * String'i sanitize et - tehlikeli karakterleri temizle
     */
    function sanitizeInput(input) {
        if (!input || typeof input !== 'string') return '';

        let sanitized = input;

        // SQL injection pattern'lerini kontrol et
        SQL_PATTERNS.forEach(pattern => {
            if (pattern.test(sanitized)) {
                console.warn('🔒 Potansiyel SQL injection girişimi engellendi');
                sanitized = sanitized.replace(pattern, '');
            }
        });

        // XSS pattern'lerini kontrol et
        XSS_PATTERNS.forEach(pattern => {
            if (pattern.test(sanitized)) {
                console.warn('🔒 Potansiyel XSS girişimi engellendi');
                sanitized = sanitized.replace(pattern, '');
            }
        });

        // Tehlikeli karakterleri encode et
        sanitized = sanitized
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .replace(/\\/g, '&#x5C;')
            .replace(/%/g, '&#37;')
            .replace(/\+/g, '&#43;')
            .replace(/&/g, '&amp;')
            .replace(/=/g, '&#61;')
            .replace(/`/g, '&#96;')
            .replace(/\|/g, '&#124;')
            .replace(/;/g, '&#59;');

        return sanitized;
    }

    /**
     * Input alanını güvenli hale getir
     */
    function secureInput(element) {
        if (!element) return;

        // Input değiştiğinde sanitize et
        element.addEventListener('input', function(e) {
            const original = e.target.value;
            const sanitized = sanitizeInput(original);
            
            if (original !== sanitized) {
                e.target.value = sanitized;
                showWarning(e.target);
            }
        });

        // Paste event'i yakala
        element.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const sanitized = sanitizeInput(paste);
            
            if (paste !== sanitized) {
                showWarning(e.target);
            }
            
            document.execCommand('insertText', false, sanitized);
        });

        // Form submit'te son kontrol
        const form = element.closest('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                const inputs = form.querySelectorAll('input[type="text"], input[type="search"], textarea');
                inputs.forEach(input => {
                    input.value = sanitizeInput(input.value);
                });
            });
        }
    }

    /**
     * Güvenlik uyarısı göster
     */
    function showWarning(element) {
        // Uyarı zaten varsa gösterme
        if (element.parentElement.querySelector('.security-warning')) return;

        const warning = document.createElement('div');
        warning.className = 'security-warning';
        warning.style.cssText = `
            position: absolute;
            top: -30px;
            left: 0;
            background: #ff4444;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            animation: fadeInOut 3s ease-in-out;
            z-index: 1000;
        `;
        warning.textContent = '⚠️ Güvensiz karakterler temizlendi';
        
        element.parentElement.style.position = 'relative';
        element.parentElement.appendChild(warning);

        setTimeout(() => {
            warning.remove();
        }, 3000);
    }

    /**
     * Sayfa yüklendiğinde tüm input'ları güvenli hale getir
     */
    function initSecurity() {
        // Arama input'u
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            secureInput(searchInput);
        }

        // Diğer tüm text input'lar
        const textInputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
        textInputs.forEach(input => {
            secureInput(input);
        });

        // Dinamik olarak eklenen input'lar için observer
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches('input[type="text"], input[type="search"], textarea')) {
                            secureInput(node);
                        }
                        // Alt elementleri de kontrol et
                        const inputs = node.querySelectorAll('input[type="text"], input[type="search"], textarea');
                        inputs.forEach(input => secureInput(input));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('🔒 Input sanitizer aktif - XSS/SQL Injection koruması etkin');
    }

    // CSS animasyon ekle
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Sayfa yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

    // Global API (gerekirse manuel kullanım için)
    window.CentrionSecurity = {
        sanitize: sanitizeInput,
        version: '1.0.0'
    };

})();
