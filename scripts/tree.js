document.addEventListener("DOMContentLoaded", () => {


    const resultatDiv = document.querySelector(".resultat");
    const recherches = document.getElementById("search-input");
    const suggestions = document.querySelector(".suggestions");
    const listes = document.getElementById("tech-list");


    const carteImage = document.getElementById("carte-image");
    const carteTag = document.querySelector(".tag");
    const carteTitre = document.querySelector(".div_présentation_texte");
    const carteDescription = document.querySelector(".div_description");


    //Relier le fichier JSON
    fetch("./data/layout.json")
        .then(response => response.json()) //On transforme la réponse en JSON
        .then(data => {
            dataJSON = data;

            recherches.addEventListener("input", () => {
                const texte = recherches.value.toLowerCase();
                resultatDiv.innerHTML = "";

                if (!texte) return;

                //Fonction récursive pour chercher les clés correspondant à la recherche

                function chercher(obj, texte, chemin = []) {
                    // initialise une liste pour les termes qu'on peu rechercher
                    let resultats = [];

                    // pour chaque objet qu'on a 
                    for (let cle in obj) {
                        // chemin mis à jour pour cette clé
                        let nouveauChemin = [...chemin, cle];

                        // si la clé correspond au texte recherché
                        if (cle.toLowerCase().includes(texte)) {
                            resultats.push(nouveauChemin);
                        }

                        // si la valeur est un objet, faire la recherche de facon recursive dedans
                        if (typeof obj[cle] === "object" && obj[cle] !== null) {
                            resultats = resultats.concat(
                                chercher(obj[cle], texte, nouveauChemin)
                            );
                        }
                    }

                    return resultats;
                }

                // utilise la fonction recursive crée juste avant pour rechercher les clefs
                const cheminsTrouvees = chercher(dataJSON, texte);

                //Affichage des résultats dans la barre de recherche
                if (cheminsTrouvees.length === 0) {
                    resultatDiv.textContent = "Aucun élément trouvé";
                    return;
                }

                cheminsTrouvees.forEach(chemin => {
                    const div = document.createElement("div");
                    // le dernier element du chemin est celui qui a le texte
                    div.textContent = chemin.at(-1);
                    div.style.cursor = "pointer";



                    //Au clic afficher les informations
                    div.addEventListener("click", (e) => {
                        goto(chemin)
                    });

                    resultatDiv.appendChild(div);
                });
            });
        })
        .catch(err => console.error("Erreur:", err));
});

document.querySelectorAll(".carte").forEach(c => {
    c.addEventListener("click", () => {
        if (c.classList.contains("active")) {
            c.classList.remove("active");
        } else {
            document.querySelectorAll(".carte").forEach(card => card.classList.remove("active"));
            c.classList.add("active");
        }
    });

});