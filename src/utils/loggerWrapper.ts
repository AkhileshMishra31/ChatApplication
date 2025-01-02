import logger from '../config/logger';

export function logWithContext(context: string = 'General') {
    return {
        info: (message: string) => logger.info(`[${context}] ${message}`),
        error: (message: string, error?: Error) => {
            if (error) {
                logger.error(`[${context}] ${message}: ${error.message}`, { stack: error.stack });
            } else {
                logger.error(`[${context}] ${message}`);
            }
        },
        warn: (message: string) => logger.warn(`[${context}] ${message}`),
        debug: (message: string) => logger.debug(`[${context}] ${message}`),
    };
}

export default logger;

