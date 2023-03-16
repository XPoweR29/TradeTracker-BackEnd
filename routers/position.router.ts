import { Router } from "express";
import { PositionRecord } from "../records/position.record";
import { ValidationError } from "../utils/errors";

export const positionsRouter = Router();

positionsRouter

.get('/:userId', async (req, res) => {
    const data = await PositionRecord.getAll(req.params.userId);
    res.json(data);
    
})