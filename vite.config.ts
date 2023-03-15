import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [],
    server: {
        headers: {
            'Cross-Origin-Opener-Policy':'same-origin',
            'Cross-Origin-Embedder-Policy':'require-corp'
        }
    }
})