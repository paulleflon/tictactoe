import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { execSync } from 'node:child_process';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		{
			name: 'git-commit-info',
			config() {
				const hash = execSync('git log -1 --pretty=format:"%h"').toString().trim();
				const now = new Date().toLocaleString(undefined, {
					month: 'long',
					day: '2-digit',
					year: 'numeric',
					hour12: false,
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					weekday: 'long',
				});
				process.env.VITE_GIT_COMMIT_HASH = hash;
				process.env.VITE_BUILD_TIME = now;
			},
		},
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
