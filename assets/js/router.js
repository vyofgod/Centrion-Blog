// Simple Client-Side Router for Profile Pages
class ProfileRouter {
    constructor() {
        this.init();
    }

    init() {
        // Check if we're on a profile URL that doesn't exist as a static page
        const path = window.location.pathname;
        
        // Match pattern: /tr/profile/username
        const profileMatch = path.match(/^\/tr\/profile\/([^\/]+)\/?$/);
        
        if (profileMatch && profileMatch[1]) {
            const username = profileMatch[1];
            
            // If this is not the settings page, load the public profile
            if (username !== 'settings' && username !== 'index') {
                this.loadPublicProfilePage(username);
            }
        }
    }

    async loadPublicProfilePage(username) {
        try {
            // Check if user exists first
            if (!window.supabaseClient) {
                // Wait for Supabase to load
                setTimeout(() => this.loadPublicProfilePage(username), 100);
                return;
            }

            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select('username')
                .eq('username', username)
                .single();

            if (error || !data) {
                // User doesn't exist, show 404
                this.show404();
                return;
            }

            // User exists, load the public profile template
            this.loadProfileTemplate(username);
            
        } catch (error) {
            console.error('Error checking user:', error);
            this.show404();
        }
    }

    async loadProfileTemplate(username) {
        try {
            // Fetch the user-profile template
            const response = await fetch('/layouts/_default/user-profile.html');
            
            if (!response.ok) {
                // Fallback: Create the profile page dynamically
                this.createDynamicProfilePage(username);
                return;
            }
            
            const template = await response.text();
            
            // Replace the main content
            const main = document.querySelector('main');
            if (main) {
                main.innerHTML = template;
                
                // Load the public profile script
                this.loadPublicProfileScript();
            }
            
        } catch (error) {
            console.error('Error loading profile template:', error);
            this.createDynamicProfilePage(username);
        }
    }

    createDynamicProfilePage(username) {
        const main = document.querySelector('main');
        if (!main) return;

        main.innerHTML = `
            <div id="profile-loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>Profil yükleniyor...</p>
            </div>

            <div id="profile-not-found" class="error-container" style="display: none;">
                <div class="error-content">
                    <h2>Kullanıcı Bulunamadı</h2>
                    <p>Aradığınız kullanıcı profili mevcut değil.</p>
                    <a href="/tr/" class="btn-primary">Ana Sayfaya Dön</a>
                </div>
            </div>

            <div id="public-profile" class="public-profile-container" style="display: none;">
                <div class="profile-header">
                    <div class="profile-avatar-section">
                        <img id="public-avatar" src="/logo.png" alt="Profil Resmi" class="profile-avatar-large">
                    </div>
                    <div class="profile-info-section">
                        <h1 id="public-fullname" class="profile-fullname">Kullanıcı Adı</h1>
                        <p id="public-username" class="profile-username">@${username}</p>
                        <p id="public-bio" class="profile-bio">Henüz biyografi eklenmedi</p>
                        
                        <div class="profile-meta">
                            <div id="public-location" class="profile-meta-item" style="display: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span id="public-location-text">Konum</span>
                            </div>
                            
                            <div id="public-website" class="profile-meta-item" style="display: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                                <a id="public-website-link" href="#" target="_blank" rel="noopener noreferrer">
                                    <span id="public-website-text">Website</span>
                                </a>
                            </div>
                            
                            <div class="profile-meta-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <span id="public-joined-date">Katılma tarihi</span>
                            </div>
                        </div>
                        
                        <div class="profile-actions">
                            <button id="share-public-profile-btn" class="btn-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                                Profili Paylaş
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Share Modal -->
            <div id="public-share-modal" class="share-modal">
                <div class="share-modal-overlay"></div>
                <div class="share-modal-content">
                    <div class="share-modal-header">
                        <h3>Profili Paylaş</h3>
                        <button id="public-share-close" class="modal-close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="share-modal-body">
                        <div class="share-link-section">
                            <label for="public-share-link">Profil Linki</label>
                            <div class="share-link-container">
                                <input type="text" id="public-share-link" readonly>
                                <button id="public-copy-link-btn" class="btn-copy">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    Kopyala
                                </button>
                            </div>
                        </div>
                        
                        <div class="share-social-section">
                            <h4>Sosyal Medyada Paylaş</h4>
                            <div class="share-social-buttons">
                                <button id="public-share-whatsapp" class="share-btn whatsapp">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                                    </svg>
                                    WhatsApp
                                </button>
                                
                                <button id="public-share-twitter" class="share-btn twitter">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                    Twitter
                                </button>
                                
                                <button id="public-share-telegram" class="share-btn telegram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                    </svg>
                                    Telegram
                                </button>
                                
                                <button id="public-share-facebook" class="share-btn facebook">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load the public profile script
        this.loadPublicProfileScript();
    }

    loadPublicProfileScript() {
        // Check if script is already loaded
        if (document.querySelector('script[src*="public-profile.js"]')) {
            // Script already exists, just initialize
            if (window.PublicProfileViewer) {
                new window.PublicProfileViewer();
            }
            return;
        }

        // Load the script
        const script = document.createElement('script');
        script.src = '/assets/js/public-profile.js';
        script.onload = () => {
            // Script loaded, initialize
            if (window.PublicProfileViewer) {
                new window.PublicProfileViewer();
            }
        };
        document.head.appendChild(script);
    }

    show404() {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="error-container">
                    <div class="error-content">
                        <h1>404</h1>
                        <h2>Kullanıcı Bulunamadı</h2>
                        <p>Aradığınız kullanıcı profili mevcut değil.</p>
                        <a href="/tr/" class="btn-primary">Ana Sayfaya Dön</a>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProfileRouter();
});
