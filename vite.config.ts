import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import packageJson from "./package.json";

export default defineConfig({
    build: {
        assetsDir: '',
        sourcemap: false,
        copyPublicDir: true,
        emptyOutDir: false,
        lib: {
            entry: 'main.js',
            formats: ['iife'],
            name: 'GlobeJs',
            fileName: () => `globe-app-v${packageJson.version}.js`
        }
    }
})