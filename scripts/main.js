const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Инициализация темы (по умолчанию dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

function updateToggleIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function openProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('project-modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
});

// Pagination functionality for PROJECTS
const PROJECTS_PER_PAGE = 2;
const BLOG_POSTS_PER_PAGE = 1;
let currentPage = 1;
let currentBlogPage = 1;

function initPagination() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const projectCards = Array.from(grid.querySelectorAll('.project-card'));
    if (projectCards.length === 0) return;

    const totalPages = Math.ceil(projectCards.length / PROJECTS_PER_PAGE);
    const paginationDiv = document.getElementById('pagination');

    if (!paginationDiv) return;

    // Добавили параметр isInit
    function showPage(page, isInit = false) {
        projectCards.forEach((card, index) => {
            const shouldShow = index >= (page - 1) * PROJECTS_PER_PAGE && index < page * PROJECTS_PER_PAGE;
            if (shouldShow) {
                card.style.display = '';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });

        Array.from(paginationDiv.querySelectorAll('.pagination-btn')).forEach(btn => {
            if (parseInt(btn.getAttribute('data-page')) === page) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        currentPage = page;

        // Плавный скролл к началу секции проектов
        // Срабатывает только если это НЕ инициализация (не первый заход)
        if (!isInit) {
            const projectsSection = document.getElementById('projects-section');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        btn.setAttribute('data-page', i);
        btn.textContent = i;

        btn.addEventListener('click', function() {
            showPage(parseInt(this.getAttribute('data-page')));
        });

        if (i === 1) {
            btn.classList.add('active');
        }

        paginationDiv.appendChild(btn);
    }

    // Важно: передаем true, чтобы запретить скролл при загрузке страницы
    showPage(1, true);
}


// Blog pagination functionality for AI CASES
// Blog pagination functionality for AI CASES
function initBlogPagination() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;

    const blogCards = Array.from(blogGrid.querySelectorAll('.project-card'));
    if (blogCards.length === 0) return;

    const totalPages = Math.ceil(blogCards.length / BLOG_POSTS_PER_PAGE);
    const paginationDiv = document.getElementById('blog-pagination');

    if (!paginationDiv) return;

    // Добавили параметр isInit, чтобы не скроллить при загрузке страницы
    function showBlogPage(page, isInit = false) {
        blogCards.forEach((card, index) => {
            const shouldShow = index >= (page - 1) * BLOG_POSTS_PER_PAGE && index < page * BLOG_POSTS_PER_PAGE;
            if (shouldShow) {
                card.style.display = '';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });

        Array.from(paginationDiv.querySelectorAll('.pagination-btn')).forEach(btn => {
            if (parseInt(btn.getAttribute('data-page')) === page) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        currentBlogPage = page;

        // ДОБАВЛЕНО: Плавный скролл к началу секции блога
        // Срабатывает только если это не первичная инициализация
        if (!isInit) {
            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        btn.setAttribute('data-page', i);
        btn.textContent = i;

        btn.addEventListener('click', function() {
            showBlogPage(parseInt(this.getAttribute('data-page')));
        });

        if (i === 1) {
            btn.classList.add('active');
        }

        paginationDiv.appendChild(btn);
    }

    // Передаем true, чтобы при F5 не дергало экран
    showBlogPage(1, true);
}


// Active navigation link tracking on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    let maxOffset = -1;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 250 && sectionTop > maxOffset) {
            currentSection = section.getAttribute('id');
            maxOffset = sectionTop;
        }
    });
    
    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (section === currentSection) {
            link.style.color = 'var(--accent)';
            link.style.fontWeight = '700';
        } else {
            link.style.color = 'var(--text-secondary)';
            link.style.fontWeight = '400';
        }
    });
}

// Back to top button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }
    updateActiveNavLink();
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth scroll on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateActiveNavLink();
        }
    });
});

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initPagination();
            initBlogPagination();
            updateActiveNavLink();
        }, 100);
    });
} else {
    setTimeout(() => {
        initPagination();
        initBlogPagination();
        updateActiveNavLink();
    }, 100);
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxNext = document.querySelector('.lightbox-next'); // Находим кнопку "вперед"
const lightboxPrev = document.querySelector('.lightbox-prev'); // Находим кнопку "назад"

let currentImages = []; // Сюда будем сохранять список всех картинок текущего проекта
let currentIndex = 0;   // Индекс текущей открытой картинки

// Функция для обновления картинки в лайтбоксе
function updateLightboxImage() {
    if (currentImages.length > 0) {
        lightboxImg.src = currentImages[currentIndex].src;
    }
}

document.querySelectorAll('.project-img-modal').forEach(img => {
    img.addEventListener('click', function() {
        // 1. Открываем лайтбокс
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // 2. Находим родительский контейнер с картинками (modal-photos)
        const container = this.closest('.modal-photos');
        
        if (container) {
            // 3. Собираем все картинки из этого контейнера в массив
            currentImages = Array.from(container.querySelectorAll('.project-img-modal'));
            
            // 4. Определяем индекс той картинки, на которую кликнули
            currentIndex = currentImages.indexOf(this);
            
            // 5. Показываем картинку
            updateLightboxImage();
        } else {
            // Если вдруг картинка одна и без контейнера (на всякий случай)
            lightboxImg.src = this.src;
            currentImages = [];
        }
    });
});

// Клик по кнопке "Вперед"
if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation(); // Чтобы клик не ушел на фон и не закрыл лайтбокс
        if (currentImages.length > 0) {
            currentIndex = (currentIndex + 1) % currentImages.length; // Увеличиваем индекс (по кругу)
            updateLightboxImage();
        }
    });
}

// Клик по кнопке "Назад"
if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentImages.length > 0) {
            // Уменьшаем индекс (по кругу: если 0, то переходим в конец)
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        }
    });
}

// Закрытие по крестику
if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Закрытие по клику на темный фон (кроме самой картинки и кнопок)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
