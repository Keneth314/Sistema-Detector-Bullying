import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig({
  base: '/Sistema-Detector-Bullying/',
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
  build: {
    outDir: 'build',  // <-- carpeta de salida para el build
    minify: 'terser', // <-- minificación avanzada
    terserOptions: {
      compress: {
        drop_console: true,    // elimina console.log para reducir tamaño
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 600, // opcional, aumenta límite para evitar warnings por tamaño
  },
});
