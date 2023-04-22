<script lang="ts">
    import {Button, Textarea} from 'flowbite-svelte';
    import Message from './Message.svelte';
    import {onMount, tick} from 'svelte';
    import {makeActiveMessage, update} from '../utils/chat.js';
    import scrollToEnd, {needScroll} from '../utils/scroll.js';

    type message = {
        content?: string,
        myMessage?: boolean,
        active?: boolean,
        error?: string
        hide?: boolean
    }

    export let messages: message[] = [{content: '', active: false, error: '', hide: true}];
    let textareaContent = '';
    let messagesContainer;

    $: lastMessage = messages.at(-1);

    async function sendMessage() {
        const question = textareaContent.trim();
        if (lastMessage.active || !question) return;

        const aiMessage = {content: '', active: true, error: ''};
        messages.push({content: question, myMessage: true}, aiMessage);
        await update.func();

        makeActiveMessage(question, aiMessage);
        textareaContent = '';

    }

    function checkSendMessage(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    onMount(() => {
        makeActiveMessage(null, lastMessage);

        update.func = async () => {
            const scroll = needScroll(messagesContainer);
            messages = messages;
            await tick();
            scroll && scrollToEnd(messagesContainer);
        };
    });
</script>

<div class="flex flex-col h-full">
    <div bind:this={messagesContainer}
         class="flex-grow max-w-full my-3 h-full dark:bg-gray-700 overflow-auto rounded border dark:border-gray-500 messages-container">
        {#each messages as message}
            {#if !message.hide}
                <Message value={message.content} error={message.error} myMessage={message.myMessage}/>
            {/if}
        {/each}
    </div>

    <div class="flex mb-5">
        <Textarea bind:value={textareaContent} on:keypress={checkSendMessage}
                  placeholder="Enter text to send..." autofocus></Textarea>
        <Button disabled={lastMessage.active} class="ml-3" on:click={sendMessage}>Send</Button>
    </div>
</div>


<style>
    .messages-container {
        overflow: scroll;
        max-height: calc(100vh - 11rem);
    }
</style>