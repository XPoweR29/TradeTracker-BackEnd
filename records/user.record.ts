import { FieldPacket } from 'mysql2';
import {v4 as uuid} from 'uuid';
import {promisify} from 'util';
import {hash} from 'bcrypt';
const hashing = promisify(hash);


import { User } from "../types";
import { pool } from '../utils/db';
import { ValidationError } from '../utils/errors';

type UserRecordResults = [UserRecord[], FieldPacket[]];
interface ResponseWithTokenId extends Partial<User> {
    tokenId: string;
}

export class UserRecord {
    public id?: string;
    public username: string;
    public email: string;
    public pwd: string;
    constructor(obj: User) {

        if(!obj.email || !obj.pwd) throw new ValidationError('Adres email i hasło są wymagane.');

        if(!obj.username) throw new ValidationError('Nazwa użytkownika jest wymagana');

        this.id = obj.id || uuid();
        this.username = obj.username;
        this.email = obj.email
        this.pwd = obj.pwd;
    }

    private async validation(): Promise<void> {
        const userExists = await UserRecord.getUserByUsername(this.username);
        const emailExists = await UserRecord.getUserByEmail(this.email);
        const userIdExsts = await UserRecord.getUserById(this.id);

        if(userExists) throw new ValidationError('This username already exists');
        if(emailExists) throw new ValidationError('This email already exists');
        if(userIdExsts) throw new ValidationError('This user ID already exists');
    }

    static filter(user: UserRecord): ResponseWithTokenId {
        const {id, username, email} = user;
        return {
            id,
            username,
            email,
            tokenId: uuid(),
        }
    }

    async insert(): Promise<void> {
        await this.validation();

        await pool.execute("INSERT INTO `users` (`id`, `username`, `email`, `pwd`) VALUES(:id, :username, :email, :pwd)", {
            id: this.id,
            username: this.username,
            email: this.email,
            pwd: await hashing(this.pwd, 10),
        })

        
        console.log(`▶.....User ${this.username} has been created successfully, with id ${this.id}`);
    }

    static async getUserById(id: string): Promise<UserRecord | null>{
        const [results] = (await pool.execute("SELECT * FROM `users` WHERE `id` = :id", {
            id,
        }))as UserRecordResults;

        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    static async getUserByEmail(email: string): Promise<UserRecord | null>{
        const [results] = (await pool.execute("SELECT * FROM `users` WHERE `email` = :email", {
            email,
        }))as UserRecordResults;

        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    static async getUserByUsername(username: string): Promise<UserRecord | null>{
        const [results] = (await pool.execute("SELECT * FROM `users` WHERE `username` = :username", {
            username,
        }))as UserRecordResults;

        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    async update(data: Partial<User>): Promise<UserRecord> {
        await pool.execute("UPDATE `users` SET username=:username, email=:email, pwd=:pwd WHERE id=:id", {
            id: this.id,
            username: data.username || this.username,
            email: data.email || this.email,
            pwd: data.pwd ? await hashing(data.pwd, 10) : this.pwd,
        });

        Object.assign(this, data);
        
        console.log(`▶.....User ${data.username || this.username} has been successfully updated. ✔`);
        return this;
    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `users` WHERE `id` = :id", {
            id: this.id,
        });

        console.log(`▶.....User ${this.username} has been successfully deleted. ✔`);
    }

    async saveTokenId(tokenId: string): Promise<void> {
        await pool.execute("UPDATE `users` SET currentTokenId=:tokenId WHERE id=:id", {
            tokenId,
            id: this.id
        } );
    }

}