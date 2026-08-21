import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        port: Number(process.env.CLIENT_PORT) || 3000
    },
    define: {
        __EXTERNAL_SERVER_URL__: JSON.stringify(process.env.EXTERNAL_SERVER_URL),
        __INTERNAL_SERVER_URL__: JSON.stringify(process.env.INTERNAL_SERVER_URL),
        __BUILD_TIME__: Date.now()
    },
    build: {
        outDir: path.join(__dirname, 'dist/client')
    },
    ssr: {
        format: 'cjs'
    },
    plugins: [
        react(),
        svgr(),
        VitePWA({
            registerType: 'autoUpdate',
            // Регистрация вручную в registerSW.ts — не инжектить второй скрипт
            injectRegister: false,
            strategies: 'injectManifest',
            srcDir: 'src/service-workers',
            filename: 'sw.ts',
            injectManifest: {
                // Плагин сам найдет все .js, .css, .html, .png файлы в папке dist
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                globIgnores: ['sw192.png', 'sw512.png']
            },
            // Данные для манифеста (чтобы сайт можно было установить на телефон как приложение)
            manifest: {
                name: 'Star Shooter',
                short_name: 'Star Shooter',
                description: 'Динамичный 2d-шутер в космическом пространстве. Уворачивайся от препятствий, собирай бонусы и набирай очки.',
                theme_color: '#0b0f34',
                icons: [
                    {
                        src: '/sw192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/sw512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                ]
            },
            devOptions: {
                enabled: false
            }
        }),
    ]
});
