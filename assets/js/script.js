// ===== MÓDULO DE UTILIDADES =====
const Utils = {
    // Debounce para otimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Formatar data
    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Salvar no localStorage
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
            return false;
        }
    },

    // Carregar do localStorage
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Erro ao carregar do localStorage:', e);
            return null;
        }
    }
};

// ===== MÓDULO DO MENU MOBILE =====
const MobileMenu = {
    hamburger: null,
    navMenu: null,
    body: null,

    init() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.body = document.body;

        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        this.closeMenuOnLinkClick();
        this.closeOnResize();
        this.closeOnClickOutside();
    },

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.body.classList.toggle('menu-open');
        
        // Animar o hambúrguer
        const bars = document.querySelectorAll('.bar');
        if (this.navMenu.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            this.body.style.overflow = 'hidden';
        } else {
            bars[0].style.transform = 'rotate(0) translate(0, 0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'rotate(0) translate(0, 0)';
            this.body.style.overflow = '';
        }
    },

    closeMenu() {
        if (this.navMenu.classList.contains('active')) {
            this.hamburger.classList.remove('active');
            this.navMenu.classList.remove('active');
            this.body.classList.remove('menu-open');
            this.body.style.overflow = '';
            
            const bars = document.querySelectorAll('.bar');
            bars[0].style.transform = 'rotate(0) translate(0, 0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    },

    closeMenuOnLinkClick() {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    },

    closeOnResize() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    },

    closeOnClickOutside() {
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                    this.closeMenu();
                }
            }
        });
    }
};

// ===== MÓDULO DE NAVEGAÇÃO SUAVE =====
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    history.pushState(null, null, href);
                }
            });
        });
    }
};

// ===== MÓDULO DO HEADER =====
const HeaderScroll = {
    header: null,
    
    init() {
        this.header = document.querySelector('.navbar');
        if (!this.header) return;
        
        window.addEventListener('scroll', Utils.debounce(() => this.handleScroll(), 10));
        this.handleScroll();
    },
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
};

