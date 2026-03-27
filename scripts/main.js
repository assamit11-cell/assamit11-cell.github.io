// ── Theme ─────────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

function updateToggleIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon(next);
});

// ── Hamburger / Mobile Nav ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
});

// Close mobile nav when a link is clicked
mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
    });
});

// ── Project Modals ────────────────────────────────────────
function openProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking on dark backdrop
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('project-modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ── Blog Pagination constants ─────────────────────────────
const BLOG_POSTS_PER_PAGE = 1;
let currentBlogPage = 1;


function initProjectSlider() {
    const slider = document.getElementById('projectSlider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.pslide'));
    if (!slides.length) return;

    let current = 0;
    let isAnimating = false;

    // Set background images from data-bg attribute
    slides.forEach(slide => {
        const bg = slide.getAttribute('data-bg');
        const visual = slide.querySelector('.pslide-visual');
        if (bg && visual) {
            visual.style.backgroundImage = `url(${bg})`;
            visual.style.backgroundSize = 'cover';
            visual.style.backgroundPosition = 'center';
        }
    });

    // Dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'pslider-dots';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'pslider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });
    slider.after(dotsContainer);

    function updateDots() {
        dotsContainer.querySelectorAll('.pslider-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function scrollToSlider() {
        const section = document.getElementById('projects-section');
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    function goTo(index) {
        if (isAnimating || index === current) return;
        isAnimating = true;

        const outSlide = slides[current];
        const inSlide  = slides[index];

        // Fade out current
        outSlide.style.opacity = '0';
        outSlide.style.transform = 'translateX(-24px)';
        outSlide.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

        setTimeout(() => {
            outSlide.classList.remove('active');
            outSlide.style.cssText = '';

            inSlide.style.opacity = '0';
            inSlide.style.transform = 'translateX(24px)';
            inSlide.style.transition = 'none';
            inSlide.classList.add('active');

            // Force reflow then fade in
            inSlide.getBoundingClientRect();
            inSlide.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            inSlide.style.opacity = '1';
            inSlide.style.transform = 'translateX(0)';

            setTimeout(() => {
                inSlide.style.cssText = '';
                current = index;
                updateDots();
                isAnimating = false;
            }, 320);
        }, 260);
    }

    function goNext() {
        goTo((current + 1) % slides.length);
    }

    // Arrow buttons on each slide
    slider.querySelectorAll('.pslide-arrow').forEach(btn => {
        btn.addEventListener('click', goNext);
    });

    // Accordion "Подробнее"
    slider.querySelectorAll('.pslide-more').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const full = btn.previousElementSibling;
            const isOpen = full.classList.toggle('open');
            btn.classList.toggle('open', isOpen);
            btn.childNodes[0].textContent = isOpen ? 'Свернуть ' : 'Подробнее ';
        });
    });


    // Init first slide
    slides[0].classList.add('active');
    slides[0].style.display = 'flex';
}

// ── Pagination — Blog/AI Cases ────────────────────────────
function initBlogPagination() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.project-card'));
    if (!cards.length) return;

    const totalPages = Math.ceil(cards.length / BLOG_POSTS_PER_PAGE);
    const paginationDiv = document.getElementById('blog-pagination');
    if (!paginationDiv) return;

    function showPage(page, isInit = false) {
        if (!isInit) {
            grid.classList.add('fading');
        }

        setTimeout(() => {
            cards.forEach((card, i) => {
                const show = i >= (page - 1) * BLOG_POSTS_PER_PAGE && i < page * BLOG_POSTS_PER_PAGE;
                card.style.display = show ? '' : 'none';
                card.classList.toggle('hidden', !show);
            });

            paginationDiv.querySelectorAll('.pagination-btn').forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.dataset.page) === page);
            });

            currentBlogPage = page;
            grid.classList.remove('fading');
        }, isInit ? 0 : 220);
    }

    paginationDiv.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn' + (i === 1 ? ' active' : '');
        btn.dataset.page = i;
        btn.textContent = i;
        btn.addEventListener('click', function () {
            showPage(parseInt(this.dataset.page));
        });
        paginationDiv.appendChild(btn);
    }

    showPage(1, true);
}

// ── Active Nav Link on Scroll ─────────────────────────────
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Если доскроллили до самого низа — активируем последнюю секцию с nav-link
    const atBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 10;

    let current = '';

    if (atBottom) {
        // Берём последнюю секцию у которой есть соответствующая nav-ссылка
        const ids = Array.from(navLinks).map(l => l.dataset.section).filter(Boolean);
        current = ids[ids.length - 1] || '';
    } else {
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 200) {
                current = sec.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });
}

// ── Back to Top ───────────────────────────────────────────
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        backToTopBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }
    updateActiveNavLink();
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Smooth Scroll on Nav Click ────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActiveNavLink();
    });
});

// ── Scroll Reveal (Intersection Observer) ─────────────────
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Slight stagger for cards in the same row
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 60 * (entry.target.dataset.revealIndex || 0));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el, i) => {
        el.dataset.revealIndex = i % 4; // stagger within groups
        observer.observe(el);
    });
}

// ── Lightbox ──────────────────────────────────────────────
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxNext  = document.querySelector('.lightbox-next');
const lightboxPrev  = document.querySelector('.lightbox-prev');

let currentImages = [];
let currentIndex  = 0;

function updateLightboxImage() {
    if (currentImages.length > 0) {
        lightboxImg.src = currentImages[currentIndex].src;
    }
}

document.querySelectorAll('.project-img-modal').forEach(img => {
    img.addEventListener('click', function () {
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const container = this.closest('.modal-photos');
        if (container) {
            currentImages = Array.from(container.querySelectorAll('.project-img-modal'));
            currentIndex  = currentImages.indexOf(this);
            updateLightboxImage();
        } else {
            lightboxImg.src = this.src;
            currentImages = [];
        }
    });
});

if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentImages.length > 0) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightboxImage();
        }
    });
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentImages.length > 0) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        }
    });
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ── Parallax Hero Background ──────────────────────────────
function initParallax() {
    const heroBg = document.getElementById('heroBg');
    if (!heroBg) return;

    // Mouse parallax — subtle, only on desktop
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth  - 0.5) * 28;
            const y = (e.clientY / window.innerHeight - 0.5) * 18;
            heroBg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Scroll parallax — bg moves slower than content
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight * 1.5) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, { passive: true });
}

// ── Init ──────────────────────────────────────────────────
function init() {
    initProjectSlider();
    initBlogPagination();
    updateActiveNavLink();
    initScrollReveal();
    initParallax();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 100));
} else {
    setTimeout(init, 100);
}