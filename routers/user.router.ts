import { Router } from "express";
import { UserRecord } from "../records/user.record";
import { User } from "../types";
import { authLogin } from "../utils/authLogin";
import { ValidationError } from "../utils/errors";
import { isEmailTaken, isUsernameTaken } from "../utils/registerValidation";

export const userRouter = Router();

userRouter

.post('/login', async (req, res): Promise<void> => {
        const {email, pwd} = req.body as Pick<User, 'email' | 'pwd'>;
        const auth = await authLogin(email, pwd);
        res.json(auth);
})

.post('/register', async (req, res): Promise<void> => {
        const {pwd, confirmPwd, email, username} = req.body as User & Record<'confirmPwd', string>;
        
        if(pwd !== confirmPwd) {
                throw new ValidationError('Hasła muszą być takie same');
        }

        if(await isEmailTaken(email)) {
                throw new ValidationError('Ten adres email jest już zajęty');
        }
        
        if(await isUsernameTaken(username)) {
                throw new ValidationError('Ta nazwa użytkownika jest już zajęta');
        }
        
        const newUser = new UserRecord({email,pwd,username});
        await newUser.insert();
        res.json({message: `Użytkownik ${newUser.username} został pomyślnie zarejestrowany. Możesz teraz zalogować się do swojego konta.` })

})