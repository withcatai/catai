<script>
    import {Alert, Spinner} from 'flowbite-svelte';
    import Logo from './Logo.svelte';
    import UserIcon from './UserIcon.svelte';
    import SvelteMarkdown from 'svelte-markdown'

    export let value = '';
    export let myMessage = false;
</script>

<div class="flex" class:justify-end={myMessage}>
    <Alert class="w-1/2 my-2 p-2 alert-message" color={myMessage ? 'dark': null}>
        <div class="flex w-full" style={`direction: ${myMessage ? 'rtl': 'ltr'}`}>
            {#if !myMessage}
                <Logo/>
            {:else}
                <UserIcon/>
            {/if}

            <span class="flex items-center" style="direction: ltr">
                {#if !value}
                    <Spinner/>
                {:else}
                    <SvelteMarkdown source={value}/>
                {/if}
            </span>

        </div>
    </Alert>
</div>

<style global>
    .alert-message > div > div {
        width: 100%;
    }
</style>