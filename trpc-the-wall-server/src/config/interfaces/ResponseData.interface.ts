export interface ResponseDataInterface <ResultValue>{
    status: boolean;
    result?: ResultValue;
    error: unknown;
    message?: string | null;
    html?: string;
};