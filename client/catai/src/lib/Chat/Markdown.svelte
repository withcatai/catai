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
            }<button class="copy-clipboard text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 focus:ring-green-300 dark:focus:ring-green-800 rounded-lg text-xs p-2 shadow-green-500" onclick="copyToClipboard('${copyText}')">Copy</button>${
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
