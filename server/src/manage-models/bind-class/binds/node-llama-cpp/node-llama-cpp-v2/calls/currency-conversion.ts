import {ChatSessionModelFunction} from 'node-llama-cpp';

async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
    const response = await fetch(`https://duckduckgo.com/js/spice/currency/${parseFloat(amount.toFixed(3))}/${from}/${to}`);
    const result: any = await response.text();
    const body = parseSpiceBody(result);
    return body.to?.[0]?.mid ?? null;
}

function parseSpiceBody(body: any, regex = /^ddg_spice_[\w]+\(\n?((?:.|\n)+)\n?\);?/) {
    return JSON.parse(regex.exec(body.toString())![1]);
}


export function getCurrencyConversionFunction(): ChatSessionModelFunction {
    return {
        description: 'Convert the given amount from one currency to another. For example \'usd\' to \'eur\'.',
        params: {
            type: 'object',
            properties: {
                from: {
                    type: 'string'
                },
                to: {
                    type: 'string'
                },
                amount: {
                    type: 'number'
                }
            }
        },
        async handler(params: any) {
            try {
                return await convertCurrency(params.amount, params.from, params.to);
            } catch (error: any) {
                return `Error: ${error}`;
            }
        }
    } satisfies ChatSessionModelFunction;
}

