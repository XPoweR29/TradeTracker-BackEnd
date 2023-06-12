declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SIGNATURE: string;
        }
    }
}

export {};