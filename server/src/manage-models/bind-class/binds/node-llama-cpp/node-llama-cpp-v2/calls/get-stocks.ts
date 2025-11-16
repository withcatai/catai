import {ChatSessionModelFunction} from 'node-llama-cpp';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export function getStocksFunction(): ChatSessionModelFunction {
    return {
        description: 'Get stock information for a given ticker symbol (e.g., AAPL, MSFT, GOOGL)',
        params: {
            type: 'object',
            properties: {
                symbol: {
                    type: 'string',
                    description: 'The stock ticker symbol (e.g., AAPL for Apple, MSFT for Microsoft)'
                }
            }
        },
        async handler(params: any) {
            try {
                const result = await yahooFinance.quote(params.symbol.toUpperCase());
                return result;
            } catch (error: any) {
                return `Error: ${error}`;
            }
        }
    } satisfies ChatSessionModelFunction;
}

