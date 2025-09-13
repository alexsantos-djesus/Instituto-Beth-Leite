# 🌱 Instituto Beth Leite — Website

Plataforma oficial para adoção, eventos e apoio ao Instituto Beth Leite.  
Desenvolvido com **Next.js 14 + TypeScript + Prisma + Tailwind**, pronto para escalar e encantar.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel" alt="Vercel"/>
</p>

---

## ✨ Funcionalidades

- ✅ Catálogo de animais para adoção  
- ✅ Sistema de solicitações de adoção  
- ✅ Painel administrativo (animais, eventos, parceiros)  
- ✅ Integração com **Cloudinary** (upload de imagens)  
- ✅ Filtros avançados (espécie, porte, idade, sexo)  
- ✅ Landing page institucional (Sobre, Como Ajudar, Padrinhos, Contato)  
- ✅ Animações fluidas com **Framer Motion**  

---

## 🖼️ Screenshots

> Adicione prints para valorizar ainda mais — homepage, listagem de animais, painel admin, etc.

---

## 🚀 Tecnologias

- **Next.js 14** — App Router + SSR/SSG  
- **React 18 + TypeScript**  
- **Prisma ORM** com PostgreSQL  
- **Tailwind CSS** para estilização  
- **Framer Motion** para animações  
- **Lucide Icons** para ícones minimalistas  
- **Cloudinary** para upload e otimização de imagens  
- Deploy via **Vercel**

---

## ⚙️ Instalação e Uso

Clone o projeto e instale as dependências:

```bash
git clone https://github.com/seu-repo/instituto-beth-leite.git
cd instituto-beth-leite
npm install
```

Gere o cliente do Prisma:

```bash
npx prisma generate
```

Crie o banco de dados (dev):

```bash
npx prisma migrate dev
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="sua_api_secret"

# Admin
ADMIN_USER="admin"
ADMIN_PASS="troque-esta-senha"
```

---

## 📜 Scripts

```bash
npm run dev         # Desenvolvimento
npm run build       # Build de produção
npm run start       # Servir build
npm run lint        # Rodar ESLint
```

---

## ☁️ Deploy (Vercel)

1. Conecte o repositório à **Vercel**  
2. Configure as variáveis de ambiente no painel  
3. Build command:

```bash
npm run vercel-build
```

Deploy automático a cada push 🎉

---

## 🤝 Contribuição

Contribuições são bem-vindas!  
Abra uma issue ou envie um pull request 🚀

---

## 📄 Licença

Uso exclusivo do **Instituto Beth Leite**.  
Distribuição sem autorização não é permitida.
