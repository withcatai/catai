import {ChatSessionModelFunction} from 'node-llama-cpp';

export function getDateFunction(): ChatSessionModelFunction {
    return {
        description: 'Get the current date',
        handler() {
            return new Date().toISOString();
        },
    } satisfies ChatSessionModelFunction;
}

