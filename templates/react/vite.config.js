import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import path from "node:path";
import react from "@vitejs/plugin-react";
import frappeui from "frappe-ui/vite";
import { defineConfig } from "vite";

// ============================================================
// CONFIGURATION — set by init.sh (do not edit manually)
// ============================================================
const APP_NAME = "{{APP_NAME}}";
const FRONTEND_PATH = "{{FRONTEND_PATH}}"; // URL path → served at /{FRONTEND_PATH}/
const FOLDER_NAME = "{{FOLDER_NAME}}";     // folder name inside public/ → /assets/{APP_NAME}/{FOLDER_NAME}/

// Generates www/{FRONTEND_PATH}/index.html as a Frappe Jinja template after each build.
// Transforms asset paths from vite's base URL to Frappe's /assets/{app}/{folder}/ format
// and injects the boot data block read by index.py.
function frappeJinjaPlugin() {
	const outIndexHtml = `../${APP_NAME}/public/${FOLDER_NAME}/index.html`;
	const wwwIndexHtml = `../${APP_NAME}/www/${FRONTEND_PATH}/index.html`;
	return {
		name: "frappe-jinja-html",
		apply: "build",
		closeBundle() {
			const html = readFileSync(outIndexHtml, "utf-8");
			const jinja = html
				.replace(
					new RegExp(`(src|href)="/${FRONTEND_PATH}/`, "g"),
					`$1="/assets/${APP_NAME}/${FOLDER_NAME}/`,
				)
				.replace(
					"</body>",
					`  <script>
      {%- for key in boot %}
      window["{{ key }}"] = {{ boot[key] | tojson }};
      {%- endfor %}
  </script>\n</body>`,
				);
			mkdirSync(dirname(wwwIndexHtml), { recursive: true });
			writeFileSync(wwwIndexHtml, jinja);
			console.log(`  ✔ Jinja template → ${wwwIndexHtml}`);
		},
	};
}

export default defineConfig({
	plugins: [
		frappeui({ frappeProxy: true, jinjaBootData: false, buildConfig: false, lucideIcons: false }),
		react(),
		frappeJinjaPlugin(),
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
		},
	},
	server: {
		host: true,
		port: 8080,
		allowedHosts: true,
		historyApiFallback: true,
	},
	base: `/${FRONTEND_PATH}/`,
});
