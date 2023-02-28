export interface Position extends SimplePosition {
    imgUrlBefore?: string[];
    imgUrlAfter?: string[];
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