import { Router } from "express";
import { authLogin } from "../utils/authLogin";

export const userRouter = Router();

userRouter

.post('/login', async (req, res): Promise<void> => {
        const {email, pwd} = req.body;
        const auth = await authLogin(email, pwd);
        res.json(auth);
})