import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const prerender = require('vite-plugin-prerender')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Extração segura dos slugs para evitar execução de JSX/CJS durante o build
const getArticleRoutes = () => {
  try {
    const filePath = path.resolve(__dirname, 'src/data/articles.jsx')
    const content = fs.readFileSync(filePath, 'utf-8')
    return [...content.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => `/artigo/${m[1]}`)
  } catch (e) {
    console.warn('Sitemap: Erro ao ler artigos, usando lista vazia.')
    return []
  }
}

const dynamicRoutes = [
  '/',
  '/motorista-app',
  '/caminhoneiro',
  '/motoqueiro',
  '/ppd',
  '/login',
  '/register',
  '/pricing',
  '/how-it-works',
  '/about',
  '/help',
  '/guia',
  '/recursos',
  '/terms',
  '/privacy',
  ...getArticleRoutes()
]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://meuautodefesa.com.br',
      dynamicRoutes
    }),
    prerender({
      // O diretório de build final (onde o Vite coloca os arquivos)
      staticDir: path.join(__dirname, 'dist'),
      // Lista de rotas para pré-renderizar
      routes: dynamicRoutes,
      // Configurações do renderizador (usa Puppeteer por padrão)
      rendererConfig: {
        // Aguarda até que o elemento #root esteja presente no DOM
        renderAfterElementExists: '#root',
        // Opcional: silencia logs do console durante o processo
        headless: true,
        // Limita o número de páginas renderizadas simultaneamente para evitar sobrecarga
        maxConcurrentRoutes: 5
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})