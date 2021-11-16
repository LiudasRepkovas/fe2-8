import { addPet } from "./helpers/requests.js";

const petForm = document.querySelector('form');

petForm.addEventListener('click', async (event) => {
    event.preventDefault();

    const formData = new FormData(petForm);

    const age = formData.get('age');
    const name = formData.get('name');
    const type = formData.get('type');

    await addPet({
        age, name, type
    });

    window.location.replace('index.html');
})