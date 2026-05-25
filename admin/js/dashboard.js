// ===== DASHBOARD =====
const Dashboard = {
    currentPage: 'dashboard',
    
    init() {
        this.setupNavigation();
        this.loadPage('dashboard');
        
    },
    
    setupNavigation() {
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.loadPage(page);
                
                document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            });
        });
    },
    
    loadPage(page) {
        this.currentPage = page;
        const pageTitle = document.getElementById('pageTitle');
        const content = document.getElementById('pageContent');
        
        
        pageTitle.textContent = this.getPageTitle(page);
        
        switch(page) {
            case 'dashboard':
                this.renderDashboard(content);
                break;
            case 'noticias':
                if (typeof Noticias !== 'undefined') Noticias.render(content);
                break;
            case 'confissoes':
                if (typeof Confissoes !== 'undefined') Confissoes.render(content);
                break;
                case 'contato':
                    if (typeof Contato !== 'undefined') {
                        if (!Contato.mensagem) Contato.init();
                        Contato.render(content);
                    }
                    break;
            case 'doacoes':
                if (typeof Doacoes !== 'undefined') Doacoes.render(content);
                break;
            default:
                this.renderDashboard(content);
        }
    },
    
    getPageTitle(page) {
        const titles = {
            dashboard: 'Dashboard',
            noticias: 'Gerenciar Notícias',
            confissoes: 'Confissões Agendadas',
            contato: 'Mensagens de Contato',
            doacoes: 'Histórico de Doações'
        };
        return titles[page] || 'Dashboard';
    },
    
    renderDashboard(container) {
        const stats = this.getStats();
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-newspaper"></i>
                    <div class="stat-info">
                        <h3>${stats.noticias}</h3>
                        <p>Notícias Publicadas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-cross"></i>
                    <div class="stat-info">
                        <h3>${stats.confissoes}</h3>
                        <p>Confissões Agendadas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-envelope"></i>
                    <div class="stat-info">
                        <h3>${stats.mensagens}</h3>
                        <p>Mensagens Recebidas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-hand-holding-heart"></i>
                    <div class="stat-info">
                        <h3>R$ ${stats.doacoes}</h3>
                        <p>Doações (Mês)</p>
                    </div>
                </div>
            </div>
            <div class="data-table">
                <h3 style="padding: 15px;"> Últimas Notícias</h3>
                <table>
                    <thead>
                        <tr><th>Título</th><th>Data</th><th>Status</th><th>Ações</th></tr>
                    </thead>
                    <tbody id="ultimasNoticias"></tbody>
                </table>
            </div>
        `;
        
        this.renderUltimasNoticias();
    },
    
    getStats() {
        const noticias = JSON.parse(localStorage.getItem('admin_noticias') || '[]');
        const confissoes = JSON.parse(localStorage.getItem('confessionario_agendamentos') || '[]');
        const mensagens = JSON.parse(localStorage.getItem('admin_mensagens') || '[]');
        
        return {
            noticias: noticias.filter(n => n.status === 'publicado').length,
            confissoes: confissoes.length,
            mensagens: mensagens.filter(m => !m.lido).length,
            doacoes: '2.450'
        };
    },
    
    renderUltimasNoticias() {
        const noticias = JSON.parse(localStorage.getItem('admin_noticias') || '[]');
        const tbody = document.getElementById('ultimasNoticias');
        
        if (tbody) {
            tbody.innerHTML = noticias.slice(0, 5).map(noticia => `
                <tr>
                    <td>${noticia.titulo}</td>
                    <td>${noticia.data}</td>
                    <td><span class="status-badge status-${noticia.status}">${noticia.status === 'publicado' ? 'Publicado' : 'Rascunho'}</span></td>
                    <td>
                        <button class="btn-edit" onclick="Noticias.edit('${noticia.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="Noticias.delete('${noticia.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});

