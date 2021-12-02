import { insertUser, findUsers } from "./user.persistence.js"

export const createUser = async (user) => {
    return await insertUser(user)
}

export const getAllUsers = async () => {
    return await findUsers({});
}

export const getUserById = async (id) => {
    return await findUsers({_id: id});
}

export const getUserByEmail = async (email) => {
    return await findUsers({email: email});
}