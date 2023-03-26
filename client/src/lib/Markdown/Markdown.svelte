<script>
    import SvelteMarkdown from 'svelte-markdown';
    import '../../assets/css/markdown.css';
    import Code from './Code.svelte';

    export let value = '';
    $: console.log(value)
</script>

<div class="markdown-body">
    <SvelteMarkdown bind:source={value} renderers={{code: Code}}/>
</div>

<style>
    .markdown-body {
        background-color: transparent!important;
        white-space: pre-wrap;
        color: inherit!important;
    }
</style>
