/* 1. DARK MODE & PERSISTENCE */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

/* Fonction d'actualisatoin de l'icône selon le mode actif du bouton (lune ou soleil) */
function updateIcon(isDark) {
    if (isDark) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

/* Fonction de rétrer dynamique des styles CSS globaux en mode sombre*/
function applyForceDarkMode() {
    const isDark = document.body.classList.contains('dark');
    let styleTag = document.getElementById('force-dark-style');

    if (isDark) {
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'force-dark-style';
            document.head.appendChild(styleTag);
        }
    
         /* Injection du CSS brut pour forcer les couleurs sombres sur l'ensemble de la page*/
        styleTag.innerHTML = `
            body.dark, 
            body.dark *:not(.card-innovation):not(.stat-item), 
            body.dark *:not(.card-innovation):not(.stat-item):before, 
            body.dark *:not(.card-innovation):not(.stat-item):after { 
                background-color: #040404 !important; 
                background-image: none !important; 
                color: #f1f5f9 !important; 
                border-color: #090909 !important;
            }
                body.dark #grille-intervenants { 
        background-color: #040404 !important; 
        background-image: none !important; 
    }
        `;
    } else if (styleTag) {
        styleTag.remove();
    }
}

/* Écouteur d'événement quant on clic sur le bouton pour basculer le thème*/
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    updateIcon(isDark);
    applyForceDarkMode();
});

// Au chargement de la page
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    updateIcon(true);
    applyForceDarkMode();
}
/* 2. NAVBAR DYNAMIQUE & HAMBURGER */
const header = document.querySelector('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

// Modification de l'apparence du header lorsque l'utilisateur fait défiler la page vers le bas
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        header.classList.add('navbar-scrolled');
    } else {
        header.classList.remove('navbar-scrolled');
    }
});


// Ouvrture ou fermeture du menu de navigation mobile en clicant sur le bouton hamburger
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});



/* 3. COMPTE À REBOURS */
document.addEventListener('DOMContentLoaded', () => {
    const targetDate = new Date("December 31, 2026 10:00:00").getTime();

    const d = document.getElementById('days');
    const h = document.getElementById('hours');
    const m = document.getElementById('minutes');
    const s = document.getElementById('seconds');

    if (d && h && m && s) {
        // Mise à jour du compte à rebours toutes les secondes (1000 ms)
        setInterval(() => {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff > 0) {
        // Calcule et affiche les jours, heures, minutes et secondes avec un formatage à 2 chiffres
                d.innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
                h.innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                m.innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                s.innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
            }
        }, 1000); 
    }
});

/* 4. ANIMATION STATISTIQUES AU SCROLL */
const statsSection = document.getElementById('chiffres');
if (statsSection) {
    // Utilisation l'IntersectionObserver pour déclencher l'animation quand la section est visible à l'écran
    const observerStats = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const headers = statsSection.querySelectorAll('h3');
                headers.forEach(h3 => {
                    const fullText = h3.innerText;
                    const target = parseInt(fullText.replace('+', '')); 
                    let current = 0;
                    const increment = Math.max(1, Math.ceil(target / 50));

    /* Fonction récursive pour incrémentation progressive du chiffre */         
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

/* 5. ONGLETS PROGRAMME (programme.html) */

function showDay(day) {    //Afffiche le contenue du jour selectionné
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));      /*retire le classe active des boutons*/
    
    document.getElementById(`day${day}`).style.display = 'block';
    event.currentTarget.classList.add('active');   /* Active le bouton cliqué*/
}

/* 6. FILTRAGE INTERVENANTS  */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.intervenant-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-filter');
        cards.forEach(card => {

             // Affiche ou masque la carte selon si elle appartient à la catégorie sélectionnée
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* 7. VALIDATION FORMULAIRE */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        if (email.includes('@') && phone.length >= 8 && message.length >= 20) {
            document.getElementById('formSuccess').innerText = "Inscription réussie !";
            contactForm.reset();
        } else {
            alert("Veuillez vérifier vos champs (Email, Téléphone 8 chiffres, Message 20 chars).");
        }
    });
}

/* 8. BOUTON RETOUR EN HAUT */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* 9. ANNÉE DYNAMIQUE FOOTER */
document.querySelectorAll('footer p').forEach(p => {
    if (p.innerText.includes('2026')) {
        p.innerText = p.innerText.replace('2026', new Date().getFullYear());
    }
});

// Anime l'apparition de la carte du formulaire à l'écran
document.addEventListener("DOMContentLoaded", () => {
    const carte = document.querySelector('.form-card');

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                carte.classList.add('visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, {
        
        threshold: 0.5 
    });

    if (carte) {
        carte.classList.remove('visible');
        observer.observe(carte);
    }
});
