// Script para manejar los enlaces del sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los enlaces del sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar-link, aside nav a');
    
    // Añadir el atributo de data para identificar enlaces que deben ir al tope
    sidebarLinks.forEach(link => {
        link.setAttribute('data-scroll-top', 'true');
        
        // Prevenir el comportamiento predeterminado y hacer scroll al tope
        // Solo agregar este listener si no es un enlace del TOC
        if (!link.classList.contains('toc-link') && !link.closest('#mobile-toc')) {
            const originalClickHandler = link.onclick;
            
            link.addEventListener('click', function(e) {
                // Si el enlace tiene un hash específico para TOC, permitir el comportamiento normal
                if (this.getAttribute('href') && this.getAttribute('href').startsWith('#') && 
                    this.getAttribute('href') !== '#' && 
                    !this.classList.contains('sidebar-link')) {
                    return;
                }
                
                // Prevenir la navegación predeterminada
                e.preventDefault();
                
                // Si es un enlace que apunta a otra página
                if (this.getAttribute('href') && 
                    !this.getAttribute('href').startsWith('#') && 
                    !this.classList.contains('sidebar-link')) {
                    
                    // Guardar la URL a la que se va a navegar
                    const targetUrl = this.getAttribute('href');
                    
                    // Hacer scroll al inicio antes de navegar
                    window.scrollTo({
                        top: 0,
                        behavior: 'auto'
                    });
                    
                    // Navegar a la nueva página después de un breve retraso
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 50);
                }
                
                // No hacer nada más aquí para los links del sidebar,
                // ya que la funcionalidad de scroll se maneja en setupSidebarEvents
            });
        }
    });
    
    // Mantener el comportamiento normal para los enlaces del TOC
    const tocLinks = document.querySelectorAll('.toc-content a, #mobile-toc a');
    
    tocLinks.forEach(link => {
        // Remover el atributo de scroll-top para enlaces del TOC si fue aplicado
        link.removeAttribute('data-scroll-top');
    });
}); 