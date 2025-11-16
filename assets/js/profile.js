// Profile Management
class ProfileManager {
    constructor() {
        this.supabase = window.supabaseClient;
        this.currentUser = null;
        this.currentProfile = null;
        this.avatarFile = null;
        this.init();
    }

    async init() {
        // Show loading
        this.showLoading();

        // Check auth state
        const { data: { session } } = await this.supabase.auth.getSession();
        
        if (!session) {
            this.showAuthRequired();
            return;
        }

        this.currentUser = session.user;
        await this.loadProfile();
        this.setupEventListeners();
        this.hideLoading();
    }

    showLoading() {
        document.getElementById('profile-loading').style.display = 'flex';
        document.getElementById('profile-settings').style.display = 'none';
        document.getElementById('auth-required').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('profile-loading').style.display = 'none';
        document.getElementById('profile-settings').style.display = 'block';
    }

    showAuthRequired() {
        document.getElementById('profile-loading').style.display = 'none';
        document.getElementById('auth-required').style.display = 'flex';
        
        document.getElementById('login-redirect-btn').addEventListener('click', () => {
            const authButton = document.getElementById('auth-button');
            if (authButton) authButton.click();
        });
    }

    async loadProfile() {
        try {
            // Get profile from database
            const { data, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            this.currentProfile = data || {};
            this.populateForm();
            this.updatePreview();
            this.updateAccountInfo();
        } catch (error) {
            console.error('Error loading profile:', error);
            this.showNotification('Profil yüklenirken hata oluştu', 'error');
        }
    }

    populateForm() {
        const profile = this.currentProfile;
        
        document.getElementById('full-name').value = profile.full_name || '';
        document.getElementById('username').value = profile.username || '';
        document.getElementById('bio').value = profile.bio || '';
        document.getElementById('website').value = profile.website || '';
        document.getElementById('location').value = profile.location || '';
        
        if (profile.avatar_url) {
            document.getElementById('avatar-preview').src = profile.avatar_url;
            document.getElementById('remove-avatar-btn').style.display = 'inline-flex';
        }

        this.updateBioCounter();
    }

    updatePreview() {
        const profile = this.currentProfile;
        
        document.getElementById('preview-fullname').textContent = profile.full_name || 'Kullanıcı Adı';
        document.getElementById('preview-username').textContent = profile.username ? `@${profile.username}` : '@username';
        document.getElementById('preview-bio').textContent = profile.bio || 'Henüz biyografi eklenmedi';
        
        const locationEl = document.getElementById('preview-location');
        const locationText = locationEl.querySelector('.preview-meta-text');
        if (locationText) {
            locationText.textContent = profile.location || 'Konum belirtilmedi';
        }
        
        const websiteEl = document.getElementById('preview-website');
        const websiteText = websiteEl.querySelector('.preview-meta-text');
        if (websiteText) {
            if (profile.website) {
                try {
                    const domain = new URL(profile.website).hostname.replace('www.', '');
                    websiteText.textContent = domain;
                } catch {
                    websiteText.textContent = profile.website;
                }
            } else {
                websiteText.textContent = 'Website yok';
            }
        }
        
        if (profile.avatar_url) {
            document.getElementById('preview-avatar').src = profile.avatar_url;
        }
    }

    updateAccountInfo() {
        document.getElementById('user-email').textContent = this.currentUser.email;
        
        const createdAt = new Date(this.currentUser.created_at);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('user-created-at').textContent = 
            createdAt.toLocaleDateString('tr-TR', options);
    }

    setupEventListeners() {
        // Avatar upload
        const uploadBtn = document.getElementById('upload-avatar-btn');
        const avatarInput = document.getElementById('avatar-input');
        const removeBtn = document.getElementById('remove-avatar-btn');

        uploadBtn.addEventListener('click', () => avatarInput.click());
        avatarInput.addEventListener('change', (e) => this.handleAvatarSelect(e));
        removeBtn.addEventListener('click', () => this.removeAvatar());

        // Form submission
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Cancel button
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.populateForm();
            this.showNotification('Değişiklikler iptal edildi', 'info');
        });

        // Bio counter
        const bioInput = document.getElementById('bio');
        bioInput.addEventListener('input', () => this.updateBioCounter());

        // Real-time preview updates
        document.getElementById('full-name').addEventListener('input', (e) => {
            document.getElementById('preview-fullname').textContent = e.target.value || 'Kullanıcı Adı';
        });

        document.getElementById('username').addEventListener('input', (e) => {
            document.getElementById('preview-username').textContent = e.target.value ? `@${e.target.value}` : '@username';
        });

        bioInput.addEventListener('input', (e) => {
            document.getElementById('preview-bio').textContent = e.target.value || 'Henüz biyografi eklenmedi';
        });

