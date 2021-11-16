import { capitalizeFirstLetter } from "./text.js";

// kuriam lenteles eilutes elementa
export const createPetRow = (pet) => {
    const rowElement = document.createElement('tr');
    const nameElement = createTd(capitalizeFirstLetter(pet.name));
    const typeElement = createTd(capitalizeFirstLetter(pet.type));
    const ageElement = createTd(pet.age);
    rowElement.append(nameElement, typeElement, ageElement);
    return rowElement;
}

// kuriam TD elementa
const createTd = (content) => {
    const tdElement = document.createElement('td');
    tdElement.innerText = content;
    return tdElement;
}