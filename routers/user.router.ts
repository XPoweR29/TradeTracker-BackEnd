import { Request, Response, Router } from "express";
import { UserRecord } from "../records/user.record";
import { User } from "../types";
import { authLogin } from "../utils/authLogin";
import { ValidationError } from "../utils/errors";
import { isEmailTaken, isUsernameTaken } from "../utils/registerValidation";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { authMiddleware } from "../middleware/authMiddleware";

dotenv.config();

export const userRouter = Router();

userRouter

  .get("/test", (req: Request & Record<"user", Partial<User>>, res) => {
    res.send(`WITAJ ${req.user.username}!`);
  })

  .patch("/update-username", async (req, res): Promise<void> => {
    const user = await UserRecord.getUserById(req.body.id);
    const updatedUser = await user.update({ username: req.body.username });
    res.json({
      user: updatedUser,
      message: "Nazwa użytkownika została zmieniona",
    });
  })

  .patch("/update-email", async (req, res): Promise<void> => {
    const user = await UserRecord.getUserById(req.body.id);
    const updatedUser = await user.update({ email: req.body.email });
    res.json({
      user: updatedUser,
      message: `Email użytkownika został zmieniony`,
    });
  })

  .patch("/update-pwd", async (req, res): Promise<void> => {
    const { pwd, confirmPwd, id } = req.body;
    if (pwd !== confirmPwd) {
      throw new ValidationError("Podane hasła różnią się od siebie");
    }

    const user = await UserRecord.getUserById(id);
    const updatedUser = await user.update({ pwd: pwd });
    res.json({
      user: updatedUser,
      message: "Hasło zostało zmienione",
    });
  }); 

