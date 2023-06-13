import { Router } from "express";
import { PositionRecord } from "../records/position.record";
import { RequestWithUserObj } from "../types";

export const positionsRouter = Router();

positionsRouter

.get('/', async(req: RequestWithUserObj, res) => {
    const data = await PositionRecord.getAll(req.user.id);
    res.json(data);
})

.post('/', async(req, res) => {
    const position = new PositionRecord(req.body);
    await position.insert();
    res.json('Pozycja została pomyślnie dodana');
})

.delete('/:id', async(req, res) => {
    const position = await PositionRecord.getOne(req.params.id);
    await position.delete();
    res.json('Pozycja została usunięta.');
})

.patch('/:id', async(req, res) => {
    const position = await PositionRecord.getOne(req.params.id);
    await position.update(req.body);
    res.json('Pozycja została zaktualizowana');

})

.put('/:id', async(req, res) => {
    const position = await PositionRecord.getOne(req.params.id);
    const {imgLink, when} = req.body;
    position.updateUrl(imgLink, 'add', when);
    res.end();

})

.delete('/image/:id', async(req, res) => {
    const position = await PositionRecord.getOne(req.params.id);
    const {imgLink, when} = req.body;
    position.updateUrl(imgLink, 'remove', when);
    res.end();

})
