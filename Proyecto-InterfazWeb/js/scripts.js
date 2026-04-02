/**
 * DestinoGreen - Scripts principales para index.html
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. NAVBAR: Cambio de color al hacer scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled'); 
            // Nota: Asegúrate de tener .navbar-scrolled { background: #1a1a1a !important; } en tu CSS
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // 2. ANIMACIÓN DE ENTRADA (Scroll Reveal)
    // Hace que los elementos con .animate-on-scroll aparezcan suavemente
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Solo anima una vez
            }
        });
    }, { threshold: 0.15 });

    animateElements.forEach(el => revealObserver.observe(el));

    // 3. CONTADORES ANIMADOS (Sección Stats)
    const statNumbers = document.querySelectorAll('.stat-number');

    const animarContador = (el) => {
        const target = parseInt(el.dataset.target);
        const duration = 2000; // 2 segundos de animación
        const increment = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                el.textContent = Math.floor(current).toLocaleString('es-ES') + '+';
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = target.toLocaleString('es-ES') + '+';
            }
        };
        updateCount();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animarContador(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statsObserver.observe(num));

    // 4. NEWSLETTER (Validación y Toast)
    const btnNewsletter = document.getElementById('btnNewsletter');
    const inputNewsletter = document.getElementById('emailNewsletter');

    if (btnNewsletter && inputNewsletter) {
        btnNewsletter.addEventListener('click', () => {
            const email = inputNewsletter.value;
            
            // Validación simple
            if (email && inputNewsletter.checkValidity()) {
                mostrarToastSuscripcion();
                inputNewsletter.value = '';
                inputNewsletter.classList.remove('is-invalid');
            } else {
                inputNewsletter.classList.add('is-invalid');
                setTimeout(() => inputNewsletter.classList.remove('is-invalid'), 2500);
            }
        });
    }

    // Función auxiliar para crear y mostrar el aviso de éxito
    function mostrarToastSuscripcion() {
        // Creamos el contenedor del Toast si no existe
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(container);
        }

        const id = 'toast-' + Date.now();
        container.innerHTML += `
            <div id="${id}" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="d-flex">
                <div class="toast-body">
                  <i class="bi bi-check-circle-fill me-2"></i> ¡Gracias! Te has suscrito correctamente.
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
              </div>
            </div>`;

        const element = document.getElementById(id);
        const toast = new bootstrap.Toast(element, { delay: 4000 });
        toast.show();
        
        // Limpiar el DOM cuando se oculte
        element.addEventListener('hidden.bs.toast', () => element.remove());
    }
});