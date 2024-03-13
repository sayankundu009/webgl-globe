import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
    build: {
        assetsDir: '',
        sourcemap: false,
        copyPublicDir: true,
        lib: {
            entry: 'main.js',
            formats: ['iife'],
            name: 'GlobeJs',
            fileName: () => "globe.js"
        }
    }
})