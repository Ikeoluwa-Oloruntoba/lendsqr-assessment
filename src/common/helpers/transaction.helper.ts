import { v4 as uuidv4 } from 'uuid';

export class TransactionHelper {
    /**
     * Generates a unique transaction reference
     * @returns {string} Unique transaction reference
     */
    static generateTransactionRef(): string {
        const timestamp = Date.now().toString(); 
        const uniqueId = uuidv4().replace(/-/g, ''); 
        return `TX-${timestamp}-${uniqueId}`;
    }
}