        document.getElementById('location').addEventListener('input', (e) => {
            const locationEl = document.getElementById('preview-location');
            const locationText = locationEl.querySelector('.preview-meta-text');
            if (locationText) {
                locationText.textContent = e.target.value || 'Konum belirtilmedi';
            }
        });

        document.getElementById('website').addEventListener('input', (e) => {
            const websiteEl = document.getElementById('preview-website');
            const websiteText = websiteEl.querySelector('.preview-meta-text');
            if (websiteText) {
                if (e.target.value) {
                    try {
                        const domain = new URL(e.target.value).hostname.replace('www.', '');
                        websiteText.textContent = domain;
                    } catch {
                        websiteText.textContent = e.target.value;
                    }
                } else {
                    websiteText.textContent = 'Website yok';
                }
            }
        });

        // Delete account
        document.getElementById('delete-account-btn').addEventListener('click', () => {
            this.confirmDeleteAccount();
        });

        // Share profile
        document.getElementById('share-profile-btn').addEventListener('click', () => {
            this.openShareModal();
        });

        // Share modal close
        document.getElementById('share-modal-close').addEventListener('click', () => {
            this.closeShareModal();
        });

        document.querySelector('.share-modal-overlay').addEventListener('click', () => {
            this.closeShareModal();
        });

        // Copy profile link
        document.getElementById('copy-link-btn').addEventListener('click', () => {
            this.copyProfileLink();
        });

        // Social media share buttons
        document.getElementById('share-whatsapp').addEventListener('click', () => {
            this.shareToSocial('whatsapp');
        });

        document.getElementById('share-twitter').addEventListener('click', () => {
            this.shareToSocial('twitter');
        });

        document.getElementById('share-telegram').addEventListener('click', () => {
            this.shareToSocial('telegram');
        });

        document.getElementById('share-facebook').addEventListener('click', () => {
            this.shareToSocial('facebook');
        });

