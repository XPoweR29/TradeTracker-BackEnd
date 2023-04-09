import { PositionRecord } from "../records/position.record";
import { UserRecord } from "../records/user.record";
import { User } from "../types";
import { pool } from "../utils/db";
import { ValidationError } from "../utils/errors";
import {compare} from 'bcrypt';

afterAll(async() => await pool.end());

test('Created user should has an ID', async() => {
    const testUser: User = {
        username: 'tester',
        email: 'tester@example.com',
        pwd: 'password',
    }

    const user = new UserRecord(testUser);

    expect(user.id).toBeDefined();
});


test('Username must be defined', async() => {
    const testUser: User = {
        username: '',
        email: 'asd@wp.pl',
        pwd: 'asdasd',
    }

    expect(() => new UserRecord(testUser)).toThrowError(ValidationError);
});


test('Email and Pwd must be defined', async() => {
    const testUser: User = {
        username: 'tester',
        email: '',
        pwd: '',
    }

    expect(() => new UserRecord(testUser)).toThrowError(ValidationError);
});


test('User password sholud be hashed', async() => {
    const testUser: User = {
        username: 'tester',
        email: 'tester@example.com',
        pwd: 'password',
    }
    const user = new UserRecord(testUser);
    await user.insert();
    const dbUser = await UserRecord.getUserById(user.id);

    expect(dbUser.pwd).not.toBe(testUser.pwd);
    expect(await compare(testUser.pwd, dbUser.pwd)).toBe(true);   

});


test('Exisiting username should not be added to DB', async() => {
    const testUser: User = {
        username: 'tester',
        email: 'test@example.com',
        pwd: 'password',
    }
    const user = new UserRecord(testUser);

    await expect(user.insert()).rejects.toThrowError();  

});


test('Exisiting email should not be added to DB', async() => {
    const testUser: User = {
        username: 'test',
        email: 'tester@example.com',
        pwd: 'password',
    }
    const user = new UserRecord(testUser);

    await expect(user.insert()).rejects.toThrowError();  

});


test('User data should be updated', async() => {
    const dbuser = await UserRecord.getUserByUsername('tester');
    await dbuser.update({username: 'tester1'});
    const updatedDbUser = await UserRecord.getUserByUsername('tester1');

    expect(dbuser.id).toBe(updatedDbUser.id);  

});


test('User should be deleted', async() => {
    const user = await UserRecord.getUserByUsername('tester1');
    await user.delete();

    expect(await UserRecord.getUserByUsername('tester2')).toBeNull();
});