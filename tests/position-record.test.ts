import { PositionRecord } from "../records/position.record";
import { Position } from "../types";
import { pool } from "../utils/db";
import { ValidationError } from "../utils/errors";

afterAll(async() => await pool.end());


test('Inserted position should have an ID', async () => {
    const postiion = new PositionRecord({
        market: 'test/usd',
        direction: 'sell',
        date: '21-02-23'
    });
    await postiion.insert();

    expect(postiion.id).toBeDefined();
});

test('Market should have 0-10 sign', async() => {
    const position = new PositionRecord({
        market: '',
        direction: 'sell',
        date: '21-02-23'
    });

    expect(await position.insert()).toThrowError();
})

test('Position should have beed updated', async () => {
    const newPosition = new PositionRecord({
        market: 'usd/pln',
        direction: 'buy',
        date: '21-02-23'
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

test('Position should be deleted and returned null', async () => {
    const newPosition = new PositionRecord({
        market: 'chf/jpy',
        direction: 'sell',
        date: '21-02-23'
    });
    await newPosition.insert();

    const position = await PositionRecord.getOne(newPosition.id);
    await position.delete();
    
    const againQuery = await PositionRecord.getOne(newPosition.id);

    expect(againQuery).toBeNull();

})