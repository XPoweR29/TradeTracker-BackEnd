import { FieldPacket } from 'mysql2';
import {v4 as uuid} from 'uuid';

import { User } from "../types";
import { pool } from '../utils/db';
import { ValidationError } from '../utils/errors';

type UserRecordResults = [UserRecord[], FieldPacket[]];

export class UserRecord {
    public id?: string;
    public username: string;
    public email: string;
    public pwd: string;
    constructor(obj: User) {
        //>>! Tutaj miejsce na walidację danych przekazywanych do rekodu!

        if(!obj.email || !obj.pwd) {
            throw new ValidationError('Adres email i hasło są wymagane.');
        } 

        this.id = obj.id;
        this.username = obj.username;
        this.email = obj.email
        this.pwd = obj.pwd
    }

    async insert(): Promise<void> {
        if(!this.id) {
            this.id = uuid();
        } 

        await pool.execute("INSERT INTO `users` (`id`, `username`, `email`, `pwd`) VALUES(:id, :username, :email, :pwd)", {
            id: this.id,
            username: this.username,
            email: this.email,
            pwd: this.pwd
        })

        //>>! Tutaj konieczenie hasnowanie hasła!
        console.log(`▶.....User ${this.username} has been created successfully, with id ${this.id}`);
    }

    static async getUser(id: string): Promise<UserRecord | null>{
        const [results] = (await pool.execute("SELECT * FROM `users` WHERE `id` = :id", {
            id,
        }))as UserRecordResults;

        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    async update(data: Partial<User>): Promise<void> {
        await pool.execute("UPDATE `users` SET username=:username, email=:email, pwd=:pwd WHERE id=:id", {
            id: this.id,
            username: data.username || this.username,
            email: data.email || this.email,
            pwd: data.pwd || this.pwd,
        });
        //>>! Tutaj koniecznie hasnowanie nowego hasła!
        console.log(`▶.....User ${data.username || this.username} has been successfully updated. ✔`);
    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `users` WHERE `id` = :id", {
            id: this.id,
        });

        console.log(`▶.....User ${this.username} has been successfully deleted. ✔`);
    }

}