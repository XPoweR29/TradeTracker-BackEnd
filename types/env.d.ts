declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SIGANTURE: string;
        }
    }
}

export {};