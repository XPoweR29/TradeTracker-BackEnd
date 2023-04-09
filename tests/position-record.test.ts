import { PositionRecord } from "../records/position.record";
import { Position } from "../types";
import { pool } from "../utils/db";

afterAll(async() => await pool.end());

test('Inserted position should have an ID', async () => {
    const postiion = new PositionRecord({
        market: 'test/usd',
        direction: 'sell',
        date: '21-02-23',
        userId: '123testID098'
    });

    expect(postiion.id).toBeDefined();
});


test('Market should have 0-10 sign', async() => {
    const testPos = {
        market: '',
        direction: 'sell',
        date: '21-02-23',
        userId: '123testID098'
    }

    expect(()=>new PositionRecord(testPos)).toThrowError();
});



test('Position should have beed updated', async () => {
    const newPosition = new PositionRecord({
        market: 'usd/pln',
        direction: 'buy',
        date: '21-02-23',
        userId: '123testID098'

    });
    await newPosition.insert();

    const position = await PositionRecord.getOne(newPosition.id);
    await position.update({
        ...position,
        descriptionBefore: 'Testowy opis',
        result: 'profit',
    });
    const updatedPosition = await PositionRecord.getOne(newPosition.id);

    expect(updatedPosition.descriptionBefore).toBeDefined();
    expect(updatedPosition.result).toBeDefined();
})

test('Position should be deleted and throw error', async () => {
    const testPos: Position = {
        market: 'chf/jpy',
        direction: 'sell',
        date: '21-02-23',
        userId: '123testID098'
    }

    const position = new PositionRecord(testPos);
    await position.insert();
    
    const gettingPos = await PositionRecord.getOne(position.id);
    await gettingPos.delete();
    
    await expect(PositionRecord.getOne(position.id)).rejects.toThrowError();
    
})

test('Position should have an user ID', async () => {
    const testPos = {
        market: 'usd/pln',
        direction: 'sell',
        date: '21-02-23',
        userId: ''
    }

    expect(()=>new PositionRecord(testPos)).toThrowError();
})