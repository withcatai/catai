<script>
    import './App.css';

    import {DarkMode, Navbar, NavBrand} from 'flowbite-svelte';
    import Logo from './lib/Logo.svelte';
    import Chat from './lib/Chat/Chat.svelte';
    import {onMount} from 'svelte';
    import {darkMode} from './utils/dark-mode';

    onMount(() => {
        if ($darkMode) {
            document.querySelector('html').classList.add('dark');
        }
    });
</script>

<main>
    <Navbar let:hidden let:toggle class="bg-gray-100 shadow">
        <NavBrand href="/">
            <Logo height="4"/>
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              CatAI Chat
            </span>
        </NavBrand>
        <div on:click={(() => darkMode.update(last => !last))}>
            <DarkMode/>
        </div>
    </Navbar>

    <div class="grid main-app">
        <div class="container h-full">
            <Chat/>
        </div>
    </div>
</main>


<style>
    .container {
        margin: auto;
    }
</style>