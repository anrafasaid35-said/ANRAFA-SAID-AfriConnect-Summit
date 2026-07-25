/* ========================================== */
/* 1. DARK MODE & PERSISTENCE */
/* ========================================== */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

/* Fonction pour gérer l'ajout ou le retrait du voile sombre sur la vidéo via JS */
function toggleVideoOverlay(isDark) {
    const heroVideoSection = document.getElementById('hero-video-section');
    if (!heroVideoSection) return;

    let overlay = heroVideoSection.querySelector('.video-overlay-voile');

    if (isDark) {
        /* Si on est en mode sombre et que le voile n'existe pas encore, on le crée */
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'video-overlay-voile';
            heroVideoSection.appendChild(overlay);
        }
    } else {
        /* Si on quitte le mode sombre, on supprime le voile s'il existe */
        if (overlay) {
            overlay.remove();
        }
    }
}

/* Fonction d'actualisation de l'icône selon le mode actif du bouton (lune ou soleil) */
function updateIcon(isDark) {
    if (isDark) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

/* Écouteur d'événement quand on clique sur le bouton pour basculer le thème */
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    updateIcon(isDark);
    toggleVideoOverlay(isDark);     /*  On active/désactive le voile ici */
});

/* Au chargement de la page */
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    updateIcon(true);
    toggleVideoOverlay(true);    /*  On active le voile au chargement si le mode sombre est mémorisé */
}
/* ========================================== */
/* 2. NAVBAR DYNAMIQUE & HAMBURGER */
/* ========================================== */
const header = document.querySelector('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

/* Modification de l'apparence du header lorsque l'utilisateur fait défiler la page vers le bas */
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        header.classList.add('navbar-scrolled');
    } else {
        header.classList.remove('navbar-scrolled');
    }
});


/* Ouvrture ou fermeture du menu de navigation mobile en clicant sur le bouton hamburger */
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

/* ========================================== */
/* 3. COMPTE À REBOURS */
/* ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const targetDate = new Date("December 31, 2026 10:00:00").getTime();

    const d = document.getElementById('days');
    const h = document.getElementById('hours');
    const m = document.getElementById('minutes');
    const s = document.getElementById('seconds');

    if (d && h && m && s) {
        /* Mise à jour du compte à rebours toutes les secondes (1000 ms)*/
        setInterval(() => {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff > 0) {
        /* Calcule et affiche les jours, heures, minutes et secondes avec un formatage à 2 chiffres*/
                d.innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
                h.innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                m.innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                s.innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
            }
        }, 1000); 
    }
});

/* ========================================== */
/* 4. ANIMATION STATISTIQUES AU SCROLL */
/* ========================================== */
const statsSection = document.getElementById('chiffres');
if (statsSection) {
    /* Utilisation l'IntersectionObserver pour déclencher l'animation quand la section est visible à l'écran*/
    const observerStats = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const headers = statsSection.querySelectorAll('h3');
                headers.forEach(h3 => {
                    const fullText = h3.innerText;
                    const target = parseInt(fullText.replace('+', '')); 
                    let current = 0;
                    const increment = Math.max(1, Math.ceil(target / 50));

    /* Fonction récursive pour l'incrémentation progressive du chiffre */         
                    const update = () => {
                        if (current < target) {
                            current += increment;
                            if (current > target) current = target;
                            h3.innerText = (fullText.includes('+') ? '+' : '') + current;
                            setTimeout(update, 30);
                        }
                    };
                    update();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observerStats.observe(statsSection);
}

/* ========================================== */
/* 5. ONGLETS PROGRAMME (programme.html) */
/* ========================================== */
function showDay(day) {    /*Afffichage du contenue du jour selectionné */
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));      /*retire le classe active des boutons*/
    
    document.getElementById(`day${day}`).style.display = 'block';
    event.currentTarget.classList.add('active');   /* Active le bouton cliqué*/
}