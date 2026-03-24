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
