import { FieldPacket } from 'mysql2';
import {v4 as uuid} from 'uuid';
import { operation, Position, when, } from "../types";
import { pool } from '../utils/db';
import { ValidationError } from '../utils/errors';

type PositionRecordResults = [PositionRecord[], FieldPacket[]];

export class PositionRecord {
    readonly id?: string;
    public userId: string;
    public market: string;
    public direction: string;
    public result?: string;
    public date: string;
    public flag: number;
    public imgUrlBefore?: string;
    public imgUrlAfter?: string;
    public descriptionBefore?: string;
    public descriptionAfter?: string;
    public entryPrice?: number;
    public slPrice?: number;
    public slValue?: number;
    public closePrice?: number;
    public rr?: number;

    constructor(obj: Position) {

        if(!obj.userId) {
            throw new ValidationError('Nie podano ID użytkownika do którego przypisać pozycję.');
        }

        if(!obj.direction) {
            throw new ValidationError('Nie zdefiniowano kierunku handlu');
        }

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
        this.userId = obj.userId;
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

    static async getAll(userId: string): Promise<PositionRecord[] | null> {
        const [results] = (await pool.execute("SELECT * FROM `positions` WHERE `userId` = :userId", {
            userId,
        })) as PositionRecordResults;
        return results.length === 0? null : results.map(result => new PositionRecord(result));
    } 

    static async getOne(id: string): Promise<PositionRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `positions` WHERE `id` = :id", {
            id,
        })) as PositionRecordResults;
        if(results.length === 0) {
            throw new ValidationError('Pozycja o podanym ID nie istnieje.');
        } else return new PositionRecord(results[0]);
    }

    async insert(): Promise<void> {
        await pool.execute("INSERT INTO `positions` (`id`, `market`, `direction`, `date`, `userId`) VALUES(:id, :market, :direction, :date, :userId)", {
            id: this.id,
            market: this.market,
            direction: this.direction,
            date: this.date,
            userId: this.userId
        });
        console.log('▶.....Position has been successfully inserted. ✔')
    }

    async update(data: Partial<Position>) {
        const updated = {
            ...this,
            ...data
        }

        await pool.execute("UPDATE `positions` SET `market` = :market, `direction` = :direction, `date` = :date, `result` = :result, `flag` = :flag, `descriptionBefore` = :descriptionBefore, `descriptionAfter` = :descriptionAfter, `entry_price` = :entry_price, `sl_price` = :sl_price, `sl_value` = :sl_value, `close_price` = :close_price, `rr` = :rr WHERE `id` = :id", {
            id: this.id,
            market: updated.market,
            direction: updated.direction,
            result: updated.result,
            date: updated.date,
            flag: updated.flag,
            descriptionBefore: updated.descriptionBefore,
            descriptionAfter: updated.descriptionAfter,
            entry_price: updated.entryPrice,
            sl_price: updated.slPrice,
            sl_value: updated.slValue,
            close_price: updated.closePrice,
            rr: updated.rr,
        });

        console.log('▶.....Position has been successfully updated. ✔');
    }

    async updateUrl(url: string, makeOperation: operation, when: when) {

        if(makeOperation === 'add') {
             !this[when].includes(url) ? 

                pool.execute(`UPDATE \`positions\` SET \`${when}\` = JSON_ARRAY_APPEND(\`${when}\`, '$', :url) WHERE \`id\` = :id`, {
                   id: this.id,
                   url,
                   when,
               })
               .then(() => console.log('▶.....URL has been successfully updated. ✔'))
            :

            console.log('▶.....This URL is already addded ❌');
            return;
            
        } else if(makeOperation === 'remove') {
            this[when].includes(url) ? 

            pool.execute(`UPDATE \`positions\` SET \`${when}\` = JSON_REMOVE(\`${when}\`, JSON_UNQUOTE(JSON_SEARCH(\`${when}\`, 'one', :url))) WHERE \`id\` = :id`, {
            id: this.id,
            url,
            when, 
        })
        .then(() => console.log('▶.....URL has been successfully updated. ✔'))
        
        :

        console.log('▶.....There is no such URL ❌');
        return;
        }
    };

    async delete() {
        const [result] = await pool.execute("DELETE FROM `positions` WHERE `id` = :id", {
            id: this.id,
        })

        console.log('▶.....Position has been successfully deleted. ✔')
    }
}
