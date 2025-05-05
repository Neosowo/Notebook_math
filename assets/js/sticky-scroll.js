// Script para fijar efectivamente los elementos durante el scroll
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('aside.sidebar');
    const tocContainer = document.querySelector('.toc-container');
    const tocWrapper = document.querySelector('.toc-wrapper');
    const header = document.querySelector('header');
    const mainContent = document.querySelector('main');
    
    // Función principal para configurar los elementos sticky
    function setupStickyElements() {
        // Activar solo en escritorio
        if (window.innerWidth >= 1024) {
            setupSidebar();
            setupToc();
            
            // Ajustar al redimensionar sin resetear
            window.addEventListener('resize', debounce(function() {
                if (window.innerWidth >= 1024) {
                    updateStickyDimensions();
                } else {
                    resetStickyStyles();
                }
            }, 150));
        } else {
            resetStickyStyles();
        }
    }
    
    // Actualizar dimensiones sin resetear completamente
    function updateStickyDimensions() {
        if (!sidebar || !tocContainer || !tocWrapper || !header || !mainContent) return;
        
        const headerHeight = header.offsetHeight;
        const sidebarWidth = sidebar.offsetWidth;
        
        // Ajustar sidebar
        sidebar.style.height = '100vh';
        
        // Ajustar TOC
        tocWrapper.style.width = tocContainer.offsetWidth + 'px';
        tocWrapper.style.top = `${headerHeight + 20}px`;
        tocWrapper.style.maxHeight = `calc(100vh - ${headerHeight + 40}px)`;
        
        // Ajustar margen del contenido principal
        mainContent.style.marginLeft = `${sidebarWidth}px`;
    }
    
    // Configurar el sidebar para que sea realmente sticky
    function setupSidebar() {
        if (!sidebar) return;
        
        // Fijar el sidebar con position: fixed
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        sidebar.style.height = '100vh';
        sidebar.style.overflowY = 'auto';
        sidebar.style.zIndex = '40';
        
        // Añadir padding al main para compensar el ancho del sidebar
        const sidebarWidth = sidebar.offsetWidth;
        if (mainContent) {
            mainContent.style.marginLeft = `${sidebarWidth}px`;
        }
    }
    
    // Configurar la tabla de contenidos para que siga el scroll
    function setupToc() {
        if (!tocContainer || !tocWrapper || !header) return;
        
        const headerHeight = header.offsetHeight;
        
        // Fijar el TOC con position: fixed
        tocWrapper.style.position = 'fixed';
        tocWrapper.style.top = `${headerHeight + 20}px`; // Margen de 20px debajo del header
        tocWrapper.style.width = tocContainer.offsetWidth + 'px';
        tocWrapper.style.overflowY = 'auto';
        tocWrapper.style.maxHeight = `calc(100vh - ${headerHeight + 40}px)`; // 40px para márgenes
        
        // Importante: asegurar que el TOC siga siendo visible después del sidebar
        tocWrapper.style.zIndex = '30';
    }
    
    // Resetear estilos cuando no estamos en desktop
    function resetStickyStyles() {
        if (sidebar) {
            sidebar.style.position = '';
            sidebar.style.top = '';
            sidebar.style.left = '';
            sidebar.style.height = '';
            sidebar.style.overflowY = '';
            sidebar.style.zIndex = '';
        }
        
        if (mainContent) {
            mainContent.style.marginLeft = '';
        }
        
        if (tocWrapper) {
            tocWrapper.style.position = '';
            tocWrapper.style.top = '';
            tocWrapper.style.width = '';
            tocWrapper.style.maxHeight = '';
            tocWrapper.style.overflowY = '';
            tocWrapper.style.zIndex = '';
        }
    }
    
    // Destacar el enlace activo en el TOC durante el scroll
    function highlightTOCOnScroll() {
        const headings = document.querySelectorAll('h2[id], h3[id]');
        const tocLinks = document.querySelectorAll('.toc-content a');
        
        if (headings.length === 0 || tocLinks.length === 0) return;
        
        function updateActiveLink() {
            const headerHeight = header ? header.offsetHeight : 0;
            let currentActiveId = '';
            
            // Recorrer los headings de abajo hacia arriba
            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i];
                const rect = heading.getBoundingClientRect();
                
                // Si el heading está visible (considerando el header)
                if (rect.top <= headerHeight + 50) {
                    currentActiveId = heading.id;
                    break;
                }
            }
            
            // Quitar la clase active de todos los enlaces
            tocLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Añadir la clase active al enlace correspondiente
            if (currentActiveId) {
                tocLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentActiveId}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
        
        // Usar requestAnimationFrame para mayor rendimiento
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Actualizar al cargar la página
        updateActiveLink();
    }
    
    // Función debounce para mejorar el rendimiento de eventos frecuentes
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Ejecutar las funciones principales
    setupStickyElements();
    highlightTOCOnScroll();
}); 