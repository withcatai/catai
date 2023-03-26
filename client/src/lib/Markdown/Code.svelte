<script>
    import '../../assets/css/highlight.css';
    import HighlightJS from 'highlight.js';

    export let lang;
    export let text;

    $: language = HighlightJS.getLanguage(lang) ? lang: 'plaintext';
    $: htmlContent = HighlightJS.highlight(text, { language }).value;
</script>

<pre class={"lang-"+ lang}>
    <code>{@html htmlContent}</code>
</pre>