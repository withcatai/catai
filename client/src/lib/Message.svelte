<script>
    import {Alert, Spinner} from 'flowbite-svelte';
    import Logo from './Logo.svelte';
    import UserIcon from './UserIcon.svelte';
    import Markdown from './Markdown.svelte';

    export let value = '';
    export let myMessage = false;
    export let error = '';
    export let autoDetectLanguage = true;

    $: {
        if(value.endsWith('\n> ')){
            value = value.slice(0, -3).trimEnd();
        }
    }
</script>

<div class="flex">
    <Alert class={`w-full p-4 alert-message rounded-none ${myMessage ? 'bg-transparent dark:bg-gray-600': 'dark:bg-gray-800'}`}
           color={myMessage ? 'dark': null}>
        <div class="flex w-full">
            {#if !myMessage}
                <Logo/>
            {:else}
                <UserIcon/>
            {/if}

            <div>
                {#if !value && !error}
                    <Spinner/>
                {:else}
                    <Markdown {value} {autoDetectLanguage}/>
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
</style>