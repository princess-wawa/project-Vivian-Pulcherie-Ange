function showcards(cards){
    // recupere le container des cards
    const cardcontainer = document.querySelector(".cartes-container")
    cardcontainer.innerHTML = ''

    for (const key of Object.keys(cards)){
        currentcard = cards[key]
        // initialise la card
        let card = ""

        //rajoute les elements dans la card
        if ("tag" in currentcard){
        card = ` <div class="card">
                        <button>
                            <div class="card-content">
                                <img class="card-logo" src="${currentcard["image"]}">
                                <div class="card-title">${key}</div>
                                <div class="card-tags">
                                    <span class="card-tag">${currentcard["tag"]}</span>
                                </div>
                            </div>

                            <div class="card-description">
                                <h2>Description</h2>
                                <p>
                                    ${currentcard["description"]}
                                </p>
                            </div>

                        </button>
                    </div>`
        } else {
        card =  ` <div class="card">
                        <button>
                            <div class="card-content">
                                <img class="card-logo" src="${currentcard["image"]}">
                                <div class="card-title">${key}</div>
                            </div>

                            <div class="card-description">
                                <h2>Description</h2>
                                <p>
                                    ${currentcard["description"]}
                                </p>
                            </div>

                        </button>
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
        for (const clefs of Object.keys(sections[key])){
            childrens.push(clefs);
        }
        // si les childrens sont des cards et non des sous catégories
        if ("description" in sections[key][childrens[0]]){
            // comme il n'y a pas de sous section, le bouton qu'on a crée est directement cliquable
            newsectionbtn.className = "button-section-principale-actif"
            // ajoute l'action du boutton
            newsectionbtn.addEventListener('click', () =>{
                showcards(sections[key])
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
            for (const children of childrens){
                // cree un boutton
                const newsectionbtn = document.createElement('button');
                // comme il n'y a pas de sous section, le bouton est directement cliquable
                newsectionbtn.className = "button-sous-sections"
                // donne un nom au boutton
                newsectionbtn.textContent = children;
                // ajoute l'action du boutton
                newsectionbtn.addEventListener('click', () =>{
                    showcards(sections[key][children])
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

    //utilise l'avant dernier element du chemin pour set la section
    let section = {}
    if (chemin.length = 3){
        section = data[chemin[0]][chemin[1]][chemin[2]]
    } else {
        section = data[chemin[0]][chemin[1]][chemin[2]][chemin[3]]
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
        });
        buttonContainer.appendChild(newbtn);
    }
}

document.addEventListener('DOMContentLoaded', loadLayoutData);