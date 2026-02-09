import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import { articles } from './src/data/articles'

const dynamicRoutes = [
  ...articles.map(article => `/artigo/${article.slug}`),
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
  '/privacy'
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