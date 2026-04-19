/* ==============================================
   Navbar: clase "scrolled" al hacer scroll
   ============================================== */

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }
});

/* ==============================================
   Animación al hacer scroll (animate-on-scroll)
   ============================================== */

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

/* ==============================================
   Index: Contador animado (stats)
   ============================================== */

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

/* ==============================================
   DESTINOS: FILTROS COMBINADOS (Tipo + Continente + Búsqueda)
   ============================================== */

// Estado global de filtros
const filtroEstado = {
  tipo: "todos",
  continente: "todos",
  busqueda: "",
};

// Referencias DOM
const filtrosTipoBtns = document.querySelectorAll(".filtro-btn");
const filtrosContinenteBtns = document.querySelectorAll(".filtro-continente");
const destinoItems = document.querySelectorAll(".destino-item");
const buscadorDestinos = document.getElementById("buscadorDestinos");
const sinResultados = document.getElementById("sinResultados");

// Función principal: aplica TODOS los filtros simultáneamente
function aplicarFiltrosCombinados() {
  let visibles = 0;

  destinoItems.forEach((item) => {
    const tipoItem = item.dataset.tipo || "";
    const continenteItem = item.dataset.continente || "";
    const nombreItem = (item.dataset.nombre || "").toLowerCase();

    // Criterios individuales
    const coincideTipo =
      filtroEstado.tipo === "todos" || tipoItem === filtroEstado.tipo;
    const coincideContinente =
      filtroEstado.continente === "todos" ||
      continenteItem === filtroEstado.continente;
    const coincideBusqueda =
      filtroEstado.busqueda === "" ||
      nombreItem.includes(filtroEstado.busqueda);

    const mostrar = coincideTipo && coincideContinente && coincideBusqueda;

    item.classList.toggle("oculto", !mostrar);
    if (mostrar) visibles++;
  });

  // Mensaje sin resultados
  if (sinResultados) {
    sinResultados.classList.toggle("d-none", visibles > 0);
  }
}

// Actualizar estado visual de botones de tipo
function actualizarBotonesTipo(filtroActivo) {
  filtrosTipoBtns.forEach((btn) => {
    const esActivo = btn.dataset.filtro === filtroActivo;
    btn.classList.toggle("active", esActivo);
    btn.setAttribute("aria-pressed", esActivo);
  });
}

// Actualizar estado visual de botones de continente
function actualizarBotonesContinente(continenteActivo) {
  filtrosContinenteBtns.forEach((btn) => {
    const esActivo = btn.dataset.continente === continenteActivo;
    btn.classList.toggle("active", esActivo);
    btn.setAttribute("aria-pressed", esActivo);
  });
}

/* ===  Evento: Filtros por tipo de entorno === */
filtrosTipoBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroEstado.tipo = btn.dataset.filtro;
    actualizarBotonesTipo(filtroEstado.tipo);
    aplicarFiltrosCombinados();
  });
});

/* === Eventos: Filtros por continente === */
filtrosContinenteBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroEstado.continente = btn.dataset.continente;
    actualizarBotonesContinente(filtroEstado.continente);
    aplicarFiltrosCombinados();
  });
});

/* === Evento: Buscador === */
if (buscadorDestinos) {
  buscadorDestinos.addEventListener("input", (e) => {
    filtroEstado.busqueda = e.target.value.toLowerCase().trim();
    aplicarFiltrosCombinados();
  });
}

/* === Botón para resetear todos los filtros  === */
const btnReset = document.getElementById("btnResetFiltros");
if (btnReset) {
  btnReset.addEventListener("click", () => {
    filtroEstado.tipo = "todos";
    filtroEstado.continente = "todos";
    filtroEstado.busqueda = "";

    actualizarBotonesTipo("todos");
    actualizarBotonesContinente("todos");
    if (buscadorDestinos) buscadorDestinos.value = "";

    aplicarFiltrosCombinados();
  });
}

/* ==============================================
   Sobre nosotros:  Newsletter toast  
   ============================================== */
const btnNewsletter = document.getElementById("btnNewsletter");
const inputNewsletter = document.getElementById("emailNewsletter");

if (btnNewsletter && inputNewsletter) {
  // Validación en tiempo real: limpiar error al escribir ===
  inputNewsletter.addEventListener("input", () => {
    inputNewsletter.classList.remove("is-invalid");
  });

  // === Validación al hacer click en "Suscribirme" ===
  btnNewsletter.addEventListener("click", () => {
    // Caso éxito: email válido y con valor
    if (inputNewsletter.value && inputNewsletter.validity.valid) {
      // Crear y mostrar toast de éxito
      const toastEl = document.createElement("div");
      toastEl.className =
        "toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3";
      toastEl.setAttribute("role", "alert");
      toastEl.setAttribute("aria-live", "assertive");
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">¡Suscripción completada! Bienvenido a DestinoGreen.</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>`;

      document.body.appendChild(toastEl);
      const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
      toast.show();

      // Limpiar input después de mostrar toast
      inputNewsletter.value = "";
      inputNewsletter.classList.remove("is-invalid");

      // Eliminar el toast cuando se cierre
      toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
    }
    // Caso error: email vacío o inválido
    else {
      inputNewsletter.classList.add("is-invalid");

      // Opcional: hacer focus en el input para guiar al usuario
      inputNewsletter.focus();
    }
  });
}

/* ==============================================
   Contacto: Validación de formulario
   ============================================== */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  // --- Helpers ---
  function marcarValido(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  function marcarInvalido(input) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }

  function limpiarEstado(input) {
    input.classList.remove("is-valid", "is-invalid");
  }

  // --- Validaciones individuales ---
  function validarNombre() {
    const el = document.getElementById("nombre");
    if (!el) return true;
    const ok = el.value.trim().length >= 2;
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }

  function validarEmail() {
    const el = document.getElementById("email");
    if (!el) return true;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ok = regex.test(el.value.trim());
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }

  function validarTipo() {
    const el = document.getElementById("tipo");
    if (!el) return true;
    const ok = el.value !== "";
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }

  function validarAsunto() {
    const el = document.getElementById("asunto");
    if (!el) return true;
    const ok = el.value.trim().length >= 5;
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }

  function validarMensaje() {
    const el = document.getElementById("mensaje");
    if (!el) return true;
    const ok = el.value.trim().length >= 20;
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }

  function validarPrivacidad() {
    const el = document.getElementById("privacidad");
    if (!el) return true;
    const ok = el.checked;
    ok ? marcarValido(el) : marcarInvalido(el);
    return ok;
  }

  // --- Contador de caracteres del mensaje ---
  const mensajeEl = document.getElementById("mensaje");
  const charCountEl = document.getElementById("charCount");

  if (mensajeEl && charCountEl) {
    mensajeEl.addEventListener("input", () => {
      const len = mensajeEl.value.trim().length;
      charCountEl.textContent = len;
      const wrapper = charCountEl.closest(".contacto-char-count");
      if (wrapper) wrapper.classList.toggle("alcanzado", len >= 20);
    });
  }

  // --- Validación en tiempo real al salir de cada campo ---
  document.getElementById("nombre")?.addEventListener("blur", validarNombre);
  document.getElementById("email")?.addEventListener("blur", validarEmail);
  document.getElementById("tipo")?.addEventListener("change", validarTipo);
  document.getElementById("asunto")?.addEventListener("blur", validarAsunto);
  document.getElementById("mensaje")?.addEventListener("blur", validarMensaje);
  document
    .getElementById("privacidad")
    ?.addEventListener("change", validarPrivacidad);

  // Limpiar estado al empezar a escribir
  ["nombre", "email", "asunto", "mensaje"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", function () {
      if (!this.classList.contains("is-invalid")) return;
      limpiarEstado(this);
    });
  });

  // --- Submit ---
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const esValido = [
      validarNombre(),
      validarEmail(),
      validarTipo(),
      validarAsunto(),
      validarMensaje(),
      validarPrivacidad(),
    ].every(Boolean);

    if (!esValido) {
      // Hacer scroll al primer campo inválido
      const primerError = contactForm.querySelector(".is-invalid");
      if (primerError) {
        primerError.scrollIntoView({ behavior: "smooth", block: "center" });
        primerError.focus();
      }
      return;
    }

    // Simular envío: mostrar spinner
    const btnTexto = document.getElementById("btnTexto");
    const btnLoading = document.getElementById("btnLoading");
    const btnEnviar = document.getElementById("btnEnviar");

    if (btnTexto && btnLoading && btnEnviar) {
      btnTexto.classList.add("d-none");
      btnLoading.classList.remove("d-none");
      btnEnviar.disabled = true;
    }

    // Simular respuesta del servidor (1.5s) y mostrar toast
    setTimeout(() => {
      // Restaurar botón
      if (btnTexto && btnLoading && btnEnviar) {
        btnTexto.classList.remove("d-none");
        btnLoading.classList.add("d-none");
        btnEnviar.disabled = false;
      }

      // Toast de éxito
      const toastEl = document.createElement("div");
      toastEl.className =
        "toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            ¡Mensaje enviado! Te responderemos en menos de 24h.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>`;
      document.body.appendChild(toastEl);
      new bootstrap.Toast(toastEl, { delay: 5000 }).show();

      // Resetear formulario
      contactForm.reset();
      contactForm.querySelectorAll(".is-valid, .is-invalid").forEach((el) => {
        limpiarEstado(el);
      });
      if (charCountEl) {
        charCountEl.textContent = "0";
        charCountEl
          .closest(".contacto-char-count")
          ?.classList.remove("alcanzado");
      }
    }, 1500);
  });
}
