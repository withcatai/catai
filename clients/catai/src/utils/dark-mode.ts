import {writable} from 'svelte/store';

const storedColorTheme = localStorage.getItem('color-theme');
const isLocalStorageThemeDark = storedColorTheme ?
    storedColorTheme === 'dark' :
    window?.matchMedia?.('(prefers-color-scheme:dark)').matches;
export const darkMode = writable(isLocalStorageThemeDark);