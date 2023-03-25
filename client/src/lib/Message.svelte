<script>
    import {Alert, Spinner} from 'flowbite-svelte';
    import Logo from './Logo.svelte';
    import UserIcon from './UserIcon.svelte';
    import SvelteMarkdown from 'svelte-markdown';
    import 'github-markdown-css/github-markdown-dark.css';


    export let value = '';
    export let myMessage = false;
    export let error = '';
</script>

<div class="flex" class:justify-end={myMessage}>
    <Alert class="my-2 w-1/2 p-2 alert-message" color={myMessage ? 'dark': null}>
        <div class="flex w-full" style={`direction: ${myMessage ? 'rtl': 'ltr'}`}>
            {#if !myMessage}
                <Logo/>
            {:else}
                <UserIcon/>
            {/if}

            <div class="flex items-center" style="direction: ltr">
                {#if !value}
                    <Spinner/>
                {:else}
                    <div class="markdown-body">
                        <SvelteMarkdown source={value}/>
                    </div>
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

    .markdown-body {
        background-color: transparent!important;
        white-space: pre-wrap;
        color: inherit!important;
    }
</style>