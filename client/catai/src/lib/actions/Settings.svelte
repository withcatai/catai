<script lang="ts">
    import {Button, GradientButton, Modal, Toast} from 'flowbite-svelte';
    import {AceEditor} from 'svelte-ace';
    import 'brace/mode/json';
    import 'brace/theme/tomorrow';
    import 'brace/theme/tomorrow_night';
    import {ArrowPath, Cog6Tooth, InboxArrowDown, CheckCircle, InformationCircle} from 'svelte-heros-v2';
    import {darkMode} from '../../utils/dark-mode.js';
    import {onMount} from 'svelte';
    import {getSettings, haveAdminAccess, saveSettings, restartServer} from '../../utils/actions/admin.js';
    import {useTimeout} from '@svelte-use/core';
    import {blur} from 'svelte/transition';

    const {start: startSave, ready: readySave} = useTimeout(3000, {controls: true, immediate: false});
    const {start: startRestart, ready: readyRestart} = useTimeout(3000, {controls: true, immediate: false});

    export let showModal = false;
    export let value = 'Loading settings...';
    export let showSettingsButton = false;

    $: theme = $darkMode ? 'tomorrow_night' : 'tomorrow';

    async function saveSettingsClick(){
        showModal = false;
        await saveSettings(JSON.parse(value));
        startSave();
    }

    async function restartServerClick(){
        await saveSettingsClick();
        await restartServer();
        startRestart();
        readyRestart.subscribe((value) => {
            value && window.location.reload();
        });
    }

    onMount(async () => {
        showSettingsButton = await haveAdminAccess();
        if(showSettingsButton){
            value = JSON.stringify(await getSettings(), null, 2);
        }
    });
</script>

{#if showSettingsButton}
    <GradientButton color="cyanToBlue" on:click={() => showModal = true} pill>
        <Cog6Tooth/>
    </GradientButton>
{/if}

<Modal title="Model Settings" bind:open={showModal} class="w-full max-h-[calc(100vh-25rem)]" autoclose>
    <AceEditor
            bind:value
            bind:theme
            lang="json"
            readonly={false}
            height="30rem"
            width="100%"
    />

    <svelte:fragment slot='footer'>
        <Button title="Save" color="green" on:click={saveSettingsClick}>
            <InboxArrowDown/>
        </Button>

        <Button title="Save & Restart server" color="blue" on:click={restartServerClick}>
            <ArrowPath/>
        </Button>
    </svelte:fragment>
</Modal>

{#if !$readySave}
    <Toast transition={blur} params={{x: 200}} color="green" class="mb-2" position="top-right">
        <CheckCircle slot="icon"/>
        Settings saved
    </Toast>
{/if}

{#if !$readyRestart}
    <Toast transition={blur} params={{x: 200}} color="green" class="mb-2" position="top-right">
        <InformationCircle slot="icon"/>
        After a restart, the client will automatically reload.
    </Toast>
{/if}