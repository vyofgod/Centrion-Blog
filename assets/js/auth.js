// Authentication functionality
class AuthManager {
    constructor() {
        this.supabase = window.supabaseClient;
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Check if user is already logged in
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            this.updateUI();
        }

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user;
                this.updateUI();
                this.closeAuthModal();
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.updateUI();
            }
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auth modal controls
        const authButton = document.getElementById('auth-button');
        const authModal = document.getElementById('auth-modal');
        const authClose = document.getElementById('auth-close');
        const authOverlay = authModal?.querySelector('.auth-modal-overlay');

        if (authButton && authModal) {
            authButton.addEventListener('click', (e) => this.handleAuthButtonClick(e));

            authClose?.addEventListener('click', () => this.closeAuthModal());
            authOverlay?.addEventListener('click', () => this.closeAuthModal());
        }

        // Profile page logout button
        document.getElementById('profile-logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Tab switching
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        loginTab?.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab?.classList.remove('active');
            loginForm?.classList.add('active');
            registerForm?.classList.remove('active');
        });

        registerTab?.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab?.classList.remove('active');
            registerForm?.classList.add('active');
            loginForm?.classList.remove('active');
        });

        // Form submissions
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('register-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && authModal?.classList.contains('active')) {
                this.closeAuthModal();
            }
        });
    }

    openAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = 'block';
            setTimeout(() => {
                authModal.classList.add('active');
            }, 10);
        }
    }

    closeAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.remove('active');
            setTimeout(() => {
                authModal.style.display = 'none';
                this.clearForms();
            }, 300);
        }
    }

    clearForms() {
        document.getElementById('login-form')?.reset();
        document.getElementById('register-form')?.reset();
        this.clearMessages();
    }

    clearMessages() {
        const messages = document.querySelectorAll('.auth-message');
        messages.forEach(msg => msg.remove());
    }

    showMessage(form, message, type = 'error') {
        this.clearMessages();
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message auth-${type}`;
        messageDiv.textContent = message;
        form.insertBefore(messageDiv, form.firstChild);
    }

    async handleLogin(e) {
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        if (!email || !password) {
            this.showMessage(form, 'Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                this.showMessage(form, this.getErrorMessage(error.message));
            } else {
                this.showMessage(form, 'Giriş başarılı!', 'success');
            }
        } catch (error) {
            this.showMessage(form, 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }

    async handleRegister(e) {
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (!email || !password || !confirmPassword) {
            this.showMessage(form, 'Lütfen tüm alanları doldurun.');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage(form, 'Şifreler eşleşmiyor.');
            return;
        }

        if (password.length < 6) {
            this.showMessage(form, 'Şifre en az 6 karakter olmalıdır.');
            return;
        }

        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'https://centrion.blog/tr/profile/'
                }
            });

            if (error) {
                this.showMessage(form, this.getErrorMessage(error.message));
            } else {
                this.showMessage(form, 'Kayıt başarılı! E-posta adresinizi kontrol edin.', 'success');
            }
        } catch (error) {
            this.showMessage(form, 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }

    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    handleAuthButtonClick(e) {
        e.preventDefault();
        if (this.currentUser) {
            window.location.href = '/tr/profile/';
        } else {
            this.openAuthModal();
        }
    }

    updateUI() {
        const authButton = document.getElementById('auth-button');
        const userInfo = document.getElementById('user-info');
        
        if (authButton) {
            if (this.currentUser) {
                authButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Hesap</span>
                `;
                authButton.title = 'Hesap Menüsü';
            } else {
                authButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Giriş</span>
                `;
                authButton.title = 'Giriş Yap / Kayıt Ol';
                
            }
        }

        if (userInfo) {
            if (this.currentUser) {
                userInfo.innerHTML = `Hoş geldin, ${this.currentUser.email}`;
                userInfo.style.display = 'block';
            } else {
                userInfo.style.display = 'none';
            }
        }
    }

    getErrorMessage(error) {
        const errorMessages = {
            'Invalid login credentials': 'Geçersiz e-posta veya şifre.',
            'Email not confirmed': 'E-posta adresinizi onaylamanız gerekiyor.',
            'User already registered': 'Bu e-posta adresi zaten kayıtlı.',
            'Password should be at least 6 characters': 'Şifre en az 6 karakter olmalıdır.',
            'Invalid email': 'Geçersiz e-posta adresi.',
            'Signup is disabled': 'Kayıt işlemi şu anda devre dışı.'
        };

        return errorMessages[error] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Supabase to be loaded
    if (window.supabaseClient) {
        new AuthManager();
    } else {
        // Wait a bit more for Supabase to load
        setTimeout(() => {
            if (window.supabaseClient) {
                new AuthManager();
            }
        }, 100);
    }
});
