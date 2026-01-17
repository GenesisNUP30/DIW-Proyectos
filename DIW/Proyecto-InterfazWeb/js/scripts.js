// ===============================
// Navbar: cambio de estilo al hacer scroll
// ===============================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===============================
// Animaciones al hacer scroll
// ===============================
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

animateElements.forEach(el => observer.observe(el));

// ===============================
// Tabs en experiencias.html
// ===============================
// (Bootstrap ya gestiona tabs con data-bs-toggle, 
// pero si quieres animaciones extra o control manual, se puede)
const tabs = document.querySelectorAll('#experienciasTabs .nav-link');
const tabPanes = document.querySelectorAll('.tab-pane');

tabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();

    // Quitar clase active de todos los tabs
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Mostrar la tab correspondiente
    const target = document.querySelector(tab.dataset.bsTarget);
    tabPanes.forEach(pane => {
      pane.classList.remove('show', 'active');
    });
    target.classList.add('show', 'active');
  });
});

// ===============================
// Modal + validación formulario (contacto.html)
// ===============================
(function() {
  'use strict';
  const forms = document.querySelectorAll('#contactForm');

  Array.prototype.slice.call(forms).forEach(function(form) {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();
