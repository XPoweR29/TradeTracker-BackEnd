import { FieldPacket } from "mysql2";
import { pool } from "./db"

interface UserCount {
    count: number;
}

type dataCheckResult = [UserCount[], FieldPacket[]];

export const isEmailTaken = async (email: string): Promise<boolean>  => {
    const [rows] = (await pool.execute("SELECT COUNT(*) AS count FROM `users` WHERE `email` = :email", {
        email,
    })) as dataCheckResult;

    return rows[0].count > 0;
}


export const isUsernameTaken = async (username: string): Promise<boolean>  => {
    const [rows] = (await pool.execute("SELECT COUNT(*) AS count FROM `users` WHERE `username` = :username", {
        username,
    })) as dataCheckResult;

    return rows[0].count > 0;
}