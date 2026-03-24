const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

hiddenElements.forEach((el) => observer.observe(el));

document.getElementById("about-btn")?.addEventListener("click", () => {
  alert(
    "Somos una tienda enfocada en calidad, innovación y rendimiento deportivo."
  );
});

const formContacto = document.getElementById("formulario-contacto");
const feedbackContacto = document.getElementById("contacto-feedback");

function mostrarFeedbackContacto(mensaje, esError) {
  if (!feedbackContacto) return;
  feedbackContacto.textContent = mensaje;
  feedbackContacto.classList.remove(
    "d-none",
    "contacto-form__feedback--ok",
    "contacto-form__feedback--err"
  );
  feedbackContacto.classList.add(
    esError ? "contacto-form__feedback--err" : "contacto-form__feedback--ok"
  );
}

function ocultarFeedbackContacto() {
  feedbackContacto?.classList.add("d-none");
  feedbackContacto?.classList.remove(
    "contacto-form__feedback--ok",
    "contacto-form__feedback--err"
  );
}

formContacto?.addEventListener("submit", (e) => {
  e.preventDefault();
  ocultarFeedbackContacto();

  if (!formContacto.checkValidity()) {
    formContacto.reportValidity();
    return;
  }

  mostrarFeedbackContacto(
    "Gracias por escribirnos. Te responderemos a la brevedad.",
    false
  );
  formContacto.reset();
});
