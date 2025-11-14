import {ChatSessionModelFunction} from 'node-llama-cpp';
//@ts-ignore
import bing from 'bing-scraper';

type SearchResult = {
    title: string
    url: string
    description: string
}

function decodeDestination(result: SearchResult) {
    const url = new URL(result.url);

    if (url.hostname === 'www.bing.com') {
        let realURL = url.searchParams.get('u') || '';
        if (realURL.startsWith('a1')) {
            realURL = realURL.slice('a1'.length);
        }

        result.url = Buffer.from(realURL, 'base64').toString('utf8');
    }
}

export function getWebSearchFunction(): ChatSessionModelFunction {
    return {
        description: 'Search the web for the given query',
        params: {
            type: 'object',
            properties: {
                query: {
                    type: 'string'
                }
            }
        },
        async handler(params: any) {
            const result = await new Promise<any>(res => {
                bing.search({
                    q: params.query,
                    enforceLanguage: true
                }, function (err: any, resp: any) {
                    if (err) {
                        res(`Error: ${err}`);
                    } else {
                        resp.results.forEach(decodeDestination);
                        res(resp.results);
                    }
                });
            });

            return result;
        }
    } satisfies ChatSessionModelFunction;
}

