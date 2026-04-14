/* ==============================================
   SCRIPTS.JS — DestinoGreen
   ============================================== */

/* === 1. Navbar: clase "scrolled" al hacer scroll === */
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }
});

/* === 2. Animación al hacer scroll (animate-on-scroll) === */
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".animate-on-scroll").forEach((el) => {
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
    el.textContent = Math.floor(current).toLocaleString("es-ES") + "+";
  }, 16);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animarContador(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

document
  .querySelectorAll(".stat-number")
  .forEach((el) => statsObserver.observe(el));

/* === 4. Newsletter toast (index) === */
const btnNewsletter = document.getElementById("btnNewsletter");
if (btnNewsletter) {
  btnNewsletter.addEventListener("click", () => {
    const input = document.getElementById("emailNewsletter");
    if (input && input.value && input.validity.valid) {
      const toastEl = document.createElement("div");
      toastEl.className =
        "toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3";
      toastEl.setAttribute("role", "alert");
      toastEl.setAttribute("aria-live", "assertive");
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">✅ ¡Suscripción completada! Bienvenido a DestinoGreen.</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>`;
      document.body.appendChild(toastEl);
      new bootstrap.Toast(toastEl, { delay: 4000 }).show();
      input.value = "";
    } else if (input) {
      input.classList.add("is-invalid");
      setTimeout(() => input.classList.remove("is-invalid"), 2000);
    }
  });
}

/* === FILTRO COMBINADO (Tipo + Continente) === */
const filtrosTipo = document.querySelectorAll(".filtro-btn");
const filtrosContinente = document.querySelectorAll(".filtro-continente");
const destinoItems = document.querySelectorAll(".destino-item");
const sinResultados = document.getElementById("sinResultados");
const buscadorDestinos = document.getElementById("buscadorDestinos");

// Estado de filtros
let filtroTipoActivo = "todos";
let filtroContinenteActivo = "todos";
let queryBusqueda = "";

function aplicarFiltros() {
  let visibles = 0;

  destinoItems.forEach((item) => {
    const tipo = item.dataset.tipo;
    const continente = item.dataset.continente;
    const nombre = (item.dataset.nombre || "").toLowerCase();

    // Coincidencia con tipo de entorno
    const matchesTipo = filtroTipoActivo === "todos" || tipo === filtroTipoActivo;
    
    // Coincidencia con continente
    const matchesContinente = filtroContinenteActivo === "todos" || continente === filtroContinenteActivo;
    
    // Coincidencia con búsqueda por texto
    const matchesBusqueda = queryBusqueda === "" || nombre.includes(queryBusqueda);

    if (matchesTipo && matchesContinente && matchesBusqueda) {
      item.classList.remove("d-none");
      // Pequeña animación de entrada
      item.style.opacity = "0";
      item.style.transform = "translateY(10px)";
      setTimeout(() => {
        item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 10);
      visibles++;
    } else {
      item.classList.add("d-none");
    }
  });

  // Mostrar/ocultar mensaje sin resultados
  if (sinResultados) {
    sinResultados.classList.toggle("d-none", visibles > 0);
  }
}

// Eventos para botones de TIPO DE ENTORNO
filtrosTipo.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Actualizar estado visual
    filtrosTipo.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    
    // Actualizar estado lógico y aplicar
    filtroTipoActivo = btn.dataset.filtro;
    aplicarFiltros();
  });
});

// Eventos para botones de CONTINENTE
filtrosContinente.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Actualizar estado visual
    filtrosContinente.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    
    // Actualizar estado lógico y aplicar
    filtroContinenteActivo = btn.dataset.continente;
    aplicarFiltros();
  });
});

// Buscador: combina con los filtros activos
if (buscadorDestinos) {
  buscadorDestinos.addEventListener("input", (e) => {
    queryBusqueda = e.target.value.toLowerCase().trim();
    aplicarFiltros();
  });
}

// Función para resetear todos los filtros (opcional)
function resetFilters() {
  // Resetear tipo
  filtrosTipo.forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });
  const btnTodosTipo = document.querySelector('.filtro-btn[data-filtro="todos"]');
  if (btnTodosTipo) {
    btnTodosTipo.classList.add("active");
    btnTodosTipo.setAttribute("aria-pressed", "true");
  }
  filtroTipoActivo = "todos";

  // Resetear continente
  filtrosContinente.forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });
  // Nota: como no hay botón "todos" en continentes, simplemente deseleccionamos todos
  filtroContinenteActivo = "todos";

  // Resetear buscador
  if (buscadorDestinos) {
    buscadorDestinos.value = "";
  }
  queryBusqueda = "";

  aplicarFiltros();
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  // Asegurar que "Todos" en tipo esté activo por defecto
  const btnTodosTipo = document.querySelector('.filtro-btn[data-filtro="todos"]');
  if (btnTodosTipo) {
    btnTodosTipo.classList.add("active");
    btnTodosTipo.setAttribute("aria-pressed", "true");
  }
  
  // Aplicar filtros iniciales
  aplicarFiltros();
});

/* ==============================================
   8. FORMULARIO DE CONTACTO — Validación
   ============================================== */
const contactForm = document.getElementById('contactForm');
 
if (contactForm) {
 
  // --- Helpers ---
  function marcarValido(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }
 
  function marcarInvalido(input) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
 
  function limpiarEstado(input) {
    input.classList.remove('is-valid', 'is-invalid');
  }
 
  // --- Validaciones individuales ---
  function validarNombre() {
    const el = document.getElementById('nombre');
    if (!el) return true;
    const ok = el.value.trim().length >= 2;
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }
 
  function validarEmail() {
    const el = document.getElementById('email');
    if (!el) return true;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ok = regex.test(el.value.trim());
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }
 
  function validarTipo() {
    const el = document.getElementById('tipo');
    if (!el) return true;
    const ok = el.value !== '';
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }
 
  function validarAsunto() {
    const el = document.getElementById('asunto');
    if (!el) return true;
    const ok = el.value.trim().length >= 5;
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }
 
  function validarMensaje() {
    const el = document.getElementById('mensaje');
    if (!el) return true;
    const ok = el.value.trim().length >= 20;
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }
 
  function validarPrivacidad() {
    const el = document.getElementById('privacidad');
    if (!el) return true;
    const ok = el.checked;
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }
 
  // --- Contador de caracteres del mensaje ---
  const mensajeEl = document.getElementById('mensaje');
  const charCountEl = document.getElementById('charCount');
 
  if (mensajeEl && charCountEl) {
    mensajeEl.addEventListener('input', () => {
      const len = mensajeEl.value.trim().length;
      charCountEl.textContent = len;
      const wrapper = charCountEl.closest('.contacto-char-count');
      if (wrapper) wrapper.classList.toggle('alcanzado', len >= 20);
    });
  }
 
  // --- Validación en tiempo real al salir de cada campo ---
  document.getElementById('nombre')?.addEventListener('blur', validarNombre);
  document.getElementById('email')?.addEventListener('blur', validarEmail);
  document.getElementById('tipo')?.addEventListener('change', validarTipo);
  document.getElementById('asunto')?.addEventListener('blur', validarAsunto);
  document.getElementById('mensaje')?.addEventListener('blur', validarMensaje);
  document.getElementById('privacidad')?.addEventListener('change', validarPrivacidad);
 
  // Limpiar estado al empezar a escribir
  ['nombre', 'email', 'asunto', 'mensaje'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', function () {
      if (!this.classList.contains('is-invalid')) return;
      limpiarEstado(this);
    });
  });
 
  // --- Submit ---
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
 
    const esValido = [
      validarNombre(),
      validarEmail(),
      validarTipo(),
      validarAsunto(),
      validarMensaje(),
      validarPrivacidad()
    ].every(Boolean);
 
    if (!esValido) {
      // Hacer scroll al primer campo inválido
      const primerError = contactForm.querySelector('.is-invalid');
      if (primerError) {
        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        primerError.focus();
      }
      return;
    }
 
    // Simular envío: mostrar spinner
    const btnTexto = document.getElementById('btnTexto');
    const btnLoading = document.getElementById('btnLoading');
    const btnEnviar = document.getElementById('btnEnviar');
 
    if (btnTexto && btnLoading && btnEnviar) {
      btnTexto.classList.add('d-none');
      btnLoading.classList.remove('d-none');
      btnEnviar.disabled = true;
    }
 
    // Simular respuesta del servidor (1.5s) y mostrar toast
    setTimeout(() => {
      // Restaurar botón
      if (btnTexto && btnLoading && btnEnviar) {
        btnTexto.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        btnEnviar.disabled = false;
      }
 
      // Toast de éxito
      const toastEl = document.createElement('div');
      toastEl.className = 'toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            ✅ ¡Mensaje enviado! Te responderemos en menos de 24h.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>`;
      document.body.appendChild(toastEl);
      new bootstrap.Toast(toastEl, { delay: 5000 }).show();
 
      // Resetear formulario
      contactForm.reset();
      contactForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
        limpiarEstado(el);
      });
      if (charCountEl) {
        charCountEl.textContent = '0';
        charCountEl.closest('.contacto-char-count')?.classList.remove('alcanzado');
      }
 
    }, 1500);
  });
}