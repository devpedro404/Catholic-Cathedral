// ===== GERENCIAR MENSAGENS DE CONTATO  =====
(function() {
    console.log('Inicializando modulo Contato...');
    
    window.Contato = {
        mensagens: [],
        
        init() {
            console.log('Contato.init() executado');
            this.load();
            this.setupListener();
            this.checkForMessages();
        },
        
        load() {
            const saved = localStorage.getItem('admin_mensagens');
            if (saved) {
                this.mensagens = JSON.parse(saved);
            } else {
                this.mensagens = [];
            }
            
            let modificado = false;
            this.mensagens = this.mensagens.map(msg => {
                if (!msg.id) {
                    modificado = true;
                    return {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                        ...msg
                    };
                }
                return msg;
            });
            
            if (modificado) this.save();
            console.log(`${this.mensagens.length} mensagens carregadas`);
        },
        
        save() {
            localStorage.setItem('admin_mensagens', JSON.stringify(this.mensagens));
        },
        
        setupListener() {
            window.addEventListener('novaMensagem', (e) => {
                console.log('Evento novaMensagem recebido:', e.detail);
                this.adicionarMensagem(e.detail);
            });
            
            window.addEventListener('message', (e) => {
                if (e.data && e.data.type === 'novaMensagem') {
                    console.log('PostMessage recebido:', e.data);
                    this.adicionarMensagem(e.data.dados);
                }
            });
        },
        
        checkForMessages() {
            const pendentes = sessionStorage.getItem('mensagens_pendentes');
            if (pendentes) {
                const msgs = JSON.parse(pendentes);
                msgs.forEach(msg => this.adicionarMensagem(msg));
                sessionStorage.removeItem('mensagens_pendentes');
                console.log('Mensagens pendentes processadas:', msgs.length);
            }
        },
        
        adicionarMensagem(dados) {
            console.log('Adicionando mensagem:', dados);
            
            const novaMensagem = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                nome: dados.nome || dados.name || 'Anonimo',
                email: dados.email || 'sem@email.com',
                mensagem: dados.mensagem || dados.message || 'Sem conteudo',
                data: new Date().toLocaleString('pt-BR'),
                lido: false
            };
            
            this.mensagens.unshift(novaMensagem);
            this.save();
            
            const container = document.getElementById('pageContent');
            if (container && window.location.pathname.includes('dashboard.html')) {
                this.render(container);
            }
            
            console.log('Mensagem adicionada com ID:', novaMensagem.id);
            this.mostrarNotificacao('Nova mensagem recebida!');
        },
        
        mostrarNotificacao(mensagem, tipo = 'sucesso') {
            const notificacao = document.createElement('div');
            notificacao.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${tipo === 'sucesso' ? '#27ae60' : '#e74c3c'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                font-family: Arial, sans-serif;
                animation: slideIn 0.3s ease;
            `;
            notificacao.textContent = mensagem;
            document.body.appendChild(notificacao);
            
            setTimeout(() => {
                notificacao.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notificacao.remove(), 300);
            }, 3000);
        },
        
        render(container) {
            console.log('Renderizando mensagens...');
            this.load();
            
            if (!container) {
                console.error('Container nao encontrado');
                return;
            }
            
            const animacaoCSS = `
                <style>
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                    @keyframes modalFadeIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .contato-botao {
                        margin: 3px;
                        padding: 8px 14px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 500;
                        transition: all 0.3s;
                    }
                    .contato-botao:hover { transform: translateY(-2px); opacity: 0.9; }
                    .btn-view-contato { background: #3498db; color: white; }
                    .btn-read-contato { background: #27ae60; color: white; }
                    .btn-delete-contato { background: #e74c3c; color: white; }
                    .btn-test-contato { background: #9b59b6; color: white; margin-bottom: 15px; padding: 10px 20px; font-size: 14px; }
                    
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                        animation: modalFadeIn 0.3s ease;
                    }
                    .modal-container {
                        background: white;
                        border-radius: 12px;
                        max-width: 500px;
                        width: 90%;
                        max-height: 80vh;
                        overflow: auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .modal-header {
                        padding: 20px;
                        border-bottom: 1px solid #eee;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .modal-header h3 {
                        margin: 0;
                        color: #2c3e50;
                    }
                    .modal-close {
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #999;
                        transition: color 0.3s;
                    }
                    .modal-close:hover { color: #e74c3c; }
                    .modal-body {
                        padding: 20px;
                    }
                    .modal-footer {
                        padding: 15px 20px;
                        border-top: 1px solid #eee;
                        display: flex;
                        justify-content: flex-end;
                        gap: 10px;
                    }
                    .modal-btn {
                        padding: 8px 20px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.3s;
                    }
                    .modal-btn-primary {
                        background: #c9a959;
                        color: white;
                    }
                    .modal-btn-primary:hover { background: #b8943f; }
                    .modal-btn-secondary {
                        background: #95a5a6;
                        color: white;
                    }
                    .modal-btn-secondary:hover { background: #7f8c8d; }
                    .modal-btn-danger {
                        background: #e74c3c;
                        color: white;
                    }
                    .modal-btn-danger:hover { background: #c0392b; }
                    .mensagem-detalhe {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        margin-top: 15px;
                        line-height: 1.6;
                    }
                    .campo-info {
                        margin-bottom: 12px;
                    }
                    .campo-info label {
                        font-weight: bold;
                        color: #2c3e50;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .campo-info p {
                        margin: 0;
                        color: #555;
                    }
                </style>
            `;
            
            let html = animacaoCSS + `
                <button class="contato-botao btn-test-contato" id="testMessageBtn">
                + Adicionar Mensagem de Teste
                </button>
                
                <div class="data-table">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ddd; padding:12px;">Nome</th>
                                <th style="border:1px solid #ddd; padding:12px;">E-mail</th>
                                <th style="border:1px solid #ddd; padding:12px;">Mensagem</th>
                                <th style="border:1px solid #ddd; padding:12px;">Data</th>
                                <th style="border:1px solid #ddd; padding:12px;">Status</th>
                                <th style="border:1px solid #ddd; padding:12px;">Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            if (this.mensagens.length === 0) {
                html += `<tr><td colspan="6" style="text-align:center;padding:60px;">Nenhuma mensagem recebida<br><small>Clique no botao acima para testar</small></td></tr>`;
            } else {
                for (const msg of this.mensagens) {
                    if (!msg.id) continue;
                    html += `
                        <tr>
                            <td style="border:1px solid #ddd; padding:10px;">${this.escapeHtml(msg.nome)}</td>
                            <td style="border:1px solid #ddd; padding:10px;">${this.escapeHtml(msg.email)}</td>
                            <td style="border:1px solid #ddd; padding:10px;">${this.escapeHtml(msg.mensagem.substring(0, 50))}${msg.mensagem.length > 50 ? '...' : ''}</td>
                            <td style="border:1px solid #ddd; padding:10px;">${msg.data}</td>
                            <td style="border:1px solid #ddd; padding:10px;">
                                <span style="padding:4px 10px; border-radius:4px; background:${msg.lido ? '#27ae60' : '#e74c3c'}; color:white; font-size:12px;">
                                    ${msg.lido ? 'Lido' : 'Nao lido'}
                                </span>
                            </td>
                            <td style="border:1px solid #ddd; padding:10px;">
                                <button class="contato-botao btn-view-contato" data-id="${msg.id}" data-action="ver">
                                    Ver Detalhes
                                </button>
                                <button class="contato-botao btn-read-contato" data-id="${msg.id}" data-action="marcarLido">
                                    Marcar Lido
                                </button>
                                <button class="contato-botao btn-delete-contato" data-id="${msg.id}" data-action="excluir">
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    `;
                }
            }
            
            html += `</tbody></table></div>`;
            container.innerHTML = html;
            
            this.adicionarEventos();
            
            const testBtn = document.getElementById('testMessageBtn');
            if (testBtn) {
                testBtn.onclick = () => this.modalAdicionarMensagem();
            }
        },
        
        modalAdicionarMensagem() {
            const modalHTML = `
                <div class="modal-overlay" id="modalAdicionar">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3>Adicionar Mensagem de Teste</h3>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="campo-info">
                                <label>Nome:</label>
                                <input type="text" id="modalNome" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;" placeholder="Digite o nome">
                            </div>
                            <div class="campo-info">
                                <label>E-mail:</label>
                                <input type="email" id="modalEmail" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;" placeholder="Digite o e-mail">
                            </div>
                            <div class="campo-info">
                                <label>Mensagem:</label>
                                <textarea id="modalMensagem" rows="4" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;" placeholder="Digite a mensagem"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                            <button class="modal-btn modal-btn-primary" id="btnSalvarMensagem">Salvar Mensagem</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            document.getElementById('btnSalvarMensagem').onclick = () => {
                const nome = document.getElementById('modalNome').value;
                const email = document.getElementById('modalEmail').value;
                const mensagem = document.getElementById('modalMensagem').value;
                
                if (nome && email && mensagem) {
                    this.adicionarMensagem({ nome, email, mensagem });
                    document.querySelector('.modal-overlay').remove();
                    this.mostrarNotificacao('Mensagem adicionada com sucesso!');
                } else {
                    alert('Preencha todos os campos!');
                }
            };
        },
        
        adicionarEventos() {
            const container = document.getElementById('pageContent');
            if (!container) return;
            
            if (this.clickHandler) {
                container.removeEventListener('click', this.clickHandler);
            }
            
            this.clickHandler = (event) => {
                const button = event.target.closest('button[data-action]');
                if (!button) return;
                
                event.preventDefault();
                event.stopPropagation();
                
                const id = button.getAttribute('data-id');
                const action = button.getAttribute('data-action');
                
                console.log(`Clique: ${action}, ID: ${id}`);
                
                if (!id || id === 'undefined') {
                    this.mostrarNotificacao('Erro: ID da mensagem invalido', 'erro');
                    return;
                }
                
                if (action === 'ver') this.modalVerMensagem(id);
                else if (action === 'marcarLido') this.modalMarcarLido(id);
                else if (action === 'excluir') this.modalExcluirMensagem(id);
            };
            
            container.addEventListener('click', this.clickHandler);
        },
        
        modalVerMensagem(id) {
            const msg = this.mensagens.find(m => m.id === id);
            if (!msg) return;
            
            const modalHTML = `
                <div class="modal-overlay" id="modalVer">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3>Detalhes da Mensagem</h3>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="campo-info">
                                <label>Nome:</label>
                                <p><strong>${this.escapeHtml(msg.nome)}</strong></p>
                            </div>
                            <div class="campo-info">
                                <label>E-mail:</label>
                                <p><strong>${this.escapeHtml(msg.email)}</strong></p>
                            </div>
                            <div class="campo-info">
                                <label>Data de Envio:</label>
                                <p><strong>${msg.data}</strong></p>
                            </div>
                            <div class="campo-info">
                                <label>Status:</label>
                                <p><span style="padding:4px 10px; border-radius:4px; background:${msg.lido ? '#27ae60' : '#e74c3c'}; color:white; font-size:12px;">
                                    ${msg.lido ? 'Lido' : 'Nao lido'}
                                </span></p>
                            </div>
                            <div class="mensagem-detalhe">
                                <label>Mensagem:</label>
                                <p style="margin-top:10px; white-space: pre-wrap;">${this.escapeHtml(msg.mensagem)}</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">Fechar</button>
                            ${!msg.lido ? `<button class="modal-btn modal-btn-primary" id="marcarLidoModal">Marcar como Lido</button>` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            if (!msg.lido) {
                const btnMarcar = document.getElementById('marcarLidoModal');
                if (btnMarcar) {
                    btnMarcar.onclick = () => {
                        this.marcarLido(id);
                        document.querySelector('.modal-overlay').remove();
                        this.mostrarNotificacao('Mensagem marcada como lida!');
                    };
                }
            }
        },
        
        modalMarcarLido(id) {
            const modalHTML = `
                <div class="modal-overlay">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3>Confirmar</h3>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                        </div>
                        <div class="modal-body">
                            <p>Tem certeza que deseja marcar esta mensagem como <strong>LIDA</strong>?</p>
                            <p style="color: #666; font-size: 14px;">Esta acao pode ser desfeita posteriormente.</p>
                        </div>
                        <div class="modal-footer">
                            <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                            <button class="modal-btn modal-btn-primary" id="confirmarMarcarLido">Confirmar</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            document.getElementById('confirmarMarcarLido').onclick = () => {
                this.marcarLido(id);
                document.querySelector('.modal-overlay').remove();
                this.mostrarNotificacao('Mensagem marcada como lida!');
            };
        },
        
        modalExcluirMensagem(id) {
            const modalHTML = `
                <div class="modal-overlay">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3>Confirmar Exclusao</h3>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                        </div>
                        <div class="modal-body">
                            <p style="color: #e74c3c; font-weight: bold;">Atencao!</p>
                            <p>Tem certeza que deseja excluir esta mensagem <strong>permanentemente</strong>?</p>
                            <p style="color: #666; font-size: 14px;">Esta acao nao pode ser desfeita.</p>
                        </div>
                        <div class="modal-footer">
                            <button class="modal-btn modal-btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                            <button class="modal-btn modal-btn-danger" id="confirmarExcluir">Excluir Permanentemente</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            document.getElementById('confirmarExcluir').onclick = () => {
                this.excluir(id);
                document.querySelector('.modal-overlay').remove();
                this.mostrarNotificacao('Mensagem excluida com sucesso!');
            };
        },
        
        escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },
        
        ver(id) {
            this.modalVerMensagem(id);
        },
        
        marcarLido(id) {
            const index = this.mensagens.findIndex(m => m.id === id);
            if (index !== -1) {
                this.mensagens[index].lido = true;
                this.save();
                const container = document.getElementById('pageContent');
                if (container) this.render(container);
            }
        },
        
        excluir(id) {
            this.mensagens = this.mensagens.filter(m => m.id !== id);
            this.save();
            const container = document.getElementById('pageContent');
            if (container) this.render(container);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.Contato.init());
    } else {
        window.Contato.init();
    }
})();