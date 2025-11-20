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
        console.log(data);
        console.log("Fichier JSON");

        recherches.addEventListener("input", () =>{
        const texte = recherches.value.toLowerCase();
        resultatDiv.innerHTML = "";

    if (!texte) return;

//Fonction récursive pour chercher les clés correspondant à la recherche

function chercher(obj, texte){
    let liste = [];
    for (let cle in obj){
        if (cle.toLowerCase().includes(texte)) liste.push(cle);
        if (typeof obj[cle] === "object" && obj[cle] !== null){
            liste = liste.concat(chercher(obj[cle], texte));
        }
        }
        return liste;
    }



    const clesTrouvees = chercher(dataJSON, texte);

  //Affichage des résultats dans la barre de recherche
   if (clesTrouvees.length === 0){
    resultatDiv.textContent ="Aucun élément trouvé";
    return;
    }

    clesTrouvees.forEach(cle => {
        const div = document.createElement("div");
        div.textContent = cle;
        div.style.cursor = "pointer";
    

    
      //Au clic afficher lew informations
div.addEventListener("click", (e) => {
    function chercherCarte(obj, nom) {
        for (let cle in obj){
            if (cle ===  nom) return obj[cle];
            if (typeof obj[cle] === "object" && obj[cle] !== null){
                const res = chercherCarte(obj[cle], nom);
                if (res) return res;
            }
        }
        return null;
    }

    //On récupère les informations associées à la clé cliquée
    const infos = chercherCarte(dataJSON, cle);

    // Si l'objet existe afficher les informations ou rien au final
    
    if (infos){
        carteImage.src = infos.image || "";
        carteImage.alt = cle;
        carteTitre.textContent = cle;
        carteDescription.textContent = infos.description || "";
    }

    resultatDiv.innerHTML = "";
    recherches.value = cle;
    });

    resultatDiv.appendChild(div);
});
});
     })
     .catch(err => console.error("Erreur:", err));
});

document.querySelectorAll(".carte").forEach(c => {
    c.addEventListener("click", () =>{
        if (c.classList.contains("active")){
            c.classList.remove("active");
        }else{
        document.querySelectorAll(".carte").forEach(card => card.classList.remove("active"));
        c.classList.add("active");
    }
    });

});