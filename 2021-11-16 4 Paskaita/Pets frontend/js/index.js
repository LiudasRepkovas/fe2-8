import { getPets } from './helpers/requests.js';
import { createPetRow } from './helpers/render.js';

// randam html dokumente lenteles body
const tbodyElement = document.querySelector('tbody');

// randam html dokumente mygtukus
const buttons = document.querySelectorAll('.filters button');

// randam html dokumente amziaus antraste
const ageSortElement = document.querySelector('.ageSort');

// sukuriam array kuriam laikysim gyvunu tipus, kuriuos norim matyt
let typeFilters = [
    'dog', 'cat', 'bunny'
]

// sukuriam kintamaji rusiavimo tvarkai saugoti
let ageSortOrder = 'asc';

// funkcija padaro fetch requesta ir atspausdina rezultata ekrane
const fetchAndRenderPets = async () => {
    const pets = await getPets(ageSortOrder, typeFilters);
    renderPets(pets);
}

// funkcija atspausdina gyvuneliu array ekrane
const renderPets = (pets) => {
    tbodyElement.innerText = null;
    const rowsElements = pets.map(createPetRow);
    tbodyElement.append(...rowsElements);
}

// funkcija pakeicia rusiavimo tvarka. pakeicia kintamaji ir elemento kuris tai rodo teksta.
const toggleSort = () => {
    if(ageSortOrder === 'asc'){
        ageSortOrder = 'desc';
    } else {
        ageSortOrder = 'asc';
    }

    ageSortElement.innerText = `Age (${ageSortOrder})`;
}

// paspaudus ant age antrastes liepiam pakeisti sort kintamaji ir gauti naujus duomenis is backendo
ageSortElement.addEventListener('click', (event) => {
    toggleSort();
    fetchAndRenderPets();
})

// funkcija priima mygtuka
const addFilter = (button) => {
    // pasiimam mygtuko teksta
    const type = button.innerText.toLowerCase();

    if(typeFilters.includes(type)){
        // jei filtru masyve yra mygtuko tekstas tai isimam ji is masyvo
        typeFilters = typeFilters.filter(item => item !== type);
        button.classList = ''
    } else {
        // jei mygtuko teksto masyve nera - pridedam ji i filters masyva
        typeFilters.push(type);
        button.classList = 'selected'
    }

    fetchAndRenderPets();
}

// padarom kad paspaudus kiekviena mygtuk
buttons.forEach(button => {
    button.addEventListener('click', () => {addFilter(button)})
});


// puslapiui pirma kart uzsikrovus parsisiunciam duomenis is back ir juos atvaizduojam
fetchAndRenderPets();

