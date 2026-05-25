// ===== AUTENTICAÇÃO =====
(function() {
    // Verificar se está logado
    const isLoggedIn = localStorage.getItem('admin_logged');
    const currentPage = window.location.pathname;
    
    if (isLoggedIn !== 'true' && !currentPage.includes('index.html')) {
        window.location.href = 'index.html';
    }
    
    if (isLoggedIn === 'true' && currentPage.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
    
    // Configurar logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('admin_logged');
            localStorage.removeItem('admin_nome');
            window.location.href = 'index.html';
        });
    }
    
    // Mostrar nome do admin
    const adminNameSpan = document.getElementById('adminName');
    if (adminNameSpan) {
        const nome = localStorage.getItem('admin_nome') || 'Administrador';
        adminNameSpan.textContent = nome;
    }
})();