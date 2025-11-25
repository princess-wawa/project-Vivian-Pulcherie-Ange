// Je m'assure que la page est entièrement chargée avant de lancer mon code.
document.addEventListener('DOMContentLoaded', () => {
    
    
        // Je récupère l'élément <body> pour changer le fond.
    const body = document.body;
    
    // Je récupère l'emplacement pour l'année.
    const anneeSpan = document.getElementById('current-year');
    
    // Je récupère l'emplacement pour l'heure et la date.
    const datetimeSpan = document.getElementById('datetime-display');

    
    // ---  GESTION DE LA ROTATION D'IMAGE ---
    
    // Ma liste d'images de fond.
    const imagePaths = [
        "url('data/images/externatic.png')", 
        "url('data/images/logo-white.png')",
    ];
    
    // Mon index pour savoir quelle image est affichée (je commence à 0).
    let currentIndex = 0; 
    
    // Je veux que ça tourne toutes les 2 secondes (2000 ms).
    const DUREE_ROTATION = 2000; 

    
    /**
     * Ma fonction qui change l'image de fond.
     */
    function rotateBackground() {
        // J'applique l'image actuelle au body.
        body.style.backgroundImage = imagePaths[currentIndex];
        
        // Je passe à l'image suivante (le modulo me fait revenir à 0 à la fin).
        currentIndex = (currentIndex + 1) % imagePaths.length;
    }

    
    // ---  GESTION DE L'HORLOGE DYNAMIQUE ---
    
    // Je mets à jour l'heure toutes les 1 seconde (1000 ms).
    const DUREE_HORLOGE = 1000; 

    /**
     * Ma fonction qui met à jour l'heure dans mon footer.
     */
    function updateClock() {
        // Je récupère la date et l'heure exactes MAINTENANT.
        const now = new Date(); 
        
        // Mes options pour afficher l'heure et la date en français.
        const options = { 
            weekday: 'long', day: 'numeric', month: 'long', 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        };

        // Je mets à jour l'année.
        if (anneeSpan) {
            anneeSpan.textContent = now.getFullYear(); 
        }

        // J'affiche l'heure et la date complètes dans le format français.
        if (datetimeSpan) {
            datetimeSpan.textContent = now.toLocaleDateString('fr-FR', options);
        }
    }

    
    // --- LANCEMENT DU CODE ---
    
    // Je lance la rotation une première fois pour afficher tout de suite la première image.
    rotateBackground(); 
    
    // Je mets en place la rotation répétitive toutes les 2 secondes.
    setInterval(rotateBackground, DUREE_ROTATION); 

    // J'affiche l'heure immédiatement.
    updateClock(); 
    
    // Je mets en place la mise à jour de l'horloge chaque seconde.
    setInterval(updateClock, DUREE_HORLOGE); 
});