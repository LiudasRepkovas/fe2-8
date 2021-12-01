import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    name: String,
    type: String,
    age: Number
});

export const PetModel = mongoose.model('pet', petSchema);