const DEFAULT_CONTEXT = `Below is a history of instructions that describe tasks, paired with an input that provides further context. Write a response that appropriately completes the request by remembering the conversation history.\n\n`;

const RESPONSE_END = '<end>';
export default class BuildCtx {
    history = [];
    lastCtxLength = 0;

    static #fixResponse(response){
        response = response.trimEnd();

        if (response.endsWith(RESPONSE_END)) {
            response = response.slice(0, -RESPONSE_END.length).trimEnd();
        }

        return response;
    }

    buildCtx(instruction){
        const newHistory = {instruction, response: ''};
        this.history.push(newHistory);

        const instructionHistory = this.history.map(({instruction, response}) => `### Instruction:\n\n ${instruction} \n\n### Response:\n\n ${BuildCtx.#fixResponse(response)}`);
        const context = DEFAULT_CONTEXT + instructionHistory.join('\n');
        this.lastCtxLength = context.length;

        return context;
    }

    processToken(token){
        this.history.at(-1).response += token;
    }
}