<script lang="ts">
    import markdownIt from 'markdown-it';
    import '../../assets/css/highlight.css';
    import '../../assets/css/markdown.css';
    import HighlightJS from 'highlight.js';

    const md = markdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: false,
        highlight: function (str, lang) {
            try {
                if(!HighlightJS.getLanguage(lang)){
                    return HighlightJS.highlightAuto(str).value;
                }
                return HighlightJS.highlight(str, {language: lang}).value;
            } catch {
                return str;
            }
        }
    });

    export let value = '';
    $: markedCode = md.render(value);
</script>

<div class="markdown-body grid">
    {@html markedCode}
</div>

<style global>
    .markdown-body {
        background-color: transparent !important;
        color: inherit !important;
        font-size: inherit!important;
        white-space: pre-wrap;
    }

    .markdown-body ol, ul, menu {
        list-style: auto!important;
    }
</style>