        // Download QR code
        document.getElementById('download-qr-btn').addEventListener('click', () => {
            this.downloadQRCode();
        });
    }

    updateBioCounter() {
        const bio = document.getElementById('bio').value;
        document.getElementById('bio-counter').textContent = bio.length;
    }

    handleAvatarSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('Lütfen geçerli bir resim dosyası seçin', 'error');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('Dosya boyutu 2MB\'dan küçük olmalıdır', 'error');
            return;
        }

        this.avatarFile = file;

        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('avatar-preview').src = e.target.result;
            document.getElementById('preview-avatar').src = e.target.result;
            document.getElementById('remove-avatar-btn').style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);

        this.showNotification('Resim seçildi. Kaydetmeyi unutmayın!', 'info');
    }

    async removeAvatar() {
        if (!confirm('Profil resmini kaldırmak istediğinizden emin misiniz?')) {
            return;
        }

        try {
            // Delete from storage if exists
            if (this.currentProfile.avatar_url) {
                const path = this.currentProfile.avatar_url.split('/').slice(-2).join('/');
                await this.supabase.storage.from('avatars').remove([path]);
            }

            // Update profile
            const { error } = await this.supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', this.currentUser.id);

            if (error) throw error;

            // Reset UI
            document.getElementById('avatar-preview').src = '/logo.png';
            document.getElementById('preview-avatar').src = '/logo.png';
            document.getElementById('remove-avatar-btn').style.display = 'none';
            this.avatarFile = null;
            this.currentProfile.avatar_url = null;

            this.showNotification('Profil resmi kaldırıldı', 'success');
        } catch (error) {
            console.error('Error removing avatar:', error);
            this.showNotification('Profil resmi kaldırılırken hata oluştu', 'error');
        }
    }

    async uploadAvatar() {
        if (!this.avatarFile) return null;

        try {
            const fileExt = this.avatarFile.name.split('.').pop();
            const fileName = `${this.currentUser.id}/${Date.now()}.${fileExt}`;

            // Delete old avatar if exists
            if (this.currentProfile.avatar_url) {
                const oldPath = this.currentProfile.avatar_url.split('/').slice(-2).join('/');
                await this.supabase.storage.from('avatars').remove([oldPath]);
            }

            // Upload new avatar
            const { data, error } = await this.supabase.storage
                .from('avatars')
                .upload(fileName, this.avatarFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = this.supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    }

    async saveProfile() {
        const saveBtn = document.getElementById('save-profile-btn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<div class="button-spinner"></div> Kaydediliyor...';

        try {
            // Upload avatar if selected
            let avatarUrl = this.currentProfile.avatar_url;
            if (this.avatarFile) {
                avatarUrl = await this.uploadAvatar();
            }

            // Prepare profile data
            const profileData = {
                full_name: document.getElementById('full-name').value.trim(),
                username: document.getElementById('username').value.trim().toLowerCase(),
                bio: document.getElementById('bio').value.trim(),
                website: document.getElementById('website').value.trim(),
                location: document.getElementById('location').value.trim(),
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString()
            };

            // Update profile
            const { error } = await this.supabase
                .from('profiles')
                .upsert({
                    id: this.currentUser.id,
                    ...profileData
                });

            if (error) throw error;

            this.currentProfile = { ...this.currentProfile, ...profileData };
            this.avatarFile = null;

            this.showNotification('Profil başarıyla güncellendi! 🎉', 'success');
        } catch (error) {
            console.error('Error saving profile:', error);
            
            if (error.code === '23505') {
                this.showNotification('Bu kullanıcı adı zaten kullanılıyor', 'error');
            } else {
                this.showNotification('Profil kaydedilirken hata oluştu', 'error');
            }
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Değişiklikleri Kaydet
            `;
        }
    }

    confirmDeleteAccount() {
        const confirmation = prompt(
            'Hesabınızı silmek istediğinizden emin misiniz?\n' +
            'Bu işlem geri alınamaz. Onaylamak için "HESABI SIL" yazın:'
        );

        if (confirmation === 'HESABI SIL') {
            this.deleteAccount();
        } else if (confirmation !== null) {
            this.showNotification('Yanlış onay metni girdiniz', 'error');
        }
    }

    async deleteAccount() {
        try {
            // This would require a server-side function for security
            // For now, we'll just sign out
            await this.supabase.auth.signOut();
            this.showNotification('Hesap silme işlemi için lütfen yöneticiyle iletişime geçin', 'info');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (error) {
            console.error('Error deleting account:', error);
            this.showNotification('Hesap silinirken hata oluştu', 'error');
        }
    }

    openShareModal() {
        const modal = document.getElementById('share-profile-modal');
        const profileUrl = `https://centrion.blog/tr/profile/`;
        
        // Set profile link
        document.getElementById('share-profile-link').value = profileUrl;
        
        // Generate QR code
        this.generateQRCode(profileUrl);
        
        // Show modal
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    closeShareModal() {
        const modal = document.getElementById('share-profile-modal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            // Clear QR code
            const canvas = document.getElementById('share-qr-canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 300);
    }

    generateQRCode(url) {
        const canvas = document.getElementById('share-qr-canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 256;
        canvas.height = 256;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Generate QR code using QRCode.js
        if (typeof QRCode !== 'undefined') {
            // Create a temporary container
            const tempContainer = document.createElement('div');
            tempContainer.style.display = 'none';
            document.body.appendChild(tempContainer);
            
            const qr = new QRCode(tempContainer, {
                text: url,
                width: 256,
                height: 256,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // Wait for QR code generation and draw on canvas
            setTimeout(() => {
                const qrImg = tempContainer.querySelector('img');
                if (qrImg) {
                    ctx.drawImage(qrImg, 0, 0, 256, 256);
                }
                document.body.removeChild(tempContainer);
            }, 100);
        } else {
            // Fallback: Draw a simple pattern if QRCode library is not loaded
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 256, 256);
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('QR Kod', 128, 128);
        }
    }

    async copyProfileLink() {
        const linkInput = document.getElementById('share-profile-link');
        const copyBtn = document.getElementById('copy-link-btn');
        
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
            
            this.showNotification('Profil linki kopyalandı! 📋', 'success');
        } catch (error) {
            // Fallback for older browsers
            linkInput.select();
            document.execCommand('copy');
            this.showNotification('Profil linki kopyalandı! 📋', 'success');
        }
    }

    shareToSocial(platform) {
        const profileUrl = `https://centrion.blog/tr/profile/`;
        const fullName = this.currentProfile.full_name || 'Kullanıcı';
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
            this.showNotification(`${platform} üzerinden paylaşılıyor...`, 'info');
        }
    }

    downloadQRCode() {
        const canvas = document.getElementById('share-qr-canvas');
        const username = this.currentProfile.username || 'profile';
        
        try {
            // Convert canvas to blob
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `centrion-profile-${username}-qr.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                this.showNotification('QR kod indirildi! 📥', 'success');
            });
        } catch (error) {
            console.error('Error downloading QR code:', error);
            this.showNotification('QR kod indirilemedi', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const toast = document.getElementById('notification-toast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');

        toastMessage.textContent = message;
        toast.className = `notification-toast ${type}`;

        // Update icon based on type
        if (type === 'error') {
            toastIcon.innerHTML = `
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            `;
        } else if (type === 'info') {
            toastIcon.innerHTML = `
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            `;
        } else {
            toastIcon.innerHTML = `<polyline points="20 6 9 17 4 12"></polyline>`;
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Supabase to be loaded
    const initProfile = () => {
        if (window.supabaseClient) {
            new ProfileManager();
        } else {
            setTimeout(initProfile, 100);
        }
    };
    initProfile();
});
