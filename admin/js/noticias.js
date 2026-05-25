// ===== GERENCIAR NOTÍCIAS - VERSÃO COMPLETA =====

const Noticias = {
    noticias: [],
    
    init() {
        this.load();
    },
    
    load() {
        const saved = localStorage.getItem('admin_noticias');
        if (saved) {
            this.noticias = JSON.parse(saved);
        } else {
            // Dados iniciais
            this.noticias = [
                {
                    id: Date.now().toString(),
                    titulo: 'Cardeal Dom Odilo visita o Papa',
                    descricao: 'Confira os assuntos tratados com o Sumo Pontífice em Roma.',
                    textoCompleto: 'O Cardeal Dom Odilo Pedro Scherer, Arcebispo Metropolitano de São Paulo, esteve em Roma para uma audiência privada com o Papa Francisco. Durante o encontro, foram discutidos temas relevantes para a Igreja no Brasil.',
                    imagem: 'https://placehold.co/600x400/c9a959/white?text=Catedral',
                    data: new Date().toLocaleDateString('pt-BR'),
                    status: 'publicado'
                }
            ];
            this.save();
        }
    },
    
    save() {
        localStorage.setItem('admin_noticias', JSON.stringify(this.noticias));
        this.syncWithSite();
    },
    
    syncWithSite() {
        const publicadas = this.noticias.filter(n => n.status === 'publicado');
        localStorage.setItem('site_noticias', JSON.stringify(publicadas));
        window.dispatchEvent(new CustomEvent('noticiasAtualizadas'));
    },
    
    render(container) {
        this.load();
        
        container.innerHTML = `
            <style>
                .noticia-card-admin {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.2s ease;
                    border: 1px solid #eef2f6;
                }
                .noticia-card-admin:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
                }
                .btn-add-noticia {
                    background: #27ae60;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    cursor: pointer;
                    margin-bottom: 24px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .btn-add-noticia:hover {
                    background: #219a52;
                    transform: translateY(-2px);
                }
            </style>
            
            <button class="btn-add-noticia" onclick="Noticias.abrirModalNova()">
                <i class="fas fa-plus-circle"></i> Nova Notícia
            </button>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">
                ${this.noticias.map(noticia => `
                    <div class="noticia-card-admin">
                        <img src="${noticia.imagem}" style="width: 100%; height: 160px; object-fit: cover;" onerror="this.src='https://placehold.co/600x400/c9a959/white?text=Imagem'">
                        <div style="padding: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h3 style="font-size: 1rem; margin: 0; color: #2c3e50;">${this.escapeHtml(noticia.titulo)}</h3>
                                <span style="background: ${noticia.status === 'publicado' ? '#e8f8f5' : '#f8f9fa'}; color: ${noticia.status === 'publicado' ? '#27ae60' : '#95a5a6'}; padding: 3px 10px; border-radius: 20px; font-size: 11px;">
                                    ${noticia.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                                </span>
                            </div>
                            <p style="color: #7f8c8d; font-size: 13px; margin-bottom: 16px; line-height: 1.4;">${this.escapeHtml(noticia.descricao.substring(0, 80))}...</p>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn-edit" onclick="Noticias.abrirModalEditar('${noticia.id}')">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn-delete" onclick="Noticias.excluir('${noticia.id}')">
                                    <i class="fas fa-trash"></i> Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${this.noticias.length === 0 ? `
                <div class="empty-state" style="text-align: center; padding: 60px; background: white; border-radius: 16px;">
                    <i class="fas fa-newspaper" style="font-size: 48px; color: #d0d7de; margin-bottom: 16px;"></i>
                    <p style="color: #8b9eb0;">Nenhuma notícia cadastrada</p>
                    <button class="btn-add-noticia" onclick="Noticias.abrirModalNova()" style="margin-top: 16px;">Criar primeira notícia</button>
                </div>
            ` : ''}
        `;
    },
    
    abrirModalNova() {
        this.abrirModal(null);
    },
    
    abrirModalEditar(id) {
        const noticia = this.noticias.find(n => n.id === id);
        if (noticia) {
            this.abrirModal(noticia);
        }
    },
    
    abrirModal(noticia) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 10000; display: flex; align-items: center; justify-content: center;';
        modal.innerHTML = `
            <div style="background: white; border-radius: 24px; width: 90%; max-width: 550px; max-height: 85vh; overflow-y: auto; animation: fadeInUp 0.2s ease;">
                <div style="padding: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="color: #2c3e50; margin: 0; font-size: 18px;">
                            <i class="fas fa-${noticia ? 'edit' : 'plus-circle'}" style="color: #c9a959; margin-right: 8px;"></i>
                            ${noticia ? 'Editar Notícia' : 'Nova Notícia'}
                        </h3>
                        <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #95a5a6;">&times;</button>
                    </div>
                    
                    <form id="formNoticia">
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50;">Título *</label>
                            <input type="text" id="titulo" value="${noticia ? this.escapeHtml(noticia.titulo) : ''}" style="width: 100%; padding: 10px 12px; border: 1px solid #e0e8f0; border-radius: 10px;" required>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50;">Descrição Resumida *</label>
                            <textarea id="descricao" rows="2" style="width: 100%; padding: 10px 12px; border: 1px solid #e0e8f0; border-radius: 10px;" required>${noticia ? this.escapeHtml(noticia.descricao) : ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50;">Texto Completo *</label>
                            <textarea id="textoCompleto" rows="5" style="width: 100%; padding: 10px 12px; border: 1px solid #e0e8f0; border-radius: 10px;" required>${noticia ? this.escapeHtml(noticia.textoCompleto) : ''}</textarea>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50;">Imagem (URL)</label>
                            <input type="text" id="imagem" value="${noticia ? this.escapeHtml(noticia.imagem) : ''}" placeholder="https://..." style="width: 100%; padding: 10px 12px; border: 1px solid #e0e8f0; border-radius: 10px;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50;">Status</label>
                            <select id="status" style="width: 100%; padding: 10px 12px; border: 1px solid #e0e8f0; border-radius: 10px;">
                                <option value="publicado" ${noticia?.status === 'publicado' ? 'selected' : ''}>Publicado</option>
                                <option value="rascunho" ${noticia?.status === 'rascunho' ? 'selected' : ''}>Rascunho</option>
                            </select>
                        </div>
                        
                        <button type="submit" style="width: 100%; background: #c9a959; color: white; border: none; padding: 12px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500;">
                            <i class="fas fa-save"></i> Salvar Notícia
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = document.getElementById('formNoticia');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarNoticia(noticia?.id);
            modal.remove();
        });
        
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    },
    
    salvarNoticia(id = null) {
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const textoCompleto = document.getElementById('textoCompleto').value;
        const imagem = document.getElementById('imagem').value || 'https://placehold.co/600x400/c9a959/white?text=Noticia';
        const status = document.getElementById('status').value;
        
        if (!titulo || !descricao || !textoCompleto) {
            alert('⚠️ Preencha todos os campos obrigatórios!');
            return;
        }
        
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        if (id) {
            const index = this.noticias.findIndex(n => n.id === id);
            if (index !== -1) {
                this.noticias[index] = {
                    ...this.noticias[index],
                    titulo, descricao, textoCompleto, imagem, status
                };
            }
        } else {
            this.noticias.unshift({
                id: Date.now().toString(),
                titulo, descricao, textoCompleto, imagem,
                data: hoje, status
            });
        }
        
        this.save();
        this.render(document.getElementById('pageContent'));
        
        if (window.Dashboard && window.Dashboard.currentPage === 'dashboard') {
            window.Dashboard.renderDashboard(document.getElementById('pageContent'));
        }
        
        alert(id ? '✅ Notícia atualizada!' : '✅ Notícia criada!');
    },
    
    excluir(id) {
        if (confirm('⚠️ Excluir esta notícia permanentemente?')) {
            this.noticias = this.noticias.filter(n => n.id !== id);
            this.save();
            this.render(document.getElementById('pageContent'));
            
            if (window.Dashboard && window.Dashboard.currentPage === 'dashboard') {
                window.Dashboard.renderDashboard(document.getElementById('pageContent'));
            }
            
            alert('❌ Notícia excluída!');
        }
    },
    
    escapeHtml(text) {
        if (!text) return '';
        return text.replace(/[&<>]/g, (m) => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
    }
};

// Inicializar
Noticias.init();