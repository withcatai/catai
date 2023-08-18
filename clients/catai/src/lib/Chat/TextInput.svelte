<script lang="ts">
import {Textarea} from 'flowbite-svelte';

export let onEnter: () => void;
export let value: string;

function checkSendMessage(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onEnter();
    }
}

</script>

<Textarea bind:value placeholder="Enter text to send..." autofocus on:keypress={checkSendMessage} {...$$restProps}></Textarea>