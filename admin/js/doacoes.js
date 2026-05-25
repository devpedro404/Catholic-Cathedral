// ===== GERENCIAR DOAÇÕES =====
const Doacoes = {
    doacoes: [],
    
    init() {
        this.load();
    },
    
    load() {
        const saved = localStorage.getItem('admin_doacoes');
        if (saved) {
            this.doacoes = JSON.parse(saved);
        } else {
            // Dados de exemplo
            this.doacoes = [
                {
                    id: '1',
                    nome: 'João Silva',
                    valor: 100,
                    data: '15/12/2024',
                    campanha: 'Manutenção da Igreja',
                    status: 'confirmado'
                },
                {
                    id: '2',
                    nome: 'Maria Santos',
                    valor: 50,
                    data: '14/12/2024',
                    campanha: 'Ação Social',
                    status: 'confirmado'
                },
                {
                    id: '3',
                    nome: 'Anônimo',
                    valor: 200,
                    data: '13/12/2024',
                    campanha: 'Catequese',
                    status: 'pendente'
                }
            ];
            this.save();
        }
    },
    
    save() {
        localStorage.setItem('admin_doacoes', JSON.stringify(this.doacoes));
    },
    
    render(container) {
        this.load();
        const total = this.doacoes.reduce((sum, d) => sum + (d.status === 'confirmado' ? d.valor : 0), 0);
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-hand-holding-heart"></i>
                    <div class="stat-info">
                        <h3>${this.doacoes.length}</h3>
                        <p>Total de Doações</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-dollar-sign"></i>
                    <div class="stat-info">
                        <h3>R$ ${total.toLocaleString('pt-BR')}</h3>
                        <p>Valor Arrecadado</p>
                    </div>
                </div>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Doador</th>
                            <th>Valor</th>
                            <th>Data</th>
                            <th>Campanha</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.doacoes.map(doacao => `
                            <tr>
                                <td>${doacao.nome}</td>
                                <td>R$ ${doacao.valor}</td>
                                <td>${doacao.data}</td>
                                <td>${doacao.campanha}</td>
                                <td><span class="status-badge status-${doacao.status === 'confirmado' ? 'lido' : 'nao-lido'}">${doacao.status === 'confirmado' ? 'Confirmado' : 'Pendente'}</span></td>
                                <td>
                                    <button class="btn-view" onclick="Doacoes.ver('${doacao.id}')"><i class="fas fa-eye"></i></button>
                                    <button class="btn-delete" onclick="Doacoes.excluir('${doacao.id}')"><i class="fas fa-trash"></i></button>
                                 </td>
                             </tr>
                        `).join('')}
                    </tbody>
                 </table>
            </div>
        `;
    },
    
    ver(id) {
        const doacao = this.doacoes.find(d => d.id === id);
        if (doacao) {
            alert(`💰 DOAÇÃO\n\nDoador: ${doacao.nome}\nValor: R$ ${doacao.valor}\nData: ${doacao.data}\nCampanha: ${doacao.campanha}\nStatus: ${doacao.status}`);
        }
    },
    
    excluir(id) {
        if (confirm('Tem certeza que deseja excluir este registro?')) {
            this.doacoes = this.doacoes.filter(d => d.id !== id);
            this.save();
            this.render(document.getElementById('pageContent'));
        }
    }
};

Doacoes.init();