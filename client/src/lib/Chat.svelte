<script lang="ts">
    import {Button, Card, Textarea} from 'flowbite-svelte';
    import Message from './Message.svelte';
    import {makeActiveMessage} from '../utils/chat.js';

    type message = {
        content?: string,
        myMessage?: boolean,
        active?: boolean
    }

    export let messages: message[] = [];
    $: lastMessage = messages.at(-1) ?? {active: false};

    let textArea = '';

    function sendMessage() {
        const question = textArea.trim();
        if (lastMessage.active || !question) return;

        const aiMessage = {
            content: '',
            active: true,
            update() {
                messages = messages;
            }
        };

        messages.push(
            {
                content: question,
                myMessage: true
            },
            aiMessage
        );

        messages = messages;
        textArea = '';

        makeActiveMessage(question, aiMessage);
    }

    function checkSendMessage(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            sendMessage();
        }
    }
</script>

<div class="flex flex-col h-full">
    <Card class="flex-grow max-w-full my-3 h-full dark:bg-gray-700">
        {#each messages as message}
            <Message bind:value={message.content} myMessage={message.myMessage}/>
        {/each}
    </Card>

    <div class="flex mb-5">
        <Textarea bind:value={textArea} on:keyup={checkSendMessage} placeholder="Enter text to send..."></Textarea>
        <Button disabled={lastMessage.active} class="ml-3" on:click={sendMessage}>Send</Button>
    </div>
</div>