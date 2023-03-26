import {tick} from 'svelte';

const socket = new WebSocket('ws://localhost:8080/ws');

let update: () => void;
export function setUpdate(fn: () => void) {
    update = fn;
}

type ActiveMessage = { content: string, error?: string, active: boolean };
let activeMessage: ActiveMessage = { content: '', active: false };

export function makeActiveMessage(question: string, message: ActiveMessage) {
    activeMessage = message;
    question && socket.send(JSON.stringify({question}));
}

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
    }

    await tick();
    update();
}

socket.onmessage = onMessage;