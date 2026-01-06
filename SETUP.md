# PMMIRIM Portal - Setup Guide

## Configuração do Ambiente

### 1. Criar arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Database Configuration
DATABASE_URL="mysql://root:@localhost:3306/pmmirim_db"

# NextAuth Configuration
# Gere uma chave secreta com: openssl rand -base64 32
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Production URL (descomente e atualize ao fazer deploy)
# NEXTAUTH_URL="https://seudominio.com"
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Criar banco de dados e tabelas
npx prisma db push

# Popular com dados iniciais (usuário admin)
npx tsx prisma/seed.ts
```

**Credenciais do Admin Padrão:**
- Email: `admin@pmmirim.org.br`
- Senha: `123456`

### 4. Executar o Projeto

```bash
npm run dev
```

O projeto estará disponível em: http://localhost:3000

## Estrutura do Projeto

- `/` - Página inicial com notícias
- `/noticias` - Lista de notícias com paginação
- `/noticias/[slug]` - Detalhes de uma notícia
- `/sobre` - Sobre a instituição
- `/contato` - Formulário de contato
- `/login` - Página de login
- `/admin` - Painel de gerenciamento (ADMIN apenas)
- `/admin/posts` - Gerenciar posts/notícias

## Melhorias Implementadas

### ✅ Correções de Erros
- Variáveis de ambiente configuradas
- Tipagem NextAuth corrigida (sem @ts-ignore)
- Metadata atualizada para português
- Schema Prisma usando env()

### ✅ Sistema de Upload
- Upload de imagens com validação
- Limite de 5MB por arquivo
- Tipos permitidos: JPG, PNG, WEBP, GIF
- API route para upload do TipTap

### ✅ Validação com Zod
- Schemas de validação para todas as entidades
- Server actions com validação robusta
- Mensagens de erro em português

### ✅ Páginas Públicas
- /noticias - Lista com filtros e paginação
- /noticias/[slug] - Detalhes com posts relacionados
- /sobre - História, missão, visão e valores
- /contato - Formulário funcional

### ✅ UI/UX Moderna
- Design com gradientes e sombras
- Animações suaves (hover, translate)
- Cards responsivos
- Seção de destaque (featured posts)
- Estatísticas com ícones animados

### ✅ Segurança
- Rate limiting no login (5 tentativas/15min)
- Validação de tipos de arquivo
- Proteção de rotas com middleware
- Senhas criptografadas com bcrypt

## Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para MySQL
- **NextAuth v5** - Autenticação
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Zod** - Validação de schemas
- **TipTap** - Editor de texto rico
