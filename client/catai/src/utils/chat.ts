const secure = location.protocol.startsWith('https') ? 's' : '';
export const chatSocket = new WebSocket(`ws${secure}://${location.host}/ws`);
const webSocketSend = (json: any) => chatSocket.send(JSON.stringify(json));

type ActiveMessage = { content: string, error?: string, active: boolean, hide?: boolean };
let activeMessage: ActiveMessage = { content: '', active: false };

export function makeActiveMessage(question: string, message: ActiveMessage) {
    activeMessage = message;
    question && webSocketSend({ question });
}

export function abortResponse() {
    webSocketSend({ abort: true });
}


export const update: { func: () => void } = { func: Function };
async function onMessage(event: MessageEvent) {
    const { type, value } = JSON.parse(event.data);

    switch (type) {
        case 'token':
            activeMessage.content += value;
            break;
        case 'error':
            activeMessage.error += value;
            break;
        case 'end':
            activeMessage.active = false;
            break;
    }

    update.func();
}

function onConnectionLost(event) {
    console.error('WebSocket error observed:', event);

    activeMessage.hide = false;
    activeMessage.error += `The connection lost, check the server status and refresh the page.`;
    update.func();
}

chatSocket.onmessage = onMessage;
chatSocket.onerror = onConnectionLost;
chatSocket.onclose = onConnectionLost;