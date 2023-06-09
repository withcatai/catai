<script lang="ts">
    import {Button, Modal, Toast, GradientButton} from 'flowbite-svelte';
    import {Clipboard, Clock, PaperAirplane} from 'svelte-heros-v2';
    import {getHistory, saveHistory} from '../../utils/actions/history.js';
    import {useTimeout} from '@svelte-use/core';
    import {blur} from 'svelte/transition';

    export let sendPrompt: (prompt: string) => void;

    const {start, ready} = useTimeout(3000, {controls: true, immediate: false});

    let showModal = false;
    let history: string[] = [];

    function openHistory() {
        showModal = true;
        history = getHistory();
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        start();
    }

    function closeHistory() {
        showModal = false;
        history = [];
        saveHistory(history);
    }

    function sendPromptToChat(prompt: string) {
        sendPrompt(prompt);
        showModal = false;
    }
</script>

<GradientButton color="purpleToBlue" on:click={openHistory} pill>
    <Clock/>
</GradientButton>

<Modal title="Old prompts" bind:open={showModal} class="w-full max-h-[calc(100vh-25rem)]" autoclose>
    <div class="flex justify-between">
        <Button color="red" on:click={closeHistory} size="xsm" class="text-xs p-2 shadow-red-500/50">clear</Button>
        <span>
            Total {history.length} prompt{history.length > 1 ? 's' : ''}
        </span>
    </div>
    <div class="overflow-y-auto">
        {#each history as item}
            <div class="border dark:border-gray-600 shadow-md shadow-blue-500 shadow-blue-500 rounded p-3 mb-3">
                <div class="flex d-flex justify-between align-top">
                    <span>{item}</span>
                    <div class="flex gap-2 items-start">
                        <Button size="xs" color="green" class="text-xs p-2 shadow-green-500" on:click={() => copyToClipboard(item)}>
                            <Clipboard size="1rem"/>
                        </Button>
                        <Button size="xs" color="blue" class="text-xs p-2 shadow-green-500" on:click={() => sendPromptToChat(item)}>
                            <PaperAirplane size="1rem"/>
                        </Button>
                    </div>

                </div>
            </div>
        {/each}

    </div>
</Modal>

{#if !$ready}
    <Toast transition={blur} params={{x: 200}} color="green" class="mb-2" position="top-right">
        <Clipboard slot="icon"/>
        Text copied to clipboard
    </Toast>
{/if}

<style>

</style>