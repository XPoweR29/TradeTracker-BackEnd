import { PositionRecord } from "../../records/position.record";

export interface Position extends SimplePosition {
    userId: string;
    imgUrlBefore?: string;
    imgUrlAfter?: string;
    descriptionBefore?: string;
    descriptionAfter?: string;
    entryPrice?: number;
    slValue?: number;
    closePrice?: number;
    rr?: number;
}

export interface SimplePosition {
    id?: string;
    market: string;
    direction: string;
    date: string;
    result?: string;
    flag?: number;
}

export type Operation = 'add' | 'remove';
export type SortOrder = 'ASC' | 'DESC';
export type When = 'imgUrlBefore' | 'imgUrlAfter';


export interface PaginationResponse {
    positions: PositionRecord[];
    totalCount: number;
}