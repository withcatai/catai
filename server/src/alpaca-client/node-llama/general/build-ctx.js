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

    buildCtx(request){
        const newHistory = {request, response: ''};
        this.history.push(newHistory);

        const instructionHistory = this.history.map(({request, response}) => `### Human:\n${request}\n### Assistant:\n${BuildCtx.#fixResponse(response)}`);
        const context = instructionHistory.join('\n');
        this.lastCtxLength = context.length;

        return context;
    }

    processToken(token){
        this.history.at(-1).response += token;
    }

    get lastResponse () {
        return this.history.at(-1).response;
    }
}