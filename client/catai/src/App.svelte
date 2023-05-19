<script>
    import './App.css';

    import {Navbar, NavBrand} from 'flowbite-svelte';
    import {DarkMode} from 'flowbite-svelte';
    import Logo from './lib/Logo.svelte';
    import Chat from './lib/Chat/Chat.svelte';
    import {onMount} from 'svelte';

    onMount(() => {
        if(localStorage.getItem('color-theme') === 'dark') {
            document.querySelector('html').classList.add('dark')
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