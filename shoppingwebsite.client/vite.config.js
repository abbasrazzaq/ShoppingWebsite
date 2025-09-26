import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';
import react from '@vitejs/plugin-react';

const certificateName = 'shoppingwebsite.client';
const baseFolder = env.APPDATA
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

export default defineConfig(({ command }) => {
// Only generate the dev certificate in local "serve" mode
if (command === 'serve') {
	if (!fs.existsSync(baseFolder)) {
		fs.mkdirSync(baseFolder, { recursive: true });
	}
	
	const missingCert = !fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath);

	if (missingCert) {
		const result = child_process.spawnSync(
		'dotnet', 
		[	 		 
			'dev-certs',
			'https',
			'--export-path',
			certFilePath,
			'--format',
			'Pem',
			'--no-password',
		], 
		{ stdio: 'inherit', }
		);
		if (result.status !== 0) {
			throw new Error("Could not create certificate.");
		}
	}
}

// Determine your ASP.NET Core backend URL for proxy										  
const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7185';
	
return {
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': { target, secure: false },
            '^/api': { target, secure: false, changeOrigin: true
            }
        },
        port: parseInt(env.DEV_SERVER_PORT || '59787'),
        https: 
			command === 'serve'
				? {
					key: fs.readFileSync(keyFilePath),
					cert: fs.readFileSync(certFilePath),
				  }
			      : false,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js'
    },
};
});
