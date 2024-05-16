export interface DatabaseInterface {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
};

export interface ConstantsInterface {
    YES: number;
    NO: number;
    SESSION_SECRET: string;
    DATABASE: DatabaseInterface;
    PORT?: number;
    SESSION_EXPIRE?: number;
    SALT?: string;
    PASSWORD_SALT1?: string;
    PASSWORD_SALT2?: string;
};