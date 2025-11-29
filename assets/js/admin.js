class AdminManager {
    constructor() {
        this.supabase = window.supabaseClient;
        if (!this.supabase) {
            return;
        }

        this.currentUser = null;
        this.currentProfile = null;
        this.isAdmin = false;
        this.adminRole = null;

        this.users = [];
        this.posts = [];

        this.profileAdminPanel = null;
        this.adminUsersPageRoot = null;

        this.toastTimeout = null;

        this.init();
    }

    async init() {
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            this.currentUser = session?.user || null;

            this.setupHeader();
            this.setupProfileAdminPanel();
            this.setupAdminUsersPage();

            if (!this.currentUser) {
                this.updateAdminVisibility();
                this.handleUnauthenticatedAdminUsersPage();
                return;
            }

            await this.loadCurrentProfile();

            if (!this.currentProfile) {
                this.updateAdminVisibility();
                return;
            }

            if (this.currentProfile.status === 'banned') {
                await this.handleBannedCurrentUser();
                return;
            }

            this.isAdmin = !!this.currentProfile.is_admin;
            this.adminRole = this.currentProfile.admin_role || null;

            this.updateAdminVisibility();

            if (!this.isAdmin) {
                this.handleNonAdminAdminUsersPage();
                return;
            }

            if (this.adminUsersPageRoot || this.profileAdminPanel) {
                await this.loadUsers();
            }

            if (this.profileAdminPanel) {
                await this.loadPosts();
                this.handleHashNavigation();
            }
        } catch (error) {
            console.error('AdminManager init error:', error);
        }
    }

    setupHeader() {
        this.adminMenuItem = document.getElementById('admin-menu-item');
        this.adminNewPostItem = document.getElementById('admin-post-add-item');
        this.adminNewPostButton = document.getElementById('admin-new-post-btn');

        if (this.adminNewPostButton) {
            this.adminNewPostButton.addEventListener('click', (e) => {
                e.preventDefault();

                if (!this.currentUser || !this.isAdmin) {
                    this.showNotification('Sadece adminler yeni yazı oluşturabilir.', 'error');
                    return;
                }

                if (this.isProfilePage()) {
                    this.switchToPostsTab();
                    this.openPostModalForCreate();
                } else {
                    window.location.href = '/tr/profile/#admin-posts';
                }
            });
        }
    }

    setupProfileAdminPanel() {
        const panel = document.getElementById('admin-panel');
        if (!panel) return;

        this.profileAdminPanel = panel;
        this.adminPanelSubtitle = document.getElementById('admin-panel-subtitle');

        this.adminTabs = Array.from(panel.querySelectorAll('.admin-tab'));
        this.adminTabPanels = {
            users: document.getElementById('admin-tab-users'),
            posts: document.getElementById('admin-tab-posts')
        };

        this.profileUsersContainer = document.getElementById('admin-users-list');
        this.profileUsersSearchInput = document.getElementById('admin-user-search');
        this.profileUsersCount = document.getElementById('admin-users-count');

        this.postsContainer = document.getElementById('admin-posts-list');
        this.createPostButton = document.getElementById('admin-create-post-btn');

        this.postModal = document.getElementById('admin-post-modal');
        this.postModalClose = document.getElementById('admin-post-modal-close');
        this.postForm = document.getElementById('admin-post-form');
        this.postModalTitle = document.getElementById('admin-post-modal-title');
        this.postTitleInput = document.getElementById('admin-post-title');
        this.postSlugInput = document.getElementById('admin-post-slug');
        this.postCategoryInput = document.getElementById('admin-post-category');
        this.postTagsInput = document.getElementById('admin-post-tags');
        this.postPublishedInput = document.getElementById('admin-post-published');
        this.postContentInput = document.getElementById('admin-post-content');
        this.postCancelButton = document.getElementById('admin-post-cancel-btn');
        this.postOverlay = this.postModal ? this.postModal.querySelector('.admin-modal-overlay') : null;

        this.editingPostId = null;

        if (this.adminTabs.length) {
            this.adminTabs.forEach((tab) => {
                tab.addEventListener('click', () => {
                    this.switchTab(tab.dataset.target);
                });
            });
        }

        if (this.profileUsersSearchInput) {
            this.profileUsersSearchInput.addEventListener('input', () => {
                this.renderProfileUsers();
            });
        }

        if (this.createPostButton) {
            this.createPostButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.isAdmin) {
                    this.showNotification('Bu işlem için admin yetkisi gerekiyor.', 'error');
                    return;
                }
                this.openPostModalForCreate();
            });
        }

        if (this.postModalClose) {
            this.postModalClose.addEventListener('click', () => this.closePostModal());
        }

        if (this.postCancelButton) {
            this.postCancelButton.addEventListener('click', () => this.closePostModal());
        }

        if (this.postOverlay) {
            this.postOverlay.addEventListener('click', () => this.closePostModal());
        }

        if (this.postForm) {
            this.postForm.addEventListener('submit', (e) => this.handlePostFormSubmit(e));
        }
    }

    setupAdminUsersPage() {
        const root = document.getElementById('admin-users-page');
        if (!root) return;

        this.adminUsersPageRoot = root;
        this.adminUsersAuthRequired = document.getElementById('admin-users-auth-required');
        this.adminUsersNotAdmin = document.getElementById('admin-users-not-admin');
        this.adminUsersTableContainer = document.getElementById('admin-users-table-container');
        this.adminUsersSearchInput = document.getElementById('admin-users-search');
        this.adminUsersCount = document.getElementById('admin-users-page-count');

        if (this.adminUsersSearchInput) {
            this.adminUsersSearchInput.addEventListener('input', () => {
                this.renderAdminUsersPage();
            });
        }
    }

    async loadCurrentProfile() {
        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .maybeSingle();

            if (error) {
                console.error('Profile load error:', error);
                return;
            }

            this.currentProfile = data;
        } catch (error) {
            console.error('Profile load error:', error);
        }
    }

    async handleBannedCurrentUser() {
        try {
            this.showNotification('Hesabınız yasaklanmıştır. Lütfen yönetici ile iletişime geçin.', 'error');
            await this.supabase.auth.signOut();
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (error) {
            console.error('Banned user signout error:', error);
        }
    }

    updateAdminVisibility() {
        const isAdmin = !!this.isAdmin;

        if (this.adminMenuItem) {
            this.adminMenuItem.style.display = isAdmin ? 'inline-block' : 'none';
        }

        if (this.adminNewPostItem) {
            this.adminNewPostItem.style.display = isAdmin ? 'inline-block' : 'none';
        }

        if (this.profileAdminPanel) {
            this.profileAdminPanel.style.display = isAdmin ? 'block' : 'none';

            if (this.adminPanelSubtitle && this.currentProfile) {
                const roleText = this.adminRole || 'user';
                this.adminPanelSubtitle.textContent = `Rolünüz: ${roleText}  b7 Geli5fmi5f yönetim araçları`;
            }
        }

        if (!this.currentUser) {
            if (this.adminUsersPageRoot && this.adminUsersAuthRequired) {
                this.adminUsersAuthRequired.style.display = 'flex';
                this.adminUsersPageRoot.style.display = 'none';
            }
        }
    }

    handleUnauthenticatedAdminUsersPage() {
        if (!this.adminUsersPageRoot) return;

        if (this.adminUsersAuthRequired) {
            this.adminUsersAuthRequired.style.display = 'flex';
        }

        if (this.adminUsersNotAdmin) {
            this.adminUsersNotAdmin.style.display = 'none';
        }

        this.adminUsersPageRoot.style.display = 'none';
    }

    handleNonAdminAdminUsersPage() {
        if (!this.adminUsersPageRoot) return;

        if (this.adminUsersNotAdmin) {
            this.adminUsersNotAdmin.style.display = 'flex';
        }

        if (this.adminUsersAuthRequired) {
            this.adminUsersAuthRequired.style.display = 'none';
        }

        this.adminUsersPageRoot.style.display = 'none';
    }

    async loadUsers() {
        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .select('id, username, full_name, is_admin, admin_role, status, created_at')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Users load error:', error);
                this.showNotification('Kullanıcılar yüklenemedi.', 'error');
                return;
            }

            this.users = data || [];

            this.renderProfileUsers();
            this.renderAdminUsersPage();
        } catch (error) {
            console.error('Users load error:', error);
            this.showNotification('Kullanıcılar yüklenemedi.', 'error');
        }
    }

    getFilteredUsers(query) {
        const q = (query || '').trim().toLowerCase();
        if (!q) return this.users.slice();

        return this.users.filter((user) => {
            const username = (user.username || '').toLowerCase();
            const fullName = (user.full_name || '').toLowerCase();
            return username.includes(q) || fullName.includes(q);
        });
    }

    renderProfileUsers() {
        if (!this.profileUsersContainer) return;

        const searchValue = this.profileUsersSearchInput ? this.profileUsersSearchInput.value : '';
        const users = this.getFilteredUsers(searchValue);

        this.profileUsersContainer.innerHTML = '';

        if (!users.length) {
            const empty = document.createElement('div');
            empty.className = 'admin-empty-state';
            empty.textContent = 'Kullanıcı bulunamadı.';
            this.profileUsersContainer.appendChild(empty);

            if (this.profileUsersCount) {
                this.profileUsersCount.textContent = '0 kullanıcı';
            }
            return;
        }

        users.forEach((user) => {
            const row = this.createUserRow(user);
            this.profileUsersContainer.appendChild(row);
        });

        if (this.profileUsersCount) {
            this.profileUsersCount.textContent = `${users.length} kullanıcı`;
        }
    }

    renderAdminUsersPage() {
        if (!this.adminUsersPageRoot || !this.adminUsersTableContainer) return;
        if (!this.isAdmin) return;

        this.adminUsersPageRoot.style.display = 'block';

        const searchValue = this.adminUsersSearchInput ? this.adminUsersSearchInput.value : '';
        const users = this.getFilteredUsers(searchValue);

        this.adminUsersTableContainer.innerHTML = '';

        if (!users.length) {
            const empty = document.createElement('div');
            empty.className = 'admin-empty-state';
            empty.textContent = 'Kullanıcı bulunamadı.';
            this.adminUsersTableContainer.appendChild(empty);

            if (this.adminUsersCount) {
                this.adminUsersCount.textContent = '0 kullanıcı';
            }
            return;
        }

        users.forEach((user) => {
            const row = this.createUserRow(user);
            this.adminUsersTableContainer.appendChild(row);
        });

        if (this.adminUsersCount) {
            this.adminUsersCount.textContent = `${users.length} kullanıcı`;
        }
    }

    createUserRow(user) {
        const row = document.createElement('div');
        row.className = 'admin-user-row';
        row.dataset.userId = user.id;

        const nameCol = document.createElement('div');
        nameCol.className = 'admin-user-main';
        const title = document.createElement('div');
        title.className = 'admin-user-name';
        title.textContent = user.full_name || user.username || user.id;
        const subtitle = document.createElement('div');
        subtitle.className = 'admin-user-username';
        subtitle.textContent = user.username ? `@${user.username}` : user.id;
        nameCol.appendChild(title);
        nameCol.appendChild(subtitle);

        const roleCol = document.createElement('div');
        roleCol.className = 'admin-user-role';
        const roleSelect = document.createElement('select');
        roleSelect.className = 'admin-role-select';

        const roles = [
            { value: 'none', label: 'Normal kullanıcı' },
            { value: 'moderator', label: 'Moderator' },
            { value: 'admin', label: 'Admin' },
            { value: 'super_admin', label: 'Super Admin' }
        ];

        roles.forEach((role) => {
            const option = document.createElement('option');
            option.value = role.value;
            option.textContent = role.label;
            roleSelect.appendChild(option);
        });

        const currentValue = user.is_admin ? (user.admin_role || 'admin') : 'none';
        roleSelect.value = currentValue;

        if (this.adminRole !== 'super_admin' && user.admin_role === 'super_admin') {
            roleSelect.disabled = true;
        }

        roleSelect.addEventListener('change', async () => {
            await this.handleRoleChange(user, roleSelect.value);
        });

        roleCol.appendChild(roleSelect);

        const statusCol = document.createElement('div');
        statusCol.className = 'admin-user-status';
        const statusBadge = document.createElement('span');
        statusBadge.className = 'admin-badge';
        if (user.status === 'banned') {
            statusBadge.classList.add('admin-badge-banned');
            statusBadge.textContent = 'Yasaklı';
        } else {
            statusBadge.textContent = 'Aktif';
        }
        statusCol.appendChild(statusBadge);

        const actionsCol = document.createElement('div');
        actionsCol.className = 'admin-user-actions';

        const viewProfileBtn = document.createElement('button');
        viewProfileBtn.type = 'button';
        viewProfileBtn.className = 'secondary-button admin-user-action';
        viewProfileBtn.textContent = 'Profili Aç';
        viewProfileBtn.addEventListener('click', () => {
            if (user.username) {
                window.open(`/tr/profile/?user=${encodeURIComponent(user.username)}`, '_blank');
            }
        });

        const banBtn = document.createElement('button');
        banBtn.type = 'button';
        banBtn.className = 'danger-button admin-user-action';
        banBtn.textContent = user.status === 'banned' ? 'Yasağı Kaldır' : 'Banla';
        banBtn.addEventListener('click', async () => {
            if (user.status === 'banned') {
                await this.updateUserStatus(user, 'active');
            } else {
                await this.updateUserStatus(user, 'banned');
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'secondary-button admin-user-action';
        deleteBtn.textContent = 'Hesabı Sil';
        deleteBtn.addEventListener('click', async () => {
            await this.softDeleteUser(user);
        });

        if (this.adminRole !== 'super_admin' && user.admin_role === 'super_admin') {
            banBtn.disabled = true;
            deleteBtn.disabled = true;
        }

        actionsCol.appendChild(viewProfileBtn);
        actionsCol.appendChild(banBtn);
        actionsCol.appendChild(deleteBtn);

        row.appendChild(nameCol);
        row.appendChild(roleCol);
        row.appendChild(statusCol);
        row.appendChild(actionsCol);

        return row;
    }

    async handleRoleChange(user, value) {
        if (value === 'super_admin' && this.adminRole !== 'super_admin') {
            this.showNotification('Sadece super adminler super admin atayabilir.', 'error');
            this.renderProfileUsers();
            this.renderAdminUsersPage();
            return;
        }

        const updates = { is_admin: false, admin_role: null };

        if (value !== 'none') {
            updates.is_admin = true;
            updates.admin_role = value;
        }

        await this.updateUserRole(user, updates);
    }

    async updateUserRole(user, updates) {
        try {
            const { error } = await this.supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) {
                console.error('Update role error:', error);
                this.showNotification('Rol güncellenemedi.', 'error');
                return;
            }

            const idx = this.users.findIndex((u) => u.id === user.id);
            if (idx !== -1) {
                this.users[idx] = { ...this.users[idx], ...updates };
            }

            this.showNotification('Kullanıcı rolü güncellendi.', 'success');
            this.renderProfileUsers();
            this.renderAdminUsersPage();
        } catch (error) {
            console.error('Update role error:', error);
            this.showNotification('Rol güncellenemedi.', 'error');
        }
    }

    async updateUserStatus(user, status) {
        if (status === 'banned') {
            const confirmBan = window.confirm('Bu kullanıcıyı banlamak istediğinize emin misiniz?');
            if (!confirmBan) return;
        }

        try {
            const { error } = await this.supabase
                .from('profiles')
                .update({ status })
                .eq('id', user.id);

            if (error) {
                console.error('Update status error:', error);
                this.showNotification('Kullanıcı durumu güncellenemedi.', 'error');
                return;
            }

            const idx = this.users.findIndex((u) => u.id === user.id);
            if (idx !== -1) {
                this.users[idx] = { ...this.users[idx], status };
            }

            this.showNotification('Kullanıcı durumu güncellendi.', 'success');
            this.renderProfileUsers();
            this.renderAdminUsersPage();
        } catch (error) {
            console.error('Update status error:', error);
            this.showNotification('Kullanıcı durumu güncellenemedi.', 'error');
        }
    }

    async softDeleteUser(user) {
        const confirmDelete = window.confirm('Bu hesabı anonimleştirip kalıcı olarak devre dışı bırakmak istediğinize emin misiniz?');
        if (!confirmDelete) return;

        const randomSuffix = Math.random().toString(36).slice(-6);
        const anonymizedUsername = `deleted_${randomSuffix}`;

        const updates = {
            username: anonymizedUsername,
            full_name: null,
            bio: null,
            website: null,
            location: null,
            avatar_url: null,
            status: 'banned',
            is_admin: false,
            admin_role: null
        };

        try {
            const { error } = await this.supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) {
                console.error('Soft delete error:', error);
                this.showNotification('Hesap silinemedi.', 'error');
                return;
            }

            this.users = this.users.filter((u) => u.id !== user.id);
            this.showNotification('Hesap anonimleştirildi ve yasaklandı.', 'success');
            this.renderProfileUsers();
            this.renderAdminUsersPage();
        } catch (error) {
            console.error('Soft delete error:', error);
            this.showNotification('Hesap silinemedi.', 'error');
        }
    }

    async loadPosts() {
        if (!this.postsContainer) return;

        try {
            const { data, error } = await this.supabase
                .from('posts')
                .select('id, title, slug, published, created_at, updated_at, category')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Posts load error:', error);
                this.showNotification('Yazılar yüklenemedi.', 'error');
                return;
            }

            this.posts = data || [];
            this.renderPosts();
        } catch (error) {
            console.error('Posts load error:', error);
            this.showNotification('Yazılar yüklenemedi.', 'error');
        }
    }

    renderPosts() {
        if (!this.postsContainer) return;

        this.postsContainer.innerHTML = '';

        if (!this.posts.length) {
            const empty = document.createElement('div');
            empty.className = 'admin-empty-state';
            empty.textContent = 'Henüz Supabase üzerinden oluşturulmuş bir yazı yok.';
            this.postsContainer.appendChild(empty);
            return;
        }

        this.posts.forEach((post) => {
            const card = document.createElement('div');
            card.className = 'admin-post-card';
            card.dataset.postId = post.id;

            const header = document.createElement('div');
            header.className = 'admin-post-header';
            const title = document.createElement('h3');
            title.className = 'admin-post-title';
            title.textContent = post.title || '(Başlık yok)';
            header.appendChild(title);

            const badge = document.createElement('span');
            badge.className = 'admin-badge';
            if (post.published) {
                badge.classList.add('admin-badge-published');
                badge.textContent = 'Yayında';
            } else {
                badge.classList.add('admin-badge-draft');
                badge.textContent = 'Taslak';
            }
            header.appendChild(badge);

            const meta = document.createElement('div');
            meta.className = 'admin-post-meta';
            const createdAt = post.created_at ? new Date(post.created_at) : null;
            const updatedAt = post.updated_at ? new Date(post.updated_at) : null;
            const metaParts = [];
            if (createdAt) metaParts.push(`Oluşturma: ${createdAt.toLocaleDateString('tr-TR')}`);
            if (updatedAt) metaParts.push(`Güncelleme: ${updatedAt.toLocaleDateString('tr-TR')}`);
            if (post.slug) metaParts.push(`Slug: ${post.slug}`);
            if (post.category) metaParts.push(`Kategori: ${post.category}`);
            meta.textContent = metaParts.join('  b7 ');

            const actions = document.createElement('div');
            actions.className = 'admin-post-actions';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'secondary-button';
            editBtn.textContent = 'Düzenle';
            editBtn.addEventListener('click', () => {
                this.openPostModalForEdit(post);
            });

            const publishBtn = document.createElement('button');
            publishBtn.type = 'button';
            publishBtn.className = 'secondary-button';
            publishBtn.textContent = post.published ? 'Yayından Kaldır' : 'Yayınla';
            publishBtn.addEventListener('click', async () => {
                await this.togglePublish(post);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'danger-button';
            deleteBtn.textContent = 'Sil';
            deleteBtn.addEventListener('click', async () => {
                await this.deletePost(post);
            });

            actions.appendChild(editBtn);
            actions.appendChild(publishBtn);
            actions.appendChild(deleteBtn);

            card.appendChild(header);
            card.appendChild(meta);
            card.appendChild(actions);

            this.postsContainer.appendChild(card);
        });
    }

    openPostModalForCreate() {
        if (!this.postModal) return;

        this.editingPostId = null;
        if (this.postModalTitle) this.postModalTitle.textContent = 'Yeni Yazı Oluştur';
        if (this.postTitleInput) this.postTitleInput.value = '';
        if (this.postSlugInput) this.postSlugInput.value = '';
        if (this.postCategoryInput) this.postCategoryInput.value = '';
        if (this.postTagsInput) this.postTagsInput.value = '';
        if (this.postPublishedInput) this.postPublishedInput.checked = true;
        if (this.postContentInput) this.postContentInput.value = '';

        this.openPostModal();
    }

    openPostModalForEdit(post) {
        if (!this.postModal) return;

        this.editingPostId = post.id;
        if (this.postModalTitle) this.postModalTitle.textContent = 'Yazıyı Düzenle';
        if (this.postTitleInput) this.postTitleInput.value = post.title || '';
        if (this.postSlugInput) this.postSlugInput.value = post.slug || '';
        if (this.postCategoryInput) this.postCategoryInput.value = post.category || '';
        if (this.postTagsInput) this.postTagsInput.value = Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '');
        if (this.postPublishedInput) this.postPublishedInput.checked = !!post.published;
        if (this.postContentInput) this.postContentInput.value = post.content || '';

        this.openPostModal();
    }

    openPostModal() {
        if (!this.postModal) return;
        this.postModal.style.display = 'block';
        setTimeout(() => {
            this.postModal.classList.add('active');
        }, 10);
    }

    closePostModal() {
        if (!this.postModal) return;
        this.postModal.classList.remove('active');
        setTimeout(() => {
            this.postModal.style.display = 'none';
        }, 300);
    }

    async handlePostFormSubmit(e) {
        e.preventDefault();
        if (!this.postForm || !this.currentUser) return;

        const title = this.sanitizeValue(this.postTitleInput?.value || '');
        const slug = this.sanitizeValue(this.postSlugInput?.value || '');
        const category = this.sanitizeValue(this.postCategoryInput?.value || '');
        const tagsRaw = this.postTagsInput?.value || '';
        const published = !!(this.postPublishedInput && this.postPublishedInput.checked);
        const content = this.postContentInput?.value || '';

        if (!title) {
            this.showNotification('Başlık zorunludur.', 'error');
            return;
        }

        const tags = tagsRaw
            .split(',')
            .map((t) => this.sanitizeValue(t.trim()))
            .filter(Boolean);

        const payload = {
            title,
            slug: slug || null,
            category: category || null,
            tags: tags.length ? tags : null,
            published,
            content
        };

        try {
            if (this.editingPostId) {
                const { error } = await this.supabase
                    .from('posts')
                    .update(payload)
                    .eq('id', this.editingPostId);

                if (error) {
                    console.error('Post update error:', error);
                    this.showNotification('Yazı güncellenemedi.', 'error');
                    return;
                }

                this.showNotification('Yazı güncellendi.', 'success');
            } else {
                const insertPayload = { ...payload, author_id: this.currentUser.id };
                const { error } = await this.supabase
                    .from('posts')
                    .insert(insertPayload);

                if (error) {
                    console.error('Post insert error:', error);
                    this.showNotification('Yazı oluşturulamadı.', 'error');
                    return;
                }

                this.showNotification('Yazı oluşturuldu.', 'success');
            }

            this.closePostModal();
            await this.loadPosts();
        } catch (error) {
            console.error('Post save error:', error);
            this.showNotification('Yazı kaydedilemedi.', 'error');
        }
    }

    async deletePost(post) {
        const confirmDelete = window.confirm('Bu yazıyı silmek istediğinize emin misiniz?');
        if (!confirmDelete) return;

        try {
            const { error } = await this.supabase
                .from('posts')
                .delete()
                .eq('id', post.id);

            if (error) {
                console.error('Post delete error:', error);
                this.showNotification('Yazı silinemedi.', 'error');
                return;
            }

            this.showNotification('Yazı silindi.', 'success');
            await this.loadPosts();
        } catch (error) {
            console.error('Post delete error:', error);
            this.showNotification('Yazı silinemedi.', 'error');
        }
    }

    async togglePublish(post) {
        const newValue = !post.published;

        try {
            const { error } = await this.supabase
                .from('posts')
                .update({ published: newValue })
                .eq('id', post.id);

            if (error) {
                console.error('Toggle publish error:', error);
                this.showNotification('Yayın durumu güncellenemedi.', 'error');
                return;
            }

            const idx = this.posts.findIndex((p) => p.id === post.id);
            if (idx !== -1) {
                this.posts[idx].published = newValue;
            }

            this.showNotification(newValue ? 'Yazı yayınlandı.' : 'Yazı yayından kaldırıldı.', 'success');
            this.renderPosts();
        } catch (error) {
            console.error('Toggle publish error:', error);
            this.showNotification('Yayın durumu güncellenemedi.', 'error');
        }
    }

    switchTab(targetId) {
        if (!this.adminTabs || !this.adminTabs.length) return;

        this.adminTabs.forEach((tab) => {
            const isActive = tab.dataset.target === targetId;
            if (isActive) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        if (this.adminTabPanels.users) {
            this.adminTabPanels.users.style.display = targetId === 'admin-tab-users' ? 'block' : 'none';
        }

        if (this.adminTabPanels.posts) {
            this.adminTabPanels.posts.style.display = targetId === 'admin-tab-posts' ? 'block' : 'none';
        }
    }

    switchToPostsTab() {
        this.switchTab('admin-tab-posts');
        if (!this.profileAdminPanel) return;
        const postsSection = document.getElementById('admin-tab-posts');
        if (postsSection) {
            postsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    handleHashNavigation() {
        if (window.location.hash === '#admin-posts') {
            this.switchToPostsTab();
        }
    }

    isProfilePage() {
        return !!document.getElementById('profile-settings');
    }

    sanitizeValue(value) {
        if (!value) return '';
        if (window.CentrionSecurity && typeof window.CentrionSecurity.sanitize === 'function') {
            return window.CentrionSecurity.sanitize(value);
        }
        return value;
    }

    showNotification(message, type = 'success') {
        let toast = document.getElementById('notification-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'notification-toast';
            toast.className = 'notification-toast';
            toast.innerHTML = `
                <div class="toast-content">
                    <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
                    <span class="toast-message"></span>
                </div>
            `;
            document.body.appendChild(toast);
        }

        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');

        if (!toastMessage || !toastIcon) return;

        toastMessage.textContent = message;
        toast.className = `notification-toast ${type}`;

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

        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }

        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const initAdmin = () => {
        if (window.supabaseClient) {
            new AdminManager();
        } else {
            setTimeout(initAdmin, 100);
        }
    };

    initAdmin();
});
