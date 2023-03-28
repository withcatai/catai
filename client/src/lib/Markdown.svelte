<script>
    import markdownIt from 'markdown-it';
    import '../assets/css/highlight.css';
    import '../assets/css/markdown.css';
    import HighlightJS from 'highlight.js';
    import {detect} from 'program-language-detector';

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
    export let autoDetectLanguage = true;
    let markedCode;

    $: {
        markedCode = value;

        if(autoDetectLanguage){
            const language = detect(value);
            if(language !== 'Unknown'){
                markedCode = `\`\`\`${language}\n${value}\n\`\`\``;
            }
        }

        markedCode = md.render(markedCode);
    }
</script>

<div class="markdown-body grid">
    {@html markedCode}
</div>

<style global>
    .markdown-body {
        background-color: transparent !important;
        white-space: pre-wrap;
        color: inherit !important;
    }

    .markdown-body ol, ul, menu {
        list-style: auto!important;
        line-height: .8;
    }
</style>
