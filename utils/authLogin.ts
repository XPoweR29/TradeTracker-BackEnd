import { promisify } from "util";
import { compare } from "bcrypt";
import { UserRecord } from "../records/user.record";
import { ValidationError } from "./errors";

export const authLogin = async(email: string, pwd: string): Promise<UserRecord> => {
       
    const user = await UserRecord.getUserByEmail(email);
        
    if(!user || !(await compare(pwd, user.pwd))){
        throw new ValidationError('Nieprawidłowy adres email lub hasło');
    }
    
    return user;
}