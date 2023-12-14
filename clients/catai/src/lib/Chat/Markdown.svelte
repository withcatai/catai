<script lang="ts">
    import markdownIt from 'markdown-it';
    import '../../assets/css/highlight.css';
    import '../../assets/css/markdown.css';
    import HighlightJS from 'highlight.js';
    import {useTimeout} from '@svelte-use/core';
    import {Toast} from 'flowbite-svelte';
    import {Clipboard} from 'svelte-heros-v2';
    import {blur} from 'svelte/transition';

    const {start, ready} = useTimeout(3000, {controls: true, immediate: false});

    const md = markdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: false,
        highlight: function (str, lang) {
            let htmlContent = str;
            try {
                if (!HighlightJS.getLanguage(lang)) {
                    htmlContent = HighlightJS.highlightAuto(str).value;
                } else {
                    htmlContent = HighlightJS.highlight(str, {language: lang}).value;
                }
            } catch {}

            const copyText = str.replaceAll('"', '&quot;').replaceAll('\'', '&lt;').replaceAll('\n', '\\n');
            return `<div style="position: relative">${
                ''
                }<button class="copy-clipboard text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 focus:ring-green-300 dark:focus:ring-green-800 rounded-lg text-xs p-2 shadow-green-500" onclick="copyToClipboard('${copyText}')">${''
                    }<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" aria-label="clipboard" fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path d="M15.6657 3.88789C15.3991 2.94272 14.5305 2.25 13.5 2.25H10.5C9.46954 2.25 8.60087 2.94272 8.33426 3.88789M15.6657 3.88789C15.7206 4.0825 15.75 4.28782 15.75 4.5V4.5C15.75 4.91421 15.4142 5.25 15 5.25H9C8.58579 5.25 8.25 4.91421 8.25 4.5V4.5C8.25 4.28782 8.27937 4.0825 8.33426 3.88789M15.6657 3.88789C16.3119 3.93668 16.9545 3.99828 17.5933 4.07241C18.6939 4.20014 19.5 5.149 19.5 6.25699V19.5C19.5 20.7426 18.4926 21.75 17.25 21.75H6.75C5.50736 21.75 4.5 20.7426 4.5 19.5V6.25699C4.5 5.149 5.30608 4.20014 6.40668 4.07241C7.04547 3.99828 7.68808 3.93668 8.33426 3.88789" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>${''
                }</button>${
                htmlContent
            }</div>`;
        }
    });

    window.copyToClipboard = function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        start();
    }

    export let value = '';
    $: markedCode = md.render(value);
</script>

<div class="markdown-body grid">
    {@html markedCode}
</div>


{#if !$ready}
    <Toast transition={blur} params={{x: 200}} color="green" class="mb-2" position="top-right">
        <Clipboard slot="icon"/>
        Text copied to clipboard
    </Toast>
{/if}

<style lang="scss" global>
  .markdown-body {
    background-color: transparent !important;
    color: inherit !important;
    font-size: inherit !important;
    white-space: pre-wrap;

    ol, ul, menu {
      list-style: auto !important;
    }

    .copy-clipboard {
      position: absolute;
      right: 0;
    }
  }
</style>
