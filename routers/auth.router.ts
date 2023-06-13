import { Request, Router } from "express";
import { UserRecord } from "../records/user.record";
import { RequestWithUserObj, User } from "../types";
import { authLogin } from "../utils/authLogin";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { ValidationError } from "../utils/errors";
import { isEmailTaken, isUsernameTaken } from "../utils/registerValidation";
import { authMiddleware } from "../middleware/authMiddleware";
import { v4 as uuid } from 'uuid';
import { generateTokenId } from "../utils/tokenId-generator";

dotenv.config();
export const authRouter = Router();

interface JWTPayload {
    tokenId: string;
}

authRouter

  .post("/login", async (req, res): Promise<void> => {
        const { email, pwd } = req.body as Pick<User, "email" | "pwd">;

        try {
            const authUser = await authLogin(email, pwd); 
            const payload: JWTPayload = {tokenId: await generateTokenId()}; 
            const accessToken = jwt.sign(payload, process.env.SIGNATURE, {
                expiresIn: 60 * 60 * 24
            }); 
            await authUser.saveTokenId(payload.tokenId); 

            res
                .cookie("jwt", accessToken, { httpOnly: true })
                .json({ message: "Pomyślnie zalogowano!" });

        } catch (err) {
            res.status(401).json({
                message: err.message,
            });
        }
  })

  .post("/register", async (req, res): Promise<void> => {
        const { pwd, confirmPwd, email, username } = req.body as User & Record<"confirmPwd", string>;

        if (pwd !== confirmPwd) {
        throw new ValidationError("Hasła muszą być takie same");
        }

        if (await isEmailTaken(email)) {
        throw new ValidationError("Ten adres email jest już zajęty");
        }

        if (await isUsernameTaken(username)) {
        throw new ValidationError("Ta nazwa użytkownika jest już zajęta");
        }

        const newUser = new UserRecord({ email, pwd, username });
        await newUser.insert();
        res.json({
        message: `Użytkownik ${newUser.username} został pomyślnie zarejestrowany. Możesz teraz zalogować się do swojego konta.`,
        });
  })

  .get('/logout', authMiddleware, async(req: RequestWithUserObj, res) => {
        req.user.logout();
        res.clearCookie('jwt').json({message: 'Pomyślnie wylogowano'});
  })