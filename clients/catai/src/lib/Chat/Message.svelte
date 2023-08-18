<script lang="ts">
    import {Alert, Spinner} from 'flowbite-svelte';
    import Logo from '../Logo.svelte';
    import UserIcon from '../UserIcon.svelte';
    import Markdown from './Markdown.svelte';

    export let value = '';
    export let myMessage = false;
    export let error = '';

    let showOriginalCode = false;
</script>

<div class="flex">
    <Alert class={`w-full p-4 alert-message text-base rounded-none ${myMessage ? 'bg-transparent dark:bg-gray-600': 'dark:bg-gray-800'}`}
           color={myMessage ? 'light': 'blue'}>
        <div class="flex w-full">
            <div on:click={() => showOriginalCode = !showOriginalCode}>
                {#if !myMessage}
                    <Logo/>
                {:else}
                    <UserIcon/>
                {/if}
            </div>


            <div class="w-full text-base">
                {#if !value && !error}
                    <Spinner/>
                {:else}
                    {#if !showOriginalCode}
                        <Markdown {value}/>
                    {:else}
                        <div class="show-original">
                            {value}
                        </div>
                    {/if}
                    {#if error}
                        <p class="text-red-500">Error: {error}</p>
                    {/if}
                {/if}
            </div>

        </div>
    </Alert>
</div>

<style global>
    .alert-message > div > div {
        width: 100%;
    }

    .alert-message > div > div p {
        margin-bottom: 10px;
    }

    .alert-message > div > div p:last-child {
        margin-bottom: auto;
    }

    .show-original {
        white-space: pre-wrap;
    }
</style>
