// variable globale pour le "?chemin="" dans l'url
let chemin = [];

// fonction pour modifier le chemin
function setChemin(index, text) {
    // enleve tout les elements a droite de celui qu'on set
    chemin.length = index + 1;
    
    // met le texte a l'index
    chemin[index] = text.replace(/ /g, "-");

    // faire le bon string pour l'url
    const cheminString = chemin
        .map(part => encodeURIComponent(part)) // encode les caracteres speciaux
        .join("/"); // met des / entre les elements

    // met a jour l'URL
    const newUrl = window.location.pathname + "?chemin=" + cheminString;
    history.pushState({ chemin }, "", newUrl);
}

function formatdescription(description) {
    var FormattedDescription = ""
    description.forEach(partie => {
        if (partie.balise === "img"){
            FormattedDescription += `<img class="description-image" src=${partie.content}>\n`
        } else {
            FormattedDescription += `<${partie.balise}>${partie.content}</${partie.balise}>\n`
        }
    })
    return FormattedDescription
}


function showcards(cards) {
    // recupere le container des cards
    const cardcontainer = document.querySelector(".cartes-container")
    cardcontainer.innerHTML = ''

    for (const key of Object.keys(cards)) {
        currentcard = cards[key]
        // initialise la card
        let card = ""

        //rajoute les elements dans la card
        if ("tag" in currentcard) {
            card = ` <div class="card">
                        <button>
                            <div class="card-content">
                                <img class="card-logo" src="${currentcard["image"]}">
                                <div class="card-title">${key}</div>
                                <div class="card-tags">
                                    <span class="card-tag">${currentcard["tag"]}</span>
                                </div>
                            </div>  
                        </button>

                        <div class="card-description">
                            <h2>Description</h2>
                            ${formatdescription(currentcard["description"])}
                        </div>

                    </div>`
        } else {
            card = ` <div class="card">
                        <button>
                            <div class="card-content">
                                <img class="card-logo" src="${currentcard["image"]}">
                                <div class="card-title">${key}</div>
                            </div>
                        </button>

                        <div class="card-description">
                            <h2>Description</h2>
                                ${formatdescription(currentcard["description"])}
                        </div>
                        
                    </div>`
        }
        // ajoute la card dans le html
        cardcontainer.insertAdjacentHTML("beforeend", card)
    }

}



// fonction qui est appelée quand un des boutons du haut est appuyé
function showcategory(sections) {
    delete sections.couleur

    // vide les cards pour pas avoir les cards d'une autre section
    const cardcontainer = document.querySelector(".cartes-container")
    cardcontainer.innerHTML = ''
    const sectioncontainer = document.querySelector(".sections-container")
    sectioncontainer.innerHTML = ""

    // itere pour chaque sections principales
    for (const key of Object.keys(sections)) {


        // on cree une div pour mettre les bouttons
        const sectiondiv = document.createElement("div");
        sectiondiv.className = "section";

        // cree un boutton
        const newsectionbtn = document.createElement('button');
        // donne un nom au boutton
        newsectionbtn.textContent = key;

        // on recupere les noms des children
        let childrens = []
        for (const clefs of Object.keys(sections[key])) {
            childrens.push(clefs);
        }
        // si les childrens sont des cards et non des sous catégories
        if ("description" in sections[key][childrens[0]]) {
            // comme il n'y a pas de sous section, le bouton qu'on a crée est directement cliquable
            newsectionbtn.className = "button-section-principale-actif"
            // ajoute l'action du boutton
            newsectionbtn.addEventListener('click', () => {
                showcards(sections[key])
                setChemin(1, key)
            });
            // rajoute le bouton dans la div de la section
            sectiondiv.appendChild(newsectionbtn)
            // sinon (si les childrens sont des sous catégories)
        } else {
            // ---- on rajoute le boutton de la catégorie ----

            // comme il y a des sections, le bouton qu'on a crée est inactif
            newsectionbtn.className = "button-section-principale-inactif"
            // rajoute le bouton dans la div de la section
            sectiondiv.appendChild(newsectionbtn)

            // ---- on rajoute les bouttons des sous catégories en dessous ----

            // pour chaque sous catégorie
            for (const children of childrens) {
                // cree un boutton
                const newsectionbtn = document.createElement('button');
                // comme il n'y a pas de sous section, le bouton est directement cliquable
                newsectionbtn.className = "button-sous-sections"
                // donne un nom au boutton
                newsectionbtn.textContent = children;
                // ajoute l'action du boutton
                newsectionbtn.addEventListener('click', () => {
                    showcards(sections[key][children])
                    setChemin(1, key)
                    setChemin(2,children)
                });
                sectiondiv.appendChild(newsectionbtn)
            }
        }

        sectioncontainer.appendChild(sectiondiv)

    }
};


async function goto(chemin) {
    // recupere le json
    const response = await fetch('data/layout.json');
    const data = await response.json();

    // utilise le premier element du chemin pour recuperer la categorie
    const categorie = data[chemin[0]]

    // set la couleur a partir de la categorie
    couleur = categorie["couleur"]
    document.documentElement.style.setProperty('--current-color', couleur);

    // affiche la categorie
    showcategory(categorie)
    setChemin(0,chemin[0])

    //utilise l'avant dernier element du chemin pour set la section
    let section = {}
    setChemin(1,chemin[1])
    console.log(chemin)
    if (chemin.length = 3) {
        section = data[chemin[0]][chemin[1]][chemin[2]]
        setChemin(2,chemin[2])
    } else {
        section = data[chemin[0]][chemin[1]]
    }
    showcards(section)
}


async function loadLayoutData() {
    // recupere le container des boutons
    const buttonContainer = document.querySelector("#bouttons-nav");
    // recupere le json
    const response = await fetch('data/layout.json');
    const data = await response.json();

    // itere dans les clefs principales de notre json
    for (const key of Object.keys(data)) {
        // recupere la data a la current key 
        const valeurs = data[key];

        // cree un bouton
        const newbtn = document.createElement('button');
        newbtn.className = 'navigation-button';
        // rajoute le nom du boutton
        newbtn.textContent = key;
        // rajoute la couleur du boutton
        const couleur = valeurs["couleur"]
        newbtn.style.borderColor = couleur;
        newbtn.style.backgroundColor = couleur;
        newbtn.style.color = couleur;

        newbtn.addEventListener('click', () => {
            document.documentElement.style.setProperty('--current-color', couleur);
            showcategory(valeurs)
            setChemin(0,key)
        });
        buttonContainer.appendChild(newbtn);
    }
}




document.addEventListener('DOMContentLoaded', () => {
    loadLayoutData();

    // recupere ?chemin=
    const params = new URLSearchParams(window.location.search);
    const cheminParam = params.get("chemin");

    if (!cheminParam) return;

    // transforme "A-B/C-D" → ["A B", "C D"]
    const chemin = cheminParam
        .split("/")
        .map(part => part.replace(/-/g, " "));
    console.log(chemin)
    goto(chemin);
});
