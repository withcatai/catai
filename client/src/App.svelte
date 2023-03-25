<script>
    import './App.css';

    import {Navbar, NavBrand} from 'flowbite-svelte';
    import {DarkMode} from 'flowbite-svelte';
    import Logo from './lib/Logo.svelte';
    import Chat from './lib/Chat.svelte';


</script>

<main>
    <Navbar let:hidden let:toggle>
        <NavBrand href="/">
            <Logo/>
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              GPT Chat
            </span>
        </NavBrand>
        <DarkMode/>
    </Navbar>

    <div class="grid main-app">
        <div class="container h-full">
            <Chat />
        </div>
    </div>
</main>


<style>
    .container {
        margin: auto;
    }
</style>