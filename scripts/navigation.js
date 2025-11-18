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
        newbtn.style.borderColor = valeurs["couleur"];

        newbtn.addEventListener('click', () => {
                
        });
        buttonContainer.appendChild(newbtn);
    }
}

document.addEventListener('DOMContentLoaded', loadLayoutData);