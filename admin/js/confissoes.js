// ===== GERENCIAR CONFISSÕES =====

const Confissoes = {
    confissoes: [],
    
    init() {
        this.load();
    },
    
    load() {
        const saved = localStorage.getItem('confessionario_agendamentos');
        if (saved) {
            this.confissoes = JSON.parse(saved);
        } else {
            this.confissoes = [];
        }
    },
    
    save() {
        localStorage.setItem('confessionario_agendamentos', JSON.stringify(this.confissoes));
    },
    
    render(container) {
        this.load();
        
        const total = this.confissoes.length;
        const confirmadas = this.confissoes.filter(c => c.status === 'confirmado').length;
        const pendentes = this.confissoes.filter(c => c.status === 'agendado' || !c.status).length;
        
        container.innerHTML = `
            <style>
                .stat-card { 
                    background: white; 
                    border-radius: 16px; 
                    padding: 16px 24px; 
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    transition: all 0.2s ease;
                    border: 1px solid #eef2f6;
                }
                .stat-card:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
                    border-color: #e0e8f0;
                }
                .confissao-item {
                    background: white;
                    border-radius: 14px;
                    padding: 16px 20px;
                    margin-bottom: 8px;
                    border: 1px solid #eef2f6;
                    transition: all 0.2s ease;
                }
                .confissao-item:hover {
                    background: #fafcfd;
                    border-color: #dce5ec;
                    transform: translateX(2px);
                }
                .btn-icon {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 15px;
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    width: 32px;
                    height: 32px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-icon:hover { transform: scale(1.05); }
                .btn-confirmar { color: #2ecc71; }
                .btn-confirmar:hover { background: #e8f8f0; color: #27ae60; }
                .btn-cancelar { color: #e74c3c; }
                .btn-cancelar:hover { background: #fef0ef; color: #c0392b; }
                .btn-ver { color: #3498db; }
                .btn-ver:hover { background: #e8f4fd; color: #2980b9; }
                .btn-excluir { color: #95a5a6; }
                .btn-excluir:hover { background: #f0f3f5; color: #7f8c8d; }
                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 12px;
                    border-radius: 30px;
                    font-size: 11px;
                    font-weight: 500;
                }
                .badge-agendado { background: #fef9e7; color: #f39c12; }
                .badge-confirmado { background: #e8f8f5; color: #27ae60; }
                .badge-cancelado { background: #fdedec; color: #e74c3c; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
            
            <!-- Estatísticas -->
            <div style="display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap;">
                <div class="stat-card">
                    <div style="font-size: 28px; font-weight: 600; color: #2c3e50;">${total}</div>
                    <div style="color: #7f8c8d; font-size: 13px; margin-top: 4px;">Total de agendamentos</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 28px; font-weight: 600; color: #27ae60;">${confirmadas}</div>
                    <div style="color: #7f8c8d; font-size: 13px; margin-top: 4px;">Confissões confirmadas</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 28px; font-weight: 600; color: #f39c12;">${pendentes}</div>
                    <div style="color: #7f8c8d; font-size: 13px; margin-top: 4px;">Aguardando confirmação</div>
                </div>
            </div>
            
            <!-- Lista de Confissões -->
            <div style="background: white; border-radius: 20px; border: 1px solid #eef2f6; overflow: hidden;">
                <div style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #eef2f6;">
                    <span style="font-weight: 500; color: #2c3e50;">Últimos agendamentos</span>
                </div>
                <div>
                    ${this.confissoes.map(confissao => `
                        <div class="confissao-item" style="margin-bottom: 0; border-radius: 0; border-left: none; border-right: none; border-top: none;">
                            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                                <div style="flex: 2; min-width: 180px;">
                                    <div style="font-weight: 500; color: #2c3e50; font-size: 15px; margin-bottom: 6px;">
                                        ${this.escapeHtml(confissao.nome)}
                                    </div>
                                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                                        <span style="color: #7f8c8d; font-size: 12px;">
                                            <i class="fab fa-whatsapp" style="font-size: 11px; margin-right: 4px; color: #25D366;"></i> ${confissao.whatsapp}
                                        </span>
                                        <span style="color: #7f8c8d; font-size: 12px;">
                                            <i class="far fa-calendar-alt" style="margin-right: 4px;"></i> ${this.formatarData(confissao.data)}
                                        </span>
                                        <span style="color: #7f8c8d; font-size: 12px;">
                                            <i class="far fa-clock" style="margin-right: 4px;"></i> ${confissao.horario}
                                        </span>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span class="badge badge-${confissao.status || 'agendado'}">
                                        <i class="fas ${this.getStatusIcon(confissao.status)}" style="font-size: 10px;"></i>
                                        ${this.getStatusText(confissao.status)}
                                    </span>
                                    <div style="display: flex; gap: 4px;">
                                        ${confissao.status !== 'confirmado' ? `
                                            <button class="btn-icon btn-confirmar" onclick="Confissoes.confirmar('${confissao.id}')" title="Confirmar">
                                                <i class="fas fa-check"></i>
                                            </button>
                                        ` : ''}
                                        ${confissao.status !== 'cancelado' ? `
                                            <button class="btn-icon btn-cancelar" onclick="Confissoes.cancelar('${confissao.id}')" title="Cancelar">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        ` : ''}
                                        <button class="btn-icon btn-ver" onclick="Confissoes.verDetalhes('${confissao.id}')" title="Ver detalhes">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon btn-excluir" onclick="Confissoes.excluir('${confissao.id}')" title="Excluir">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    ${this.confissoes.length === 0 ? `
                        <div style="text-align: center; padding: 60px 20px;">
                            <i class="fas fa-cross" style="font-size: 48px; color: #d0d7de; margin-bottom: 16px;"></i>
                            <p style="color: #8b9eb0; margin: 0;">Nenhuma confissão agendada</p>
                            <p style="color: #b0c4d0; font-size: 13px; margin-top: 8px;">Os agendamentos aparecerão aqui</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    confirmar(id) {
        const index = this.confissoes.findIndex(c => c.id == id);
        if (index !== -1) {
            this.confissoes[index].status = 'confirmado';
            this.save();
            this.render(document.getElementById('pageContent'));
            this.showToast('Confissão confirmada', '#27ae60', 'check-circle');
        }
    },
    
    cancelar(id) {
        this.showConfirmModal('Cancelar Confissão', 'Esta ação marcará a confissão como cancelada.', () => {
            const index = this.confissoes.findIndex(c => c.id == id);
            if (index !== -1) {
                this.confissoes[index].status = 'cancelado';
                this.save();
                this.render(document.getElementById('pageContent'));
                this.showToast('Confissão cancelada', '#e74c3c', 'times-circle');
            }
        });
    },
    
    excluir(id) {
        this.showConfirmModal('Excluir Confissão', 'Esta ação removerá permanentemente o registro.', () => {
            this.confissoes = this.confissoes.filter(c => c.id != id);
            this.save();
            this.render(document.getElementById('pageContent'));
            this.showToast('Registro excluído', '#95a5a6', 'trash-alt');
        });
    },
    
    verDetalhes(id) {
        const c = this.confissoes.find(c => c.id == id);
        if (c) {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
                z-index: 10000; display: flex; align-items: center; justify-content: center;
            `;
            modal.innerHTML = `
                <div style="background: white; border-radius: 24px; width: 90%; max-width: 500px; overflow: hidden; animation: fadeInUp 0.2s ease;">
                    <div style="padding: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="color: #2c3e50; margin: 0; font-size: 18px; font-weight: 500;">
                                <i class="fas fa-cross" style="color: #c9a959; margin-right: 8px;"></i> Detalhes da Confissão
                            </h3>
                            <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #95a5a6;">&times;</button>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <div style="font-size: 11px; color: #8b9eb0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Nome completo</div>
                            <div style="font-size: 16px; font-weight: 500; color: #2c3e50;">${this.escapeHtml(c.nome)}</div>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <div style="font-size: 11px; color: #8b9eb0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">WhatsApp</div>
                            <div style="font-size: 15px; color: #2c3e50;">${c.whatsapp}</div>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <div style="font-size: 11px; color: #8b9eb0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Data e horário</div>
                            <div style="font-size: 15px; color: #2c3e50;">${this.formatarData(c.data)} • ${c.horario}</div>
                        </div>
                        <div style="margin-bottom: 24px;">
                            <div style="font-size: 11px; color: #8b9eb0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Observação</div>
                            <div style="background: #f8fafc; padding: 12px; border-radius: 12px; font-size: 14px; color: #5a6e7c;">${c.observacao || '—'}</div>
                        </div>
                        <div style="margin-bottom: 24px;">
                            <div style="font-size: 11px; color: #8b9eb0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Status</div>
                            <div>
                                <span class="badge badge-${c.status || 'agendado'}">
                                    <i class="fas ${this.getStatusIcon(c.status)}" style="font-size: 10px;"></i>
                                    ${this.getStatusText(c.status)}
                                </span>
                            </div>
                        </div>
                        <button onclick="this.closest('.modal-overlay').remove()" style="width: 100%; background: #c9a959; color: white; border: none; padding: 12px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500;">Fechar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        }
    },
    
    showConfirmModal(title, message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
            z-index: 10000; display: flex; align-items: center; justify-content: center;
        `;
        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; width: 90%; max-width: 380px; overflow: hidden; animation: fadeInUp 0.2s ease;">
                <div style="padding: 28px 24px; text-align: center;">
                    <div style="width: 48px; height: 48px; background: #fef0ef; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                        <i class="fas fa-exclamation" style="font-size: 22px; color: #e74c3c;"></i>
                    </div>
                    <h3 style="color: #2c3e50; margin-bottom: 10px; font-size: 18px; font-weight: 500;">${title}</h3>
                    <p style="color: #7f8c8d; margin-bottom: 28px; font-size: 14px; line-height: 1.5;">${message}</p>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn-cancelar-modal" style="flex: 1; background: white; color: #7f8c8d; border: 1px solid #e0e8f0; padding: 12px; border-radius: 12px; cursor: pointer; font-size: 14px;">Voltar</button>
                        <button class="btn-confirmar-modal" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 12px; cursor: pointer; font-size: 14px;">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.btn-cancelar-modal').onclick = () => modal.remove();
        modal.querySelector('.btn-confirmar-modal').onclick = () => {
            onConfirm();
            modal.remove();
        };
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    },
    
    showToast(msg, color, icon) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; background: white; color: #2c3e50;
            padding: 12px 20px; border-radius: 12px; font-size: 13px; z-index: 10001;
            animation: fadeInUp 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex; align-items: center; gap: 10px; border-left: 3px solid ${color};
        `;
        toast.innerHTML = `<i class="fas fa-${icon}" style="color: ${color};"></i> ${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    },
    
    formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    },
    
    getStatusText(status) {
        const map = { 'agendado': 'Agendado', 'confirmado': 'Confirmado', 'cancelado': 'Cancelado' };
        return map[status] || 'Agendado';
    },
    
    getStatusIcon(status) {
        const map = { 'agendado': 'fa-clock', 'confirmado': 'fa-check-circle', 'cancelado': 'fa-times-circle' };
        return map[status] || 'fa-clock';
    },
    
    escapeHtml(text) {
        if (!text) return '';
        return text.replace(/[&<>]/g, (m) => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
    }
};

Confissoes.init();