// ===== MÓDULO DE FORMULÁRIO =====
const ContactForm = {
    form: null,
    messageDiv: null,

    init() {
        this.form = document.getElementById('contactForm');
        this.messageDiv = document.getElementById('formMensagem');

        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.addInputValidation();
    },

    validateForm(data) {
        const errors = {};
        
        if (!data.get('nome') || data.get('nome').trim().length < 3) {
            errors.nome = 'Nome deve ter pelo menos 3 caracteres';
        }
        
        if (!data.get('email') || !this.validateEmail(data.get('email'))) {
            errors.email = 'Email inválido';
        }
        
        if (!data.get('mensagem') || data.get('mensagem').trim().length < 10) {
            errors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres';
        }
        
        return errors;
    },
    
    validateEmail(email) {
        const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        return re.test(email);
    },

    addInputValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('focus', () => {
                this.removeFieldError(input);
            });
        });
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(field.id) {
            case 'nome':
                if (value.length < 3 && value !== '') {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 3 caracteres';
                }
                break;
            case 'email':
                if (value !== '' && !this.validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'Email inválido';
                }
                break;
            case 'mensagem':
                if (value.length < 10 && value !== '') {
                    isValid = false;
                    errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.removeFieldError(field);
        }

        return isValid;
    },

    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #721c24;
            font-size: 0.8rem;
            margin-top: -0.8rem;
            margin-bottom: 0.8rem;
        `;
        errorDiv.textContent = message;
        
        this.removeFieldError(field);
        field.style.borderColor = '#f5c6cb';
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    },
    
    removeFieldError(field) {
        field.style.borderColor = '#ddd';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        
        const errors = this.validateForm(formData);
        
        if (Object.keys(errors).length > 0) {
            this.showMessage('Por favor, corrija os erros no formulário.', 'error');
            
            Object.keys(errors).forEach(field => {
                const fieldElement = this.form.querySelector(`#${field}`);
                if (fieldElement) {
                    this.showFieldError(fieldElement, errors[field]);
                }
            });
            return;
        }
        
        await this.submitToFormspree(formData);
    },
    
    async submitToFormspree(formData) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.showMessage('✅ Mensagem enviada com sucesso! Em breve entraremos em contato.', 'success');
                this.form.reset();
            } else {
                throw new Error('Erro ao enviar mensagem');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showMessage('❌ Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    },
    
    showMessage(message, type) {
        if (!this.messageDiv) return;

        this.messageDiv.textContent = message;
        this.messageDiv.className = `form-message ${type}`;
        this.messageDiv.style.display = 'block';
        this.messageDiv.style.padding = '1rem';
        this.messageDiv.style.marginTop = '1rem';
        this.messageDiv.style.borderRadius = '8px';
        this.messageDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        this.messageDiv.style.color = type === 'success' ? '#155724' : '#721c24';
        this.messageDiv.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;

        setTimeout(() => {
            this.messageDiv.style.display = 'none';
        }, 5000);
    }
};

// ===== MÓDULO DA GALERIA (LIGHTBOX) =====
const Gallery = {
    images: [],
    currentIndex: 0,
    lightbox: null,
    
    init() {
        this.images = document.querySelectorAll('.galeria-grid img');
        if (this.images.length === 0) return;
        
        this.createLightbox();
        this.addClickEvents();
        this.addKeyboardEvents();
    },
    
    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        `;
        
        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 90%;
            max-height: 80%;
            object-fit: contain;
            border-radius: 8px;
        `;
        
        const caption = document.createElement('p');
        caption.style.cssText = `
            color: white;
            margin-top: 1rem;
            text-align: center;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 10px;
            min-width: 44px;
            min-height: 44px;
        `;
        
        const prevBtn = this.createNavButton('❮', 'prev');
        const nextBtn = this.createNavButton('❯', 'next');
        
        this.lightbox.appendChild(closeBtn);
        this.lightbox.appendChild(prevBtn);
        this.lightbox.appendChild(nextBtn);
        this.lightbox.appendChild(img);
        this.lightbox.appendChild(caption);
        
        document.body.appendChild(this.lightbox);
        
        closeBtn.addEventListener('click', () => this.close());
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prev();
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.next();
        });
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.close();
        });
    },
    
    createNavButton(text, className) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = `lightbox-nav ${className}`;
        btn.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 3rem;
            cursor: pointer;
            padding: 20px;
            min-width: 60px;
            min-height: 60px;
            border-radius: 50%;
            transition: all 0.3s;
        `;
        
        if (className === 'prev') {
            btn.style.left = '20px';
        } else {
            btn.style.right = '20px';
        }
        
        return btn;
    },
    
    addClickEvents() {
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => this.open(index));
            img.setAttribute('data-index', index);
        });
    },
    
    addKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.lightbox && this.lightbox.style.display === 'flex') {
                if (e.key === 'Escape') this.close();
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            }
        });
    },
    
    open(index) {
        this.currentIndex = index;
        this.updateLightboxImage();
        this.lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },
    
    updateLightboxImage() {
        const img = this.lightbox.querySelector('img');
        const caption = this.lightbox.querySelector('p');
        const currentImg = this.images[this.currentIndex];
        
        img.src = currentImg.src;
        img.alt = currentImg.alt;
        caption.textContent = currentImg.alt || `Imagem ${this.currentIndex + 1} de ${this.images.length}`;
    },
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    },
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    },
    
    close() {
        this.lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }
};

// ===== MÓDULO DE NOTÍCIAS =====
const News = {
    container: null,
    
    init() {
        this.container = document.querySelector('.noticias-grid');
        if (this.container) {
            this.loadNews();
        }
    },
    
    async loadNews() {
        const newsData = [
            {
                title: 'Missão Especial de Natal',
                description: 'Participe da nossa missão especial de Natal com toda comunidade.',
                date: '2024-12-24',
                image: '/noticia1.jpg'
            },
            {
                title: 'Retiro Espiritual 2024',
                description: 'Inscrições abertas para o retiro espiritual de verão.',
                date: '2024-01-15',
                image: '/noticia2.jpg'
            }
        ];
        
        this.renderNews(newsData);
    },
    
    renderNews(news) {
        this.container.innerHTML = news.map(item => `
            <article class="noticia-card">
                <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='https://placehold.co/400x200?text=Imagem+Indisponível'">
                <div class="noticia-content">
                    <h3>${item.title}</h3>
                    <small>${Utils.formatDate(item.date)}</small>
                    <p>${item.description}</p>
                    <a href="#" class="btn-small">Leia mais</a>
                </div>
            </article>
        `).join('');
    }
};

// ===== MÓDULO DE ANIMAÇÃO SCROLL =====
const ScrollAnimation = {
    elements: null,
    
    init() {
        this.elements = document.querySelectorAll('.sobre, .horarios, .noticias, .galeria, .contato, .transmissao, .liturgia, .confessionario, .doacoes');
        
        if (this.elements.length === 0) return;
        
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
        });
        
        this.checkVisibility();
        window.addEventListener('scroll', Utils.debounce(() => this.checkVisibility(), 100));
    },
    
    checkVisibility() {
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }
};

// ===== INICIALIZAÇÃO PRINCIPAL =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos os módulos
    MobileMenu.init();
    SmoothScroll.init();
    HeaderScroll.init();
    ContactForm.init();
    Gallery.init();
    News.init();
    ScrollAnimation.init();
    
    // Inicializar WhatsApp
    setTimeout(() => {
        if (typeof WhatsAppFloat !== 'undefined') {
            WhatsAppFloat.init();
        }
    }, 100);
    
    // Inicializar Liturgia
    setTimeout(() => {
        if (document.getElementById('liturgia') && typeof LiturgiaCalendario !== 'undefined') {
            LiturgiaCalendario.init();
        }
    }, 100);
    
    // Inicializar Transmissão
    setTimeout(() => {
        if (document.getElementById('transmissao') && typeof Transmissao !== 'undefined') {
            Transmissao.init();
        }
    }, 100);
    
    // Inicializar Doações
    setTimeout(() => {
        if (document.getElementById('doacoes') && typeof Doacoes !== 'undefined') {
            Doacoes.init();
        }
    }, 100);
    
    // Inicializar Confessionário
    setTimeout(() => {
        if (document.getElementById('confessionario') && typeof Confessionario !== 'undefined') {
            Confessionario.init();
        }
    }, 100);
    
    // Atualizar navegação ativa
    const updateActiveNav = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionId = section.getAttribute('id');
            
            if (rect.top <= 150 && rect.bottom >= 150) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', Utils.debounce(updateActiveNav, 100));
    updateActiveNav();
});

// ===== MÓDULO DO WHATSAPP FLUTUANTE =====
const WhatsAppFloat = {
    phoneNumber: '5511999999999',
    defaultMessage: 'Olá! Gostaria de mais informações sobre a Catedral Metropolitana.',
    
    init() {
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        this.button = document.querySelector('.whatsapp-button');
        
        if (this.button) {
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendDirectMessage();
            });
        }
    },
    
    sendDirectMessage() {
        this.sendToWhatsApp(this.defaultMessage);
    },
    
    sendToWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    },
    
    sendCustomMessage(message) {
        this.sendToWhatsApp(message);
    }
};

// ===== CALENDÁRIO LITÚRGICO =====
const LiturgiaCalendario = {
    currentDate: new Date(),
    
    init() {
        this.setupEventListeners();
        this.loadLiturgia(this.currentDate);
    },
    
    setupEventListeners() {
        const prevBtn = document.getElementById('prevDay');
        const nextBtn = document.getElementById('nextDay');
        const todayBtn = document.getElementById('todayBtn');
        const datePicker = document.getElementById('liturgiaDate');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.changeDate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.changeDate(1));
        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());
        if (datePicker) datePicker.addEventListener('change', (e) => {
            this.currentDate = new Date(e.target.value);
            this.loadLiturgia(this.currentDate);
        });
    },
    
    changeDate(days) {
        const newDate = new Date(this.currentDate);
        newDate.setDate(newDate.getDate() + days);
        this.currentDate = newDate;
        this.loadLiturgia(this.currentDate);
    },
    
    goToToday() {
        this.currentDate = new Date();
        this.loadLiturgia(this.currentDate);
        const datePicker = document.getElementById('liturgiaDate');
        if (datePicker) datePicker.value = this.formatDateForInput(this.currentDate);
    },
    
    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    },
    
    formatDisplayDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    },
    
    async loadLiturgia(date) {
        this.showLoading();
        
        const displayDate = document.getElementById('displayDate');
        const datePicker = document.getElementById('liturgiaDate');
        
        if (displayDate) displayDate.textContent = this.formatDisplayDate(date);
        if (datePicker) datePicker.value = this.formatDateForInput(date);
        
        const liturgiaData = await this.getLocalDataWithSaint(date);
        if (liturgiaData) {
            this.renderLiturgia(liturgiaData);
        }
    },
    
    async getLocalDataWithSaint(date) {
        const santo = this.getLocalSaintData(date);
        const epoca = this.getEpificaLiturgica(date);
        
        return {
            santo: santo,
            leituras: this.getLocalLeituras(date),
            informacoes: {
                epoca: epoca,
                cor: this.getCorLiturgica(epoca),
                semana: `${this.getSemanaLiturgica(date)}ª Semana do ${epoca}`,
                dia: this.getTipoDia(date)
            },
            evangelho: this.getLocalEvangelho(date),
            reflexao: this.getReflexaoDoDia(date)
        };
    },
    
    getLocalSaintData(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const key = `${month}-${day}`;
        
        const santosDatabase = {
            '1-1': { nome: 'Santa Maria, Mãe de Deus', descricao: 'Solenidade da Santíssima Mãe de Deus' },
            '12-25': { nome: 'Natal do Senhor', descricao: 'Natividade de Nosso Senhor Jesus Cristo' }
        };
        
        return santosDatabase[key] || { 
            nome: 'Santos do Dia', 
            descricao: 'Inúmeros são os santos que hoje celebramos.' 
        };
    },
    
    getLocalLeituras(date) {
        return {
            primeira: 'Leitura do Livro do Profeta Isaías (Is 60,1-6)',
            salmo: 'Salmo 71 (72) - Os reis de todos os povos hão de adorar-vos, ó Senhor!',
            segunda: '',
            evangelho: 'Evangelho de Jesus Cristo segundo Mateus (Mt 2,1-12)'
        };
    },
    
    getLocalEvangelho(date) {
        return {
            texto: 'Tendo Jesus nascido em Belém da Judeia, no tempo do rei Herodes, eis que magos vindos do Oriente chegaram a Jerusalém.',
            localizacao: 'Mateus 2, 1-12'
        };
    },
    
    getEpificaLiturgica(date) {
        const month = date.getMonth();
        const day = date.getDate();
        
        if (month === 11 && day >= 25) return 'Natal';
        if (month === 0 && day <= 6) return 'Natal';
        return 'Tempo Comum';
    },
    
    getCorLiturgica(epoca) {
        const cores = {
            'Tempo Comum': 'verde',
            'Natal': 'branco'
        };
        return cores[epoca] || 'verde';
    },
    
    getSemanaLiturgica(date) {
        return Math.floor(date.getDate() / 7) + 1;
    },
    
    getTipoDia(date) {
        const day = date.getDay();
        if (day === 0) return 'Domingo';
        if (day === 6) return 'Sábado';
        return 'Dia da semana';
    },
    
    getReflexaoDoDia(date) {
        const reflexoes = [
            '"A alegria do Senhor é a vossa força." (Neemias 8,10)',
            '"Sede santos, porque eu sou santo." (Levítico 11,45)'
        ];
        return reflexoes[date.getDate() % reflexoes.length];
    },
    
    renderLiturgia(data) {
        this.renderSanto(data.santo);
        this.renderLeituras(data.leituras);
        this.renderInfo(data.informacoes);
        this.renderEvangelho(data.evangelho);
        this.renderReflexao(data.reflexao);
    },
    
    renderSanto(santo) {
        const container = document.getElementById('santoContent');
        if (container) {
            container.innerHTML = `
                <div class="santo-nome">${santo.nome}</div>
                <div class="santo-descricao">${santo.descricao}</div>
            `;
        }
    },
    
    renderLeituras(leituras) {
        const container = document.getElementById('leiturasContent');
        if (container) {
            container.innerHTML = `
                <div class="leitura-item">
                    <div class="leitura-titulo"> Primeira Leitura</div>
                    <div class="leitura-texto">${leituras.primeira}</div>
                </div>
                <div class="leitura-item">
                    <div class="leitura-titulo"> Salmo Responsorial</div>
                    <div class="leitura-texto">${leituras.salmo}</div>
                </div>
            `;
        }
    },
    
    renderInfo(informacoes) {
        const container = document.getElementById('infoContent');
        if (container) {
            const corClass = `cor-${informacoes.cor}`;
            container.innerHTML = `
                <div class="info-item">
                    <span class="info-label">Época Litúrgica:</span>
                    <span class="info-value">${informacoes.epoca}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Cor Litúrgica:</span>
                    <span class="info-value">
                        <span class="cor-liturgica ${corClass}"></span>
                        ${informacoes.cor}
                    </span>
                </div>
            `;
        }
    },
    
    renderEvangelho(evangelho) {
        const container = document.getElementById('evangelhoContent');
        if (container) {
            container.innerHTML = `
                <div class="evangelho-texto">"${evangelho.texto}"</div>
                <div class="evangelho-local">— ${evangelho.localizacao}</div>
            `;
        }
    },
    
    renderReflexao(reflexao) {
        const container = document.getElementById('reflexaoContent');
        if (container) {
            container.innerHTML = `<p>${reflexao}</p>`;
        }
    },
    
    showLoading() {
        const containers = ['santoContent', 'leiturasContent', 'infoContent', 'evangelhoContent'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '<div class="loading-spinner"></div>';
            }
        });
    }
};

// ===== MÓDULO DE TRANSMISSÃO =====
const Transmissao = {
    videoUrl: 'https://www.youtube.com/embed/2IpBdiI9KGM',
    isLive: true,
    
    init() {
        this.updatePlayer();
        this.checkLiveStatus();
    },
    
    updatePlayer() {
        const player = document.getElementById('youtubePlayer');
        if (player && this.videoUrl) {
            player.src = this.videoUrl;
        }
    },
    
    checkLiveStatus() {
        const liveBadge = document.getElementById('liveBadge');
        const liveTitle = document.getElementById('liveTitle');
        
        if (this.isLive) {
            if (liveBadge) {
                liveBadge.innerHTML = '🔴 AO VIVO';
                liveBadge.style.background = '#ff0000';
            }
            if (liveTitle) {
                liveTitle.innerHTML = 'Missa ao Vivo - Participe agora!';
            }
        }
    }
};

// ===== MÓDULO DE DOAÇÕES =====
const Doacoes = {
    valorSelecionado: null,
    chavePix: '00020126360014BR.GOV.BCB.PIX0114contato@catedral.com520400005303986540510.005802BR5925Catedral Metropolitana6009SAO PAULO62070503***6304B2A3',
    
    init() {
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        document.querySelectorAll('.valor-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const valor = btn.getAttribute('data-valor');
                this.selecionarValor(valor);
            });
        });
        
        const gerarBtn = document.getElementById('gerarPixBtn');
        if (gerarBtn) {
            gerarBtn.addEventListener('click', () => this.gerarQRCode());
        }
        
        const copiarBtn = document.getElementById('copiarChave');
        if (copiarBtn) {
            copiarBtn.addEventListener('click', () => this.copiarChavePix());
        }
    },
    
    selecionarValor(valor) {
        document.querySelectorAll('.valor-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        if (valor === 'custom') {
            document.getElementById('valorPersonalizado').style.display = 'block';
            this.valorSelecionado = null;
        } else {
            document.getElementById('valorPersonalizado').style.display = 'none';
            this.valorSelecionado = parseFloat(valor);
        }
    },
    
    gerarQRCode() {
        if (!this.valorSelecionado) {
            alert('Selecione um valor primeiro');
            return;
        }
        
        const chaveArea = document.getElementById('chavePixArea');
        if (chaveArea) {
            chaveArea.style.display = 'block';
        }
        
        const qrArea = document.getElementById('qrCodeArea');
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(this.chavePix)}`;
        
        if (qrArea) {
            qrArea.innerHTML = `<img src="${qrUrl}" alt="QR Code PIX" width="200" height="200">`;
        }
    },
    
    copiarChavePix() {
        navigator.clipboard.writeText(this.chavePix);
        alert('Chave PIX copiada!');
    }
};

