import { promisify } from "util";
import { compare } from "bcrypt";
const comparing = promisify(compare);
import { UserRecord } from "../records/user.record";
import { ValidationError } from "./errors";

export const authLogin = async(email: string, pwd: string): Promise<boolean> => {

    const user = await UserRecord.getUserByEmail(email);
    
    if(!user || !(await compare(pwd, user.pwd))){
        throw new ValidationError('Nieprawidłowy adres email lub hasło');
    }

    return await comparing(pwd, user.pwd)
}