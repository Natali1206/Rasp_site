// Lógica e micro-interações da Landing Page Premium

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    initHeaderScroll();
    initScrollReveal();
    initTestimonialCarousel();
    initAccordionFAQ();
    initBookingModal();
});

/**
 * 1. Efeito de Cabeçalho Fixo no Scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('bg-white/80', 'backdrop-blur-lg', 'shadow-md', 'py-4');
            header.classList.remove('bg-transparent', 'py-6');
        } else {
            header.classList.remove('bg-white/80', 'backdrop-blur-lg', 'shadow-md', 'py-4');
            header.classList.add('bg-transparent', 'py-6');
        }
    });
}

/**
 * 2. Animação de Scroll Reveal (Revelar ao rolar a página)
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Uma vez animado, não precisa reanimar
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.1, // Dispara quando 10% do elemento está visível
        rootMargin: '0px 0px -50px 0px' // Margem inferior ligeiramente reduzida para melhor timing
    });

    reveals.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * 3. Carrossel de Depoimentos Elegante
 */
function initTestimonialCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('bg-amber-600', 'scale-125'));
        dots.forEach(dot => dot.classList.add('bg-neutral-300'));

        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.remove('bg-neutral-300');
        dots[currentSlide].classList.add('bg-amber-600', 'scale-125');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Eventos de clique nos controles
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    // Auto rotação a cada 6 segundos
    function startTimer() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    // Inicialização do carrossel
    showSlide(0);
    startTimer();
}

/**
 * 4. Acordeão de FAQ (Perguntas Frequentes)
 */
function initAccordionFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const button = item.querySelector('.faq-btn');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');

        if (!button || !content) return;

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Fechar todos os outros FAQs para manter o visual limpo (modo exclusivo)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.faq-content');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherContent) otherContent.style.maxHeight = null;
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            // Toggle item clicado
            if (isOpen) {
                item.classList.remove('active');
                content.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(45deg)'; // Transforma o "+" em "x"
            }
        });
    });
}

/**
 * 5. Modal de Agendamento Interativo
 */
function initBookingModal() {
    const modal = document.getElementById('booking-modal');
    const openBtns = document.querySelectorAll('.btn-open-booking');
    const closeBtn = document.getElementById('close-booking-modal');
    const form = document.getElementById('booking-form');
    const successMessage = document.getElementById('success-message');

    if (!modal) return;

    // Abrir Modal
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.remove('opacity-0', 'pointer-events-none');
            document.body.classList.add('overflow-hidden'); // Evita scroll do fundo
        });
    });

    // Fechar Modal
    function closeModal() {
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
        
        // Resetar o formulário após animação de fechamento
        setTimeout(() => {
            if (form) form.reset();
            if (successMessage) successMessage.classList.add('hidden');
            if (form) form.classList.remove('hidden');
        }, 400);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Fechar ao clicar fora do conteúdo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fechar com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('opacity-0')) {
            closeModal();
        }
    });

    // Envio do formulário com animação de sucesso
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulação de carregamento e envio de dados
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> Agendando...
            `;

            setTimeout(() => {
                // Esconder formulário e mostrar mensagem de sucesso estilizada
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Resetar botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }
}