// ===== MÓDULO DO CONFESSIONÁRIO =====
const Confessionario = {
    horariosDisponiveis: {
        1: ['12:30', '18:30'],
        2: ['12:30', '18:30'],
        3: ['12:30', '18:30'],
        4: ['12:30', '18:30'],
        5: ['12:30', '18:30'],
        6: ['16:00', '16:30', '17:00', '17:30'],
        0: ['07:00', '07:30', '17:00', '17:30']
    },
    
    agendamentos: [],
    
    init() {
        this.loadAgendamentos();
        this.setupDatePicker();
        this.setupFormSubmit();
        this.updateStats();
    },
    
    loadAgendamentos() {
        const saved = localStorage.getItem('confessionario_agendamentos');
        if (saved) {
            this.agendamentos = JSON.parse(saved);
        }
    },
    
    saveAgendamentos() {
        localStorage.setItem('confessionario_agendamentos', JSON.stringify(this.agendamentos));
        this.updateStats();
    },
    
    setupDatePicker() {
        const dateInput = document.getElementById('confData');
        if (!dateInput) return;
        
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
        
        dateInput.addEventListener('change', () => {
            this.updateHorariosDisponiveis();
        });
    },
    
    updateHorariosDisponiveis() {
        const dateInput = document.getElementById('confData');
        const horarioSelect = document.getElementById('confHorario');
        
        if (!dateInput || !dateInput.value) return;
        
        const selectedDate = new Date(dateInput.value);
        const dayOfWeek = selectedDate.getDay();
        let horariosBase = this.horariosDisponiveis[dayOfWeek] || [];
        
        horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
        horariosBase.forEach(horario => {
            horarioSelect.innerHTML += `<option value="${horario}">${horario}</option>`;
        });
    },
    
    setupFormSubmit() {
        const form = document.getElementById('formConfessionario');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.agendarConfissao();
        });
    },
    
    agendarConfissao() {
        const nome = document.getElementById('confNome').value;
        const whatsapp = document.getElementById('confWhatsapp').value;
        const data = document.getElementById('confData').value;
        const horario = document.getElementById('confHorario').value;
        const anonimo = document.getElementById('confAnonimo').checked;
        
        if (!whatsapp || !data || !horario) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }
        
        const agendamento = {
            id: Date.now(),
            nome: anonimo ? 'Anônimo' : (nome || 'Não informado'),
            whatsapp: whatsapp,
            data: data,
            horario: horario,
            dataAgendamento: new Date().toISOString()
        };
        
        this.agendamentos.push(agendamento);
        this.saveAgendamentos();
        
        const formDiv = document.getElementById('formConfessionario');
        const msgDiv = document.getElementById('msgConfirmacao');
        
        if (formDiv && msgDiv) {
            formDiv.style.display = 'none';
            msgDiv.style.display = 'block';
        }
    },
    
    formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    },
    
    updateStats() {
        const totalSpan = document.getElementById('totalAgendamentos');
        if (totalSpan) {
            totalSpan.textContent = this.agendamentos.length;
        }
    }
};

// Exportar para uso global
window.app = {
    MobileMenu,
    Gallery,
    ContactForm,
    WhatsAppFloat,
    LiturgiaCalendario,
    Transmissao,
    Doacoes,
    Confessionario
};

// ===== SINCronIZAÇÃO COM O ADMIN =====

// Carregar notícias do admin
function carregarNoticiasAdmin() {
    const noticias = JSON.parse(localStorage.getItem('site_noticias') || '[]');
    const container = document.querySelector('.noticias-grid');
    
    if (container && noticias.length > 0) {
        container.innerHTML = noticias.map(noticia => `
            <article class="noticia-card">
                <img src="${noticia.imagem}" alt="${noticia.titulo}" onerror="this.src='https://placehold.co/400x200?text=Imagem'">
                <div class="noticia-content">
                    <h3>${noticia.titulo}</h3>
                    <small>${noticia.data}</small>
                    <p>${noticia.descricao}</p>
                    <a href="#" class="btn-small">Leia mais</a>
                </div>
            </article>
        `).join('');
    }
}

// Capturar mensagens do formulário de contato e enviar para o admin
const formContato = document.getElementById('contactForm');
if (formContato) {
    formContato.addEventListener('submit', function(e) {
        // O código existente continua...
        
        // Após enviar, salvar no localStorage para o admin
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;
        
        const novaMensagem = {
            nome: nome,
            email: email,
            mensagem: mensagem,
            data: new Date().toLocaleString('pt-BR'),
            lido: false
        };
        
        const mensagens = JSON.parse(localStorage.getItem('admin_mensagens') || '[]');
        mensagens.unshift(novaMensagem);
        localStorage.setItem('admin_mensagens', JSON.stringify(mensagens));
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('novaMensagem', { detail: novaMensagem }));
    });
}

