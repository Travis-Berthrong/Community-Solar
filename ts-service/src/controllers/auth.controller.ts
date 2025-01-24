import express, { Router, Request, Response } from "express";
import { genSalt, hash } from "bcrypt-ts";
import * as authService from "../services/auth.service";
import { User } from "../datamodels/User";
import validateUser  from "../validators/userValidator";
import { UserIn } from "../DTOs/UserIn";

const router: Router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
    const salt = await genSalt(10);
    const userIn: UserIn = req.body;
    if (!validateUser(userIn)) {
        res.status(400).json({ message: "Invalid user data" });
        return;
    }
    const user: User = new User();
    user.FirstName = userIn.FirstName;
    user.LastName = userIn.LastName;
    user.Email = userIn.Email;
    user.PasswordHash = await hash(userIn.Password, salt);
    user.PhoneNumber = userIn.PhoneNumber;
    user.Address = userIn.Address;
    try {
        const result = await authService.register(user);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export { router };
