import { insertPet, findPets } from "./pets.persistence.js";

export const getAllPets = async () => {
    return await findPets({}, 'user');
}

export const createPet = async (pet) => {
    return await insertPet(pet);
}