// Carregar notícias ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarNoticiasAdmin();
    
    // Ouvir atualizações de notícias
    window.addEventListener('noticiasAtualizadas', () => {
        carregarNoticiasAdmin();
    });
});

// ===== TESTE COMPLETO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("1. DOM carregado");
    
    const botoes = document.querySelectorAll('.btn-small');
    console.log("2. Botões encontrados:", botoes.length);
    
    if (botoes.length > 0) {
        botoes.forEach(function(botao, index) {
            console.log("   Botão", index + 1, "data-id:", botao.getAttribute('data-id'));
            
            botao.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log("3. CLIQUE DETECTADO no botão", index + 1);
                
                const id = this.getAttribute('data-id');
                console.log("4. ID da notícia:", id);
                
                // Tentar abrir o modal diretamente
                const modal = document.getElementById('modalNoticia');
                console.log("5. Modal encontrado?", modal !== null);
                
                if (modal) {
                    modal.style.display = 'flex';
                    console.log("6. Modal aberto via JavaScript puro!");
                } else {
                    console.log("6. ERRO: Modal não encontrado!");
                }
                
                alert("Teste: clique funcionou! ID: " + id);
                
                return false;
            });
        });
    } else {
        console.log("ERRO: Nenhum botão .btn-small encontrado!");
        alert("ERRO: Nenhum botão 'Leia mais' encontrado! Verifique o HTML.");
    }
    
    // Verificar se o modal existe no HTML
    const modal = document.getElementById('modalNoticia');
    if (modal) {
        console.log("Modal existe no HTML!");
    } else {
        console.log("ERRO: Modal NÃO existe no HTML!");
        alert("ERRO: O modal não foi encontrado no HTML!");
    }
});

// ===== SISTEMA DE NOTÍCIAS =====

// Dados das notícias (depois virá do admin)
const noticiasData = {
    1: {
        titulo: "Cardeal Dom Odilo Pedro Scherer visita o papa em 2023",
        texto: "O Cardeal Dom Odilo Pedro Scherer, Arcebispo Metropolitano de São Paulo, esteve em Roma para uma audiência privada com o Papa Francisco. Durante o encontro, foram discutidos temas relevantes para a Igreja no Brasil, incluindo a situação das comunidades, a evangelização e os desafios contemporâneos da fé católica.",
        imagem: "https://placehold.co/600x400/c9a959/white?text=Papa+Francisco",
        data: "15 de Dezembro, 2024"
    },
    2: {
        titulo: "Igreja escolhe o novo Sumo Pontífice",
        texto: "Após um conclave histórico realizado na Capela Sistina, os cardeais reunidos elegeram o novo Sumo Pontífice. O Cardeal Pietro Rossi, agora conhecido como Papa Leão XIV, aceitou seu novo ministério com humildade e fé.",
        imagem: "https://placehold.co/600x400/c9a959/white?text=Papa+Le%C3%A3o",
        data: "10 de Dezembro, 2024"
    },
    3: {
        titulo: "Vaticano Confirma a Morte do Pontífice",
        texto: "O Vaticano confirmou hoje o falecimento do Santo Padre, o Papa Francisco, aos 87 anos. O Pontífice faleceu pacificamente em sua residência na Casa Santa Marta.",
        imagem: "https://placehold.co/600x400/c9a959/white?text=Vaticano",
        data: "12 de Dezembro, 2024"
    }
};

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    
    // Configurar os botões "Leia mais"
    const botoes = document.querySelectorAll('.btn-small');
    
    botoes.forEach(function(botao) {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const id = parseInt(this.getAttribute('data-id'));
            const noticia = noticiasData[id];
            
            if (noticia) {
                // Preencher o modal
                document.getElementById('modalTitulo').innerHTML = noticia.titulo;
                document.getElementById('modalData').innerHTML = noticia.data;
                document.getElementById('modalTexto').innerHTML = noticia.texto;
                
                const imgModal = document.getElementById('modalImagem');
                imgModal.src = noticia.imagem;
                imgModal.alt = noticia.titulo;
                
                // Mostrar modal
                const modal = document.getElementById('modalNoticia');
                modal.style.display = 'flex';
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Fechar modal
    const modal = document.getElementById('modalNoticia');
    const closeBtn = document.querySelector('.modal-noticia-close');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
    }
    
    // Fechar ao clicar fora
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // Fechar com ESC
    document.onkeydown = function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
});

// Função para compartilhar (global)
function compartilharNoticia() {
    const titulo = document.getElementById('modalTitulo').innerHTML;
    const texto = document.getElementById('modalTexto').innerHTML;
    const mensagem = ` *${titulo}*\n\n${texto.substring(0, 300)}...\n\nLeia mais no site da Catedral Metropolitana!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// ===== CARREGAR NOTÍCIAS DO ADMIN PARA O SITE =====

function carregarNoticiasDoAdmin() {
    const noticias = JSON.parse(localStorage.getItem('site_noticias') || '[]');
    const container = document.querySelector('.noticias-grid');
    
    if (!container) return;
    
    if (noticias.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column:1/-1; text-align:center; padding:40px;">📭 Nenhuma notícia cadastrada ainda</div>';
        return;
    }
    
    container.innerHTML = noticias.map((noticia, index) => `
        <article class="noticia-card">
            <img src="${noticia.imagem || 'https://placehold.co/600x400/c9a959/white?text=Catedral'}" alt="${noticia.titulo}" onerror="this.src='https://placehold.co/600x400/c9a959/white?text=Imagem'">
            <div class="noticia-content">
                <h3>${noticia.titulo}</h3>
                <p>${noticia.descricao.substring(0, 100)}${noticia.descricao.length > 100 ? '...' : ''}</p>
                <button class="btn-small" data-id="${noticia.id}"> Leia mais</button>
            </div>
        </article>
    `).join('');
    
    // Reconfigurar os botões após carregar as notícias
    configurarBotoesNoticias(noticias);
}

function configurarBotoesNoticias(noticias) {
    const botoes = document.querySelectorAll('.btn-small');
    
    botoes.forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const id = this.getAttribute('data-id');
            const noticia = noticias.find(n => n.id === id);
            
            if (noticia) {
                abrirModalNoticia(noticia);
            }
        });
    });
}

function abrirModalNoticia(noticia) {
    // Preencher o modal
    document.getElementById('modalTitulo').innerHTML = noticia.titulo;
    document.getElementById('modalData').innerHTML = noticia.data;
    document.getElementById('modalTexto').innerHTML = noticia.textoCompleto;
    
    const imgModal = document.getElementById('modalImagem');
    imgModal.src = noticia.imagem || 'https://placehold.co/600x400/c9a959/white?text=Imagem';
    imgModal.alt = noticia.titulo;
    
    // Mostrar modal
    const modal = document.getElementById('modalNoticia');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function fecharModalNoticia() {
    const modal = document.getElementById('modalNoticia');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function compartilharNoticia() {
    const titulo = document.getElementById('modalTitulo').innerHTML;
    const texto = document.getElementById('modalTexto').innerHTML;
    const mensagem = ` *${titulo}*\n\n${texto.substring(0, 300)}...\n\nLeia mais no site da Catedral Metropolitana!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// Carregar notícias quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarNoticiasDoAdmin();
    
    // Configurar modal
    const modal = document.getElementById('modalNoticia');
    const closeBtn = document.querySelector('.modal-noticia-close');
    
    if (closeBtn) {
        closeBtn.onclick = fecharModalNoticia;
    }
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            fecharModalNoticia();
        }
    };
    
    document.onkeydown = function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            fecharModalNoticia();
        }
    };
});

// Ouvir atualizações do admin
window.addEventListener('noticiasAtualizadas', function() {
    carregarNoticiasDoAdmin();
});

// ===== MENSAGEM DO PADRE =====

// Funções globais
window.compartilharMensagem = function() {
    const titulo = document.querySelector('.mensagem-titulo')?.innerText || '';
    const texto = document.querySelector('.mensagem-texto')?.innerText || '';
    const mensagem = `🕊️ *Mensagem do Padre*\n\n${titulo}\n\n${texto.substring(0, 300)}...\n\nConfira em: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank');
};

window.lerMensagem = function() {
    const texto = document.querySelector('.mensagem-texto')?.innerText || '';
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    } else {
        alert('Seu navegador não suporta áudio');
    }
};

// Carregar mensagens
function carregarMensagemAtual() {
    const container = document.getElementById('mensagemContainer');
    const mensagens = JSON.parse(localStorage.getItem('admin_mensagens_padre') || '[]');
    const atual = mensagens.find(m => m.status === 'publicado') || mensagens[0];
    
    if (!atual) {
        container.innerHTML = `<div class="mensagem-card-page" style="padding: 40px; text-align: center;">
            <i class="fas fa-church" style="font-size: 48px; color: #c9a959; margin-bottom: 16px;"></i>
            <h3>Nenhuma mensagem disponível</h3>
            <p>Em breve teremos novidades!</p>
        </div>`;
        return;
    }
    
    container.innerHTML = `
        <div class="mensagem-card-page">
            <div class="mensagem-header">
                <div class="padre-info">
                    <img src="img/padre.jpg" alt="Padre José Antônio" class="padre-foto" onerror="this.src='https://placehold.co/100x100/c9a959/white?text=Padre'">
                    <div class="padre-dados">
                        <h3>${atual.autor || 'Padre José Antônio'}</h3>
                        <span>Pároco da Catedral</span>
                    </div>
                </div>
                <div class="mensagem-data">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${atual.data || new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
            <div class="mensagem-conteudo">
                <div class="evangelho-semana">
                    <i class="fas fa-bible"></i>
                    <strong>${atual.evangelho_titulo || 'Evangelho do Domingo'}</strong>
                    <p>${atual.evangelho_referencia || 'Leitura do dia'}</p>
                </div>
                <h2 class="mensagem-titulo">${atual.titulo}</h2>
                <div class="mensagem-texto">
                    ${atual.texto.split('\n\n').map(p => `<p>${p}</p>`).join('')}
                    <p class="assinatura">— ${atual.autor || 'Padre José Antônio'}</p>
                </div>
            </div>
            <div class="mensagem-acoes">
                <button class="btn-compartilhar-msg" onclick="compartilharMensagem()">
                    <i class="fab fa-whatsapp"></i> Compartilhar Mensagem
                </button>
                <button class="btn-ouvir-msg" onclick="lerMensagem()">
                    <i class="fas fa-headphones"></i> Ouvir Mensagem
                </button>
            </div>
        </div>
    `;
}

function carregarMensagensAnteriores() {
    const container = document.getElementById('mensagensAnteriores');
    const mensagens = JSON.parse(localStorage.getItem('admin_mensagens_padre') || '[]');
    const anteriores = mensagens.filter(m => m.status !== 'publicado' || mensagens.indexOf(m) > 0);
    
    if (anteriores.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhuma mensagem anterior</p>';
        return;
    }
    
    container.innerHTML = anteriores.map(msg => `
        <a href="#" class="anterior-card" onclick="carregarMensagemEspecifica('${msg.id}'); return false;">
            <span class="data">${msg.data_curta || msg.data}</span>
            <span class="titulo">${msg.titulo}</span>
        </a>
    `).join('');
}

function carregarMensagemEspecifica(id) {
    const mensagens = JSON.parse(localStorage.getItem('admin_mensagens_padre') || '[]');
    const msg = mensagens.find(m => m.id === id);
    if (msg) {
        document.getElementById('mensagemContainer').innerHTML = `
            <div class="mensagem-card-page">
                <div class="mensagem-header">
                    <div class="padre-info">
                        <img src="img/padre.jpg" class="padre-foto" onerror="this.src='https://placehold.co/100x100/c9a959/white?text=Padre'">
                        <div class="padre-dados">
                            <h3>${msg.autor || 'Padre José Antônio'}</h3>
                            <span>Pároco da Catedral</span>
                        </div>
                    </div>
                    <div class="mensagem-data">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${msg.data}</span>
                    </div>
                </div>
                <div class="mensagem-conteudo">
                    <div class="evangelho-semana">
                        <i class="fas fa-bible"></i>
                        <strong>${msg.evangelho_titulo || 'Evangelho do Domingo'}</strong>
                        <p>${msg.evangelho_referencia || 'Leitura do dia'}</p>
                    </div>
                    <h2 class="mensagem-titulo">${msg.titulo}</h2>
                    <div class="mensagem-texto">
                        ${msg.texto.split('\n\n').map(p => `<p>${p}</p>`).join('')}
                        <p class="assinatura">— ${msg.autor || 'Padre José Antônio'}</p>
                    </div>
                </div>
                <div class="mensagem-acoes">
                    <button class="btn-compartilhar-msg" onclick="compartilharMensagem()">
                        <i class="fab fa-whatsapp"></i> Compartilhar Mensagem
                    </button>
                    <button class="btn-ouvir-msg" onclick="lerMensagem()">
                        <i class="fas fa-headphones"></i> Ouvir Mensagem
                    </button>
                </div>
            </div>
        `;
    }
}

// Carregar ao iniciar a página
if (document.querySelector('.mensagem-page')) {
    carregarMensagemAtual();
    carregarMensagensAnteriores();
}

