import { writable } from 'svelte/store';

const isLocalStorageThemeDark = localStorage.getItem('color-theme') === 'dark'
export const darkMode = writable(isLocalStorageThemeDark);