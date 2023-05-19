<script lang="ts">
    import {Button} from 'flowbite-svelte';
    import Message from './Message.svelte';
    import {onMount, tick} from 'svelte';
    import {abortResponse, makeActiveMessage, update} from '../../utils/chat.js';
    import scrollToEnd, {needScroll} from '../../utils/scroll.js';
    import {PaperAirplane as Send, Stop} from 'svelte-heros-v2';
    import History from '../actions/History.svelte';
    import TextInput from './TextInput.svelte';
    import {appendPromptToHistory} from '../../utils/actions/history.js';

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
        appendPromptToHistory(question);
        textareaContent = '';

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

<div class="flex h-full">
    <div class="flex flex-col h-full grow">
        <div bind:this={messagesContainer}
             class="flex-grow max-w-full my-3 h-full dark:bg-gray-700 overflow-auto rounded border dark:border-gray-500 messages-container">
            {#each messages as message}
                {#if !message.hide}
                    <Message value={message.content} error={message.error} myMessage={message.myMessage}/>
                {/if}
            {/each}
        </div>
    
        <div class="flex mb-5">
            <TextInput bind:value={textareaContent} onEnter={sendMessage} />
            <Button disabled={lastMessage.active} color="blue" size="sm" class="ml-3" on:click={sendMessage}>
                <Send />
            </Button>
    
            <Button disabled={!lastMessage.active} color="red" size="sm" class="ml-3" on:click={abortResponse}>
                <Stop />
            </Button>
        </div>
    </div>
    <div class="quick-actions p-3 hidden md:block">
        <History/>
    </div>
</div>



<style>
    .messages-container {
        overflow: scroll;
        max-height: calc(100vh - 11rem);
    }
</style>