import { Router } from "express";
import { PositionRecord } from "../records/position.record";
import { RequestWithUserObj, SortOrder } from "../types";

export const positionsRouter = Router();

positionsRouter

.get('/all', async(req: RequestWithUserObj, res) => {
    const data = await PositionRecord.getAll(req.user.id);
    res.json(data);
})

.get('/:pageNumber/:order?', async(req: RequestWithUserObj, res) => {
        const {pageNumber} = req.params;
        const sortOrder = req.params.order as SortOrder;
        const data = await PositionRecord.getPaginated(req.user.id, +pageNumber, sortOrder);
        res.json(data);
})


.post('/', async(req: RequestWithUserObj, res) => {
    const newPosition = new PositionRecord({
        ...req.body, 
        userId: req.user.id,
    });

    await newPosition.insert();
    res.json('Pozycja została pomyślnie dodana');
})

.delete('/:id', async(req: RequestWithUserObj, res) => {
    const position = await PositionRecord.getOne(req.params.id);
    await position.delete();
    res.json('Pozycja została usunięta.');
})

.patch('/:id', async(req: RequestWithUserObj, res) => {
    const position = await PositionRecord.getOne(req.params.id);
    await position.update(req.body);
    res.json('Pozycja została zaktualizowana');

})

.put('/:id', async(req: RequestWithUserObj, res) => {
    const position = await PositionRecord.getOne(req.params.id);
    const {imgLink, when} = req.body;
    position.updateUrl(imgLink, 'add', when);
    res.end();

})

.delete('/image/:id', async(req: RequestWithUserObj, res) => {
    const position = await PositionRecord.getOne(req.params.id);
    const {imgLink, when} = req.body;
    position.updateUrl(imgLink, 'remove', when);
    res.end();

})
