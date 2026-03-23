import path from "node:path";
import vue from "@vitejs/plugin-vue";
import frappeui from "frappe-ui/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

// ============================================================
// CONFIGURATION — set by init.sh (do not edit manually)
// ============================================================
const APP_NAME = "{{APP_NAME}}";
const FRONTEND_PATH = "{{FRONTEND_PATH}}"; // URL path → served at /{FRONTEND_PATH}/
const FOLDER_NAME = "{{FOLDER_NAME}}";     // folder name inside public/ → /assets/{APP_NAME}/{FOLDER_NAME}/

export default defineConfig({
	plugins: [
		frappeui({
			frappeProxy: true,
			jinjaBootData: true,
			lucideIcons: true,
			buildConfig: {
				indexHtmlPath: `../${APP_NAME}/www/${FRONTEND_PATH}/index.html`,
				emptyOutDir: true,
				sourcemap: true,
			},
		}),
		vue(),
		Icons({ compiler: "vue3", autoInstall: false }),
	],
	build: {
		chunkSizeWarningLimit: 1500,
		outDir: `../${APP_NAME}/public/${FOLDER_NAME}`,
		emptyOutDir: true,
		target: "es2015",
		sourcemap: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"tailwind.config.js": path.resolve(__dirname, "tailwind.config.js"),
		},
	},
	optimizeDeps: {
		include: ["feather-icons", "showdown"],
	},
	server: {
		host: true,
		port: 8080,
		allowedHosts: true,
		historyApiFallback: true,
	},
	base: `/${FRONTEND_PATH}/`,
});
