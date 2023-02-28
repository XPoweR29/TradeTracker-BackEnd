import { FieldPacket } from 'mysql2';
import {v4 as uuid} from 'uuid';
import { Position, SimplePosition } from "../types";
import { pool } from '../utils/db';
import { ValidationError } from '../utils/errors';

type PositionRecordResults = [PositionRecord[], FieldPacket[]];

export class PositionRecord {
    readonly id?: string;
    public market: string;
    public direction: string;
    public result?: string;
    public date: string;
    public flag: number;
    public imgUrlBefore?: string[];
    public imgUrlAfter?: string[];
    public descriptionBefore?: string;
    public descriptionAfter?: string;
    public entryPrice?: number;
    public slPrice?: number;
    public slValue?: number;
    public closePrice?: number;
    public rr?: number;

    constructor(obj: Position) {

        if(obj.market.length === 0 || obj.market.length >10) {
            throw new ValidationError('WALOR nie możebyć pusty ani zawierać więcej niż 10 znaków.');
        }

        if(obj.descriptionBefore && obj.descriptionBefore.length > 1500){
            throw new ValidationError('Opis nie może zawierać więcej niż 1500 znaków.');
        }

        if(obj.descriptionAfter && obj.descriptionAfter.length > 1500){
            throw new ValidationError('Opis nie może zawierać więcej niż 1500 znaków.');
        }

        this.id = obj.id ?? uuid();
        this.market = obj.market;
        this.direction = obj.direction;
        this.result = obj.result ?? null;
        this.date = obj.date;
        this.flag = obj.flag ?? 0;
        this.imgUrlBefore = obj.imgUrlBefore ?? null;
        this.imgUrlAfter = obj.imgUrlAfter ?? null;
        this.descriptionBefore = obj.descriptionBefore ?? null;
        this.descriptionAfter = obj.descriptionAfter ?? null;
        this.entryPrice = obj.entryPrice ?? null;
        this.slPrice = obj.slPrice ?? null;
        this.slValue = obj.slValue ?? null;
        this.closePrice = obj.closePrice ?? null;
        this.rr = obj.rr ?? null;
        
    }

    static async getAll(): Promise<PositionRecord[] | null> {
        const [results] = (await pool.execute("SELECT * FROM `positions`")) as PositionRecordResults;
        return results.length === 0? null : results.map(result => new PositionRecord(result));
    } 

    static async getOne(id: string): Promise<PositionRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `positions` WHERE `id` = :id", {
            id,
        })) as PositionRecordResults;
        return results.length === 0 ? null : new PositionRecord(results[0]); 
    }

    async insert(): Promise<void> {
        await pool.execute("INSERT INTO `positions` (`id`, `market`, `direction`, `date`) VALUES(:id, :market, :direction, :date)", {
            id: this.id,
            market: this.market,
            direction: this.direction,
            date: this.date,
        });

        console.log('▶.....Position has been successfully inserted. ✔')
    }


    async delete() {
        await pool.execute("DELETE FROM `positions` WHERE `id` = :id", {
            id: this.id,
        });

        console.log('▶.....Position has been successfully deleted. ✔')
    }
}
