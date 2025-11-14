import {ChatSessionModelFunction} from 'node-llama-cpp';
import ddg from 'duck-duck-scrape';
import {summarizeWeatherForecast} from '../utils/weather-summary.js';

export function getWeatherFunction(): ChatSessionModelFunction {
    return {
        description: 'Get the current weather for the given location',
        params: {
            type: 'object',
            properties: {
                location: {
                    type: 'string'
                },
                locale: {
                    type: 'string',
                    description: 'The locale to give the summaries in - default to \'en\''
                }
            }
        },
        async handler(params: any) {
            try {
                const raw = await ddg.forecast(params.location, params.locale);
                return summarizeWeatherForecast(raw);
            } catch (error: any) {
                return `Error: ${error}`;
            }
        }
    } satisfies ChatSessionModelFunction;
}

