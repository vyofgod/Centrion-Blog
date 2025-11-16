// Public Profile Viewer
class PublicProfileViewer {
    constructor() {
        this.supabase = window.supabaseClient;
        this.username = this.extractUsernameFromURL();
        this.profileData = null;
        this.init();
    }

    extractUsernameFromURL() {
        const path = window.location.pathname;
        const matches = path.match(/\/tr\/profile\/([^\/]+)/);
        return matches ? matches[1] : null;
    }

    async init() {
        if (!this.username) {
            this.showNotFound();
            return;
        }

        this.showLoading();
        await this.loadPublicProfile();
        this.setupEventListeners();
    }

    showLoading() {
        document.getElementById('profile-loading').style.display = 'flex';
        document.getElementById('profile-not-found').style.display = 'none';
        document.getElementById('public-profile').style.display = 'none';
    }

    showNotFound() {
        document.getElementById('profile-loading').style.display = 'none';
        document.getElementById('profile-not-found').style.display = 'flex';
        document.getElementById('public-profile').style.display = 'none';
    }

    showProfile() {
        document.getElementById('profile-loading').style.display = 'none';
        document.getElementById('profile-not-found').style.display = 'none';
        document.getElementById('public-profile').style.display = 'block';
    }

    async loadPublicProfile() {
        try {
            // Get profile from database
            const { data, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('username', this.username)
                .single();

            if (error || !data) {
                this.showNotFound();
                return;
            }

            this.profileData = data;
            this.populateProfile();
            this.showProfile();
        } catch (error) {
            console.error('Error loading public profile:', error);
            this.showNotFound();
        }
    }

    populateProfile() {
        const profile = this.profileData;
        
        // Basic info
        document.getElementById('public-fullname').textContent = profile.full_name || 'Kullanıcı';
        document.getElementById('public-username').textContent = `@${profile.username}`;
        document.getElementById('public-bio').textContent = profile.bio || 'Henüz biyografi eklenmedi';
        
        // Avatar
        if (profile.avatar_url) {
            document.getElementById('public-avatar').src = profile.avatar_url;
        }
        
        // Location
        const locationEl = document.getElementById('public-location');
        const locationText = document.getElementById('public-location-text');
        if (profile.location) {
            locationText.textContent = profile.location;
            locationEl.style.display = 'flex';
        } else {
            locationEl.style.display = 'none';
        }
        
        // Website
        const websiteEl = document.getElementById('public-website');
        const websiteLink = document.getElementById('public-website-link');
        const websiteText = document.getElementById('public-website-text');
        if (profile.website) {
            try {
                const domain = new URL(profile.website).hostname.replace('www.', '');
                websiteText.textContent = domain;
                websiteLink.href = profile.website;
                websiteEl.style.display = 'flex';
            } catch {
                websiteText.textContent = profile.website;
                websiteLink.href = `https://${profile.website}`;
                websiteEl.style.display = 'flex';
            }
        } else {
            websiteEl.style.display = 'none';
        }
        
        // Join date
        if (profile.created_at) {
            const joinDate = new Date(profile.created_at);
            const options = { year: 'numeric', month: 'long' };
            document.getElementById('public-joined-date').textContent = 
                `${joinDate.toLocaleDateString('tr-TR', options)} tarihinde katıldı`;
        }

        // Update page title
        document.title = `${profile.full_name || profile.username} (@${profile.username}) - Centrion`;
    }

    setupEventListeners() {
        // Share profile button
        document.getElementById('share-public-profile-btn').addEventListener('click', () => {
            this.openShareModal();
        });

        // Share modal close
        document.getElementById('public-share-close').addEventListener('click', () => {
            this.closeShareModal();
        });

        document.querySelector('.share-modal-overlay').addEventListener('click', () => {
            this.closeShareModal();
        });

        // Copy profile link
        document.getElementById('public-copy-link-btn').addEventListener('click', () => {
            this.copyProfileLink();
        });

        // Social media share buttons
        document.getElementById('public-share-whatsapp').addEventListener('click', () => {
            this.shareToSocial('whatsapp');
        });

        document.getElementById('public-share-twitter').addEventListener('click', () => {
            this.shareToSocial('twitter');
        });

        document.getElementById('public-share-telegram').addEventListener('click', () => {
            this.shareToSocial('telegram');
        });

        document.getElementById('public-share-facebook').addEventListener('click', () => {
            this.shareToSocial('facebook');
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShareModal();
            }
        });
    }

    openShareModal() {
        const modal = document.getElementById('public-share-modal');
        const profileUrl = `https://centrion.blog/tr/profile/${this.username}`;
        
        // Set profile link
        document.getElementById('public-share-link').value = profileUrl;
        
        // Show modal
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    closeShareModal() {
        const modal = document.getElementById('public-share-modal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    async copyProfileLink() {
        const linkInput = document.getElementById('public-share-link');
        const copyBtn = document.getElementById('public-copy-link-btn');
        
        try {
            await navigator.clipboard.writeText(linkInput.value);
            
            // Update button text
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Kopyalandı!
            `;
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
            
        } catch (error) {
            // Fallback for older browsers
            linkInput.select();
            document.execCommand('copy');
        }
    }

    shareToSocial(platform) {
        const profileUrl = `https://centrion.blog/tr/profile/${this.username}`;
        const fullName = this.profileData.full_name || this.username;
        const text = `${fullName} adlı kullanıcının Centrion profilini incele!`;
        
        let shareUrl = '';
        
        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + profileUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(text)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Supabase to be loaded
    const initPublicProfile = () => {
        if (window.supabaseClient) {
            new PublicProfileViewer();
        } else {
            setTimeout(initPublicProfile, 100);
        }
    };
    initPublicProfile();
});
