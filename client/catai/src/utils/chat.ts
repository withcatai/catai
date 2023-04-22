const secure = location.protocol.startsWith('https') ? 's' : '';
const socket = new WebSocket(`ws${secure}://${location.host}/ws`);

type ActiveMessage = { content: string, error?: string, active: boolean, hide?: boolean };
let activeMessage: ActiveMessage = {content: '', active: false};

export function makeActiveMessage(question: string, message: ActiveMessage) {
    activeMessage = message;
    question && socket.send(JSON.stringify({question}));
}


export const update: {func: () => void} = {func: Function};
async function onMessage(event: MessageEvent) {
    const {type, value} = JSON.parse(event.data);

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
        case 'config-model':
            if(value === 'alpaca-cpp'){
                activeMessage.hide = false;
                activeMessage.active = true;
            }
            break
    }

    update.func();
}

socket.onmessage = onMessage;