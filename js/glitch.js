const messages = [
    "Esta página ha llegado a ti gracias a tu arte, tu visión y la manera en que proyectas tu creatividad. Posees la esencia exacta para formar parte de este proyecto.",
    "Este proyecto tiene como propósito crear una comunidad de artistas comprometidos a colaborar y generar contenido constante, permitiéndonos alcanzar un impacto mucho más grande del que cualquiera de nosotros podría lograr de manera individual.",
    "Esto es para creadores apasionados que tienen el sueño de vivir de su arte y quieren, finalmente, hacer algo para superar el miedo de compartir su obra con el mundo.",
    "Si consideras que aún no es el momento de perseguir tus ambiciones o prefieres mantener tu trabajo en la intimidad, pulsa 'NO'. Si estás listo para dar el primer paso y construir tu carrera junto a otros artistas, pulsa 'SÍ'."
];

let currentStep = 0;
let noCount = 0; 
let isReflecting = false; 
let isDeadEnd = false; 

const textElement = document.getElementById("typewriter-text");
const arrow = document.getElementById("next-arrow");
const btnContainer = document.getElementById("button-container");

function typeWriter(text, i = 0) {
    arrow.classList.add("hidden");
    if (i < text.length) {
        textElement.innerHTML = text.substring(0, i + 1);
        setTimeout(() => typeWriter(text, i + 1), 20);
    } else {
        if (!isReflecting && !isDeadEnd && currentStep === messages.length - 1) {
            btnContainer.classList.remove("hidden");
            btnContainer.style.display = "flex"; 
        } else if (currentStep < messages.length - 1) {
            arrow.classList.remove("hidden");
        }
    }
}

function nextStep() {
    currentStep++;
    typeWriter(messages[currentStep]);
}

function handleResponse(choice) {
    btnContainer.classList.add("hidden");
    btnContainer.style.display = "none"; 

    if (choice === 'no') {
        noCount++;
        if (noCount === 1) {
            isReflecting = true; 
            typeWriter("Recuerda que todo es 'cringe'... hasta que funciona.");
            setTimeout(() => {
                isReflecting = false; 
                btnContainer.classList.remove("hidden");
                btnContainer.style.display = "flex"; 
            }, 4000); 
        } else {
            isDeadEnd = true; 
            typeWriter("Sin resentimientos. Esperamos que encuentres aquello que realmente te apasione y decidas perseguirlo con determinación.");
        }
    } else {
        // Lógica para cuando el usuario pulsa 'SÍ'
        isReflecting = true; 
        typeWriter("Recuerda que todo es 'cringe'... hasta que funciona.");
        
        setTimeout(() => {
            const overlay = document.getElementById("intro-overlay");
            overlay.style.transition = "opacity 2s ease";
            overlay.style.opacity = "0";
            
            setTimeout(() => {
                overlay.style.display = "none";
                const main = document.getElementById("main-content");
                main.classList.remove("hidden");
                main.style.display = "flex"; 
                main.style.opacity = "1";
            }, 2000);
        }, 5000); 
    }
}

// Iniciar la máquina de escribir
typeWriter(messages[0]);

// MOTOR DE DESPLAZAMIENTO HORIZONTAL (Ajustado a 3 paneles)
window.addEventListener('scroll', () => {
    const section = document.querySelector('.parallax-scroll-section');
    const rail = document.querySelector('.parallax-rail');
    
    if (section && rail) {
        const rect = section.getBoundingClientRect();
        
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
            const scrollInside = Math.abs(rect.top);
            const maxScroll = section.offsetHeight - window.innerHeight;
            const progress = scrollInside / maxScroll;
            
            // Movemos 200vw porque el primer panel ya está visible y son 3 paneles en total
            rail.style.transform = `translateX(-${progress * 200}vw)`;
        }
    }
});

// Lógica para el typewriter final al hacer scroll
const finalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startFinalTypewriter();
            finalObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

finalObserver.observe(document.querySelector('.final-ask-section'));

function startFinalTypewriter() {
    const text = "Entonces. ¿Quieres formar parte de este proyecto?";
    const element = document.getElementById("final-typewriter");
    const instruction = document.getElementById("final-instruction");
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else {
            // Pausa de 3 segundos antes de mostrar la instrucción
            setTimeout(() => {
                instruction.classList.remove("hidden");
                instruction.style.opacity = "1";
            }, 3000);
        }
    }
    type();
}

// --- Lógica del Formulario ---

const form = document.getElementById("artist-form");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        
        const data = new FormData(form);
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            const thanksOverlay = document.getElementById("thanks-overlay");
            thanksOverlay.classList.remove("hidden");
            thanksOverlay.style.display = "flex";
            startThanksTypewriter();
        } else {
            alert("Hubo un error al enviar. Por favor, inténtalo de nuevo.");
        }
    });
}

function startThanksTypewriter() {
    const text = "Muchas gracias por confiar en este proyecto";
    const element = document.getElementById("thanks-typewriter");
    const instruction = document.getElementById("thanks-instruction");
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else {
            setTimeout(() => {
                instruction.classList.remove("hidden");
                instruction.style.opacity = "1";
            }, 3000);
        }
    }
    type();
}

// ADICIÓN FINAL: Ocultar la flecha orgánica al mover el scroll lateral[cite: 8]
const horizontalScroll = document.querySelector('.horizontal-scroll-container');
const inlineArrow = document.querySelector('.inline-arrow');

if (horizontalScroll && inlineArrow) {
    horizontalScroll.addEventListener('scroll', () => {
        if (horizontalScroll.scrollLeft > 50) {
            inlineArrow.style.opacity = '0';
            inlineArrow.style.transition = 'opacity 0.5s ease';
        } else {
            inlineArrow.style.opacity = '1';
        }
    });
}

// Función para que la flecha sea presionable y haga scroll al segundo panel
function scrollToNextPanel() {
    const container = document.querySelector('.horizontal-scroll-container');
    if (container) {
        container.scrollTo({
            left: window.innerWidth,
            behavior: 'smooth'
        });
    }
}

// Detector para lanzar la animación de "asomado" una sola vez
const peekObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const wrapper = entry.target.querySelector('.horizontal-wrapper');
            if (wrapper && !wrapper.classList.contains('animate-peek')) {
                setTimeout(() => {
                    wrapper.classList.add('animate-peek');
                }, 600);
            }
        }
    });
}, { threshold: 0.4 });

const targetSection = document.querySelector('.horizontal-scroll-container');
if (targetSection) {
    peekObserver.observe(targetSection);
}

// Ocultar la flecha nueva cuando el usuario ya empezó a scrollear
if (targetSection) {
    targetSection.addEventListener('scroll', () => {
        const trigger = document.querySelector('.scroll-hint-trigger');
        if (trigger) {
            trigger.style.opacity = targetSection.scrollLeft > 50 ? '0' : '0.8';
            trigger.style.pointerEvents = targetSection.scrollLeft > 50 ? 'none' : 'auto';
        }
    });
}