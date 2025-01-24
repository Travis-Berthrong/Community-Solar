import { User } from "../datamodels/User";
import { AppDataSource } from "../infrastructure/data-source";

export const register = async (user: User) => {
    try {
        const repository = AppDataSource.getRepository(User);
        const res =  await repository.save(user);
        return res.Id;
    } catch (error) {
        //TODO: Log error
        console.error(error);
        throw error;
    }
        

}