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