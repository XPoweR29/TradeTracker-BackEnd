export interface Position extends SimplePosition {
    userId: string;
    imgUrlBefore?: string;
    imgUrlAfter?: string;
    descriptionBefore?: string;
    descriptionAfter?: string;
    entryPrice?: number;
    slPrice?: number;
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

export enum operation {
    remove = 'remove',
    add = 'add',
}

export enum when {
    before = `imgUrlBefore`,
    after = `imgUrlAfter`,
}