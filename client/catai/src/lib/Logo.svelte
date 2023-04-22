<script>
    import Logo from '../assets/logo.png';

    export let height = 3;

</script>

<img
        src={Logo}
        class="mr-3"
        alt="GPT Logo"
        style={`height: ${height}rem`}
/>

<style>
    img {
        filter: drop-shadow(0px 1px 15px rgba(255, 255, 255, 0.36));
    }
</style>