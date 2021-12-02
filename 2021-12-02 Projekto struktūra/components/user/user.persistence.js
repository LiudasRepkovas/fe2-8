import { UserModel } from "../../models/users.model.js";

export const insertUser = async (user) => {
    const newUser = new UserModel(user);
    const insertResult = await newUser.save();
    return insertResult;
}

export const findUsers = async (query) => {
    const results = await UserModel.find(query);
    return results;
}