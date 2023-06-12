import { Request, Router } from "express";
import { UserRecord } from "../records/user.record";
import { User } from "../types";
import { authLogin } from "../utils/authLogin";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { ValidationError } from "../utils/errors";
import { isEmailTaken, isUsernameTaken } from "../utils/registerValidation";
import { authMiddleware } from "../middleware/authMiddleware";

dotenv.config();

export const authRouter = Router();

authRouter

  .post("/login", async (req, res): Promise<void> => {
        const { email, pwd } = req.body as Pick<User, "email" | "pwd">;

        try {
        const authUser = await authLogin(email, pwd);
        const payload = UserRecord.filter(authUser);
        const accessToken = jwt.sign(payload, process.env.SIGNATURE, {
            expiresIn: 60 * 60 * 24,
        });
        authUser.saveTokenId(payload.tokenId);

        res
            .cookie("jwt", accessToken, { httpOnly: true })
            .json({ message: "Pomyślnie zalogowano!" });
        } catch (err) {
        res.status(401).json({
            message: "Błędne dane logowania",
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

  .get('/logout', authMiddleware, async(req: Request & Record<'user', Partial<User>>, res) => {
        await UserRecord.logout(req.user.id);
        res.clearCookie('jwt').json({message: 'Pomyślnie wylogowano'});
  })