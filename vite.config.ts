import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import mkcert from 'vite-plugin-mkcert'

const hash = fs.readFileSync('public/definitions/hash.json', 'utf8')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		createHtmlPlugin({
			inject: {
				data: {
					hash,
				},
			},
		}),
		mkcert(),
	],
	assetsInclude: ['**/*.glb'],
	envDir: '.',
	server: { open: true, https: {} },
	resolve: {
		alias: {
			src: path.resolve(__dirname, './src'),
			assets: path.resolve(__dirname, './src/assets'),
		},
	},
	optimizeDeps: {
		include: ['@the-via/reader'],
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis',
			},
			// Enable esbuild polyfill plugins
			plugins: [],
		},
	},
})
