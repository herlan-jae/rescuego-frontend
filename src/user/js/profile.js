document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const logoutModalContent = document.getElementById('logoutModalContent');
    const cancelLogoutBtn = document.getElementById('cancelLogout');
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    const profileForm = document.getElementById('profile-form');
    const toast = document.getElementById('toast');
    const showModal = (modal, content) => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
        }, 10);
    };

    const hideModal = (modal, content) => {
        modal.classList.add('opacity-0');
        content.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showModal(logoutModal, logoutModalContent);
        });
    }
    if (cancelLogoutBtn) {
        cancelLogoutBtn.addEventListener('click', () => {
            hideModal(logoutModal, logoutModalContent);
        });
    }
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => {
            console.log('Pengguna keluar...');
            window.location.href = 'login.html';
        });
    }
    
    if (logoutModal) {
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                hideModal(logoutModal, logoutModalContent);
            }
        });
    }
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Data profil disimpan!');
            if (toast) {
                toast.classList.remove('opacity-0');
                setTimeout(() => {
                    toast.classList.add('opacity-0');
                }, 3000);
            }
        });
    }
});
