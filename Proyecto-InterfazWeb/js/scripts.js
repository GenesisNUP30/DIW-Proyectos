/* ==============================================
   SCRIPTS.JS — DestinoGreen
   ============================================== */

/* === 1. Navbar: clase "scrolled" al hacer scroll === */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

/* === 2. Animación al hacer scroll (animate-on-scroll) === */
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  scrollObserver.observe(el);
});

/* === 3. Contador animado (index - stats) === */
function animarContador(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('es-ES') + '+';
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animarContador(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statsObserver.observe(el));

/* === 4. Newsletter toast (index) === */
const btnNewsletter = document.getElementById('btnNewsletter');
if (btnNewsletter) {
  btnNewsletter.addEventListener('click', () => {
    const input = document.getElementById('emailNewsletter');
    if (input && input.value && input.validity.valid) {
      const toastEl = document.createElement('div');
      toastEl.className = 'toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3';
      toastEl.setAttribute('role', 'alert');
      toastEl.setAttribute('aria-live', 'assertive');
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">✅ ¡Suscripción completada! Bienvenido a DestinoGreen.</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>`;
      document.body.appendChild(toastEl);
      new bootstrap.Toast(toastEl, { delay: 4000 }).show();
      input.value = '';
    } else if (input) {
      input.classList.add('is-invalid');
      setTimeout(() => input.classList.remove('is-invalid'), 2000);
    }
  });
}

/* === 5. DESTINOS: Filtros por tipo === */
const filtrosBtns = document.querySelectorAll('.filtro-btn');
const destinoItems = document.querySelectorAll('.destino-item');
const sinResultados = document.getElementById('sinResultados');

function filtrarDestinos(filtro) {
  let visibles = 0;
  destinoItems.forEach(item => {
    const tipo = item.dataset.tipo;
    const mostrar = filtro === 'todos' || tipo === filtro;
    item.classList.toggle('oculto', !mostrar);
    if (mostrar) visibles++;
  });
  if (sinResultados) {
    sinResultados.classList.toggle('d-none', visibles > 0);
  }
}

filtrosBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Actualizar estado activo
    filtrosBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    // Resetear continentes
    document.querySelectorAll('.continente-card').forEach(c => c.classList.remove('active'));

    // Limpiar buscador
    const buscador = document.getElementById('buscadorDestinos');
    if (buscador) buscador.value = '';

    filtrarDestinos(btn.dataset.filtro);
  });
});

/* === 6. DESTINOS: Buscador === */
const buscadorDestinos = document.getElementById('buscadorDestinos');
if (buscadorDestinos) {
  buscadorDestinos.addEventListener('input', () => {
    const query = buscadorDestinos.value.toLowerCase().trim();

    // Resetear filtros activos visualmente
    filtrosBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    const btnTodos = document.querySelector('.filtro-btn[data-filtro="todos"]');
    if (btnTodos) {
      btnTodos.classList.add('active');
      btnTodos.setAttribute('aria-pressed', 'true');
    }
    document.querySelectorAll('.continente-card').forEach(c => c.classList.remove('active'));

    let visibles = 0;
    destinoItems.forEach(item => {
      const nombre = item.dataset.nombre || '';
      const mostrar = query === '' || nombre.includes(query);
      item.classList.toggle('oculto', !mostrar);
      if (mostrar) visibles++;
    });

    if (sinResultados) {
      sinResultados.classList.toggle('d-none', visibles > 0);
    }
  });
}

/* === 7. DESTINOS: Filtro por continente === */
const continenteCards = document.querySelectorAll('.continente-card');
continenteCards.forEach(card => {
  card.addEventListener('click', () => {
    const continente = card.dataset.continente;

    // Estado visual
    continenteCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    // Resetear filtros de tipo
    filtrosBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    const btnTodos = document.querySelector('.filtro-btn[data-filtro="todos"]');
    if (btnTodos) {
      btnTodos.classList.add('active');
      btnTodos.setAttribute('aria-pressed', 'true');
    }

    // Limpiar buscador
    if (buscadorDestinos) buscadorDestinos.value = '';

    // Filtrar
    let visibles = 0;
    destinoItems.forEach(item => {
      const badge = item.querySelector('.card-continent-badge');
      const continenteItem = badge ? badge.textContent.trim() : '';
      const mostrar = continenteItem === continente;
      item.classList.toggle('oculto', !mostrar);
      if (mostrar) visibles++;
    });

    if (sinResultados) {
      sinResultados.classList.toggle('d-none', visibles > 0);
    }

    // Scroll suave al grid
    const grid = document.getElementById('gridDestinos');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});