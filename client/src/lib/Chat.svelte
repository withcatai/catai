<script lang="ts">
    import {Button, Textarea} from 'flowbite-svelte';
    import Message from './Message.svelte';
    import {onMount, tick} from 'svelte';
    import {makeActiveMessage, setUpdate} from '../utils/chat.js';

    type message = {
        content?: string,
        myMessage?: boolean,
        active?: boolean,
        error?: string
    }

    export let messages: message[] = [{
        content: '',
        active: false,
        error: ''
    }];

    let messagesContainer;
    const scrollToEnd = () => messagesContainer.scrollTop = messagesContainer.scrollHeight;
    setUpdate(() => {
        messages = messages;
        scrollToEnd();
    });

    $: lastMessage = messages.at(-1);
    let textArea = '';

    async function sendMessage() {
        const question = textArea.trim();
        if (lastMessage.active || !question) return;

        const aiMessage = {
            content: '',
            active: true,
            error: ''
        };

        messages.push({ content: question, myMessage: true}, aiMessage);

        makeActiveMessage(question, aiMessage);
        messages = messages;
        textArea = '';

        await tick();
        scrollToEnd();
    }

    function checkSendMessage(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    onMount(() => {
        makeActiveMessage(null, lastMessage);
    });
</script>

<div class="flex flex-col h-full">
    <div bind:this={messagesContainer}
         class="flex-grow max-w-full my-3 h-full dark:bg-gray-700 overflow-auto rounded border dark:border-gray-500 messages-container">
        {#each messages as message}
            <Message bind:value={message.content} bind:error={message.error} myMessage={message.myMessage}/>
        {/each}
    </div>

    <div class="flex mb-5">
        <Textarea bind:value={textArea} on:keypress={checkSendMessage} placeholder="Enter text to send..."></Textarea>
        <Button disabled={lastMessage.active} class="ml-3" on:click={sendMessage}>Send</Button>
    </div>
</div>


<style>
    .messages-container {
        overflow: scroll;
        max-height: calc(100vh - 11rem);
    }
</style>