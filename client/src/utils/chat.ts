const socket = new WebSocket('ws://localhost:8080/ws');

type ActiveMessage = { content: string, active: boolean, update() };
let activeMessage: ActiveMessage = {content: '', active: false, update(){}};

export async function makeActiveMessage(question: string, message: ActiveMessage) {
    activeMessage = message;
    socket.send(JSON.stringify({question}));
}

function onMessage(event: MessageEvent) {
    const {type, value} = JSON.parse(event.data);

    switch (type) {
        case 'word':
            activeMessage.content += value;
            break;
        case 'end':
            activeMessage.active = false;
            break;
    }

    activeMessage.update();
}

socket.onmessage = onMessage;