import { PetModel } from "../../models/pets.model.js";

export const findPets = async (query, populate) => {
    const allPets = await PetModel.find(query).populate(populate);
    return allPets;
}

export const insertPet = async (pet) => {
    const insertResult = await new PetModel(pet).save();
    return insertResult;
}