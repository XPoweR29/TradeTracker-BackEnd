import { Router } from "express";
import { UserRecord } from "../records/user.record";
import { RequestWithUserObj, User } from "../types";
import { ValidationError } from "../utils/errors";
import * as dotenv from 'dotenv';

dotenv.config();

export const userRouter = Router();

userRouter

  .patch("/update-username", async (req: RequestWithUserObj, res): Promise<void> => {
    const updatedUser = await req.user.update({ username: req.body.username });

    res.json({
      user: updatedUser,
      message: "Nazwa użytkownika została zmieniona",
    });
  })

  .patch("/update-email", async (req: RequestWithUserObj, res): Promise<void> => {

    const updatedUser = await req.user.update({ email: req.body.email });
    res.json({
      user: updatedUser,
      message: `Email użytkownika został zmieniony`,
    });
  })

  .patch("/update-pwd", async (req: RequestWithUserObj, res): Promise<void> => {
    const { pwd, confirmPwd } = req.body;
    if (pwd !== confirmPwd) {
      throw new ValidationError("Podane hasła różnią się od siebie");
    }

    const updatedUser = await req.user.update({ pwd: pwd });
    res.json({
      user: updatedUser,
      message: "Hasło zostało zmienione",
    });
  })

  .delete('/delete', async(req: RequestWithUserObj, res) => {
        await req.user.delete();
        res.json({message: `Użytkownik ${req.user.username} zotał usunięty.`})
  })

