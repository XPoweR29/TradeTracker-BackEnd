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

.patch('/update-username', async(req, res): Promise<void> => {
        const user = await UserRecord.getUserById(req.body.id);
        const updatedUser = await user.update({username: req.body.username});
        res.json({
                user: updatedUser, 
                message: 'Nazwa użytkownika została zmieniona'
        });
}) 

.patch('/update-email', async(req, res): Promise<void> => {
        const user = await UserRecord.getUserById(req.body.id);
        const updatedUser = await user.update({email: req.body.email});
        res.json({
                user: updatedUser, 
                message: `Email użytkownika został zmieniony`
        });
}) 

.patch('/update-pwd', async(req, res): Promise<void> => {
        const {pwd, confirmPwd, id} = req.body;
        if(pwd !== confirmPwd) {
                throw new ValidationError('Podane hasła różnią się od siebie');
        }

        const user = await UserRecord.getUserById(id);
        const updatedUser = await user.update({pwd: pwd});
        res.json({
                user: updatedUser,
                message: 'Hasło zostało zmienione'
        });
}) 