import { UserIn } from "../DTOs/UserIn";

export default function validateUser(user: UserIn) {
    if (!user.FirstName || !user.LastName || !user.Email || !user.Address || !user.PhoneNumber) {
        return false;
    }
    return true;
}