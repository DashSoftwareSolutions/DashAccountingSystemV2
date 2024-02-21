import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/app',
    server: {
        port: 6363,
    },
    plugins: [react()],
});
