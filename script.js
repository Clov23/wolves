//Animacion al hacer scroll
const hiddElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) =>{
    entries.forEach(entry =>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
});

hiddElements.forEach(elem => observer.observe(elem));

//boton interactivo
document.getElementById("about-btn").addEventListener("click", ()=>{
    alert("Somos una tienda enfocada en calidad, innovación y rendimiento deportivo");
})