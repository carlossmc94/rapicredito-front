import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/rapicredito-front/', // 👈 Muy importante para GitHub Pages
  plugins: [react()],
});
