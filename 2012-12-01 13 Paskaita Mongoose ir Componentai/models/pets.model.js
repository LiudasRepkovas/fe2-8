import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    type: { 
        type: String,
        required: true,
    },
    age: { 
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}, { timestamps: true});

export const PetModel = mongoose.model('pet', schema);