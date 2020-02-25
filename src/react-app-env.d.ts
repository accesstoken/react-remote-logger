declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test'
        REACT_APP_POST_LOG_ENDPOINT: string
        REACT_APP_RETRIEVE_LOGS_ENDPOINT: string
    }
}