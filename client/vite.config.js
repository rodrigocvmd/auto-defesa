import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
    })
  ],
})