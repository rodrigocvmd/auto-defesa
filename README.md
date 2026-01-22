# Auto Defesa - MVP

Aplicação Web para geração automática de defesas de multas de trânsito utilizando Inteligência Artificial (Gemini API).

## Estrutura do Projeto

O projeto é um monorepo simples contendo:

- `/client`: Frontend em React (Vite) + Tailwind CSS.
- `/functions`: Backend Serverless (Firebase Cloud Functions).

## Como Rodar o Frontend (Desenvolvimento)

1. Entre na pasta do cliente:
   ```bash
   cd client
   ```
2. Instale as dependências (se ainda não fez):
   ```bash
   npm install
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Backend (Firebase Functions)

As funções estão na pasta `/functions`. Para testar localmente, você precisará do `firebase-tools` instalado globalmente e configurar o emulador, mas por enquanto, o foco é o frontend.

## Stack Tecnológica

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Firebase (Functions, Firestore, Auth)
- **AI:** Google Gemini API
