import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
            },
            '/ws': {
                target: 'ws://127.0.0.1:3000',
                ws: true,
            },
        },
        watch: {
            usePolling: true,
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
    },
});
