# Portal Polícia Militar Mirim — Presidente Médici/RO

Portal institucional completo com painel administrativo para gerenciamento de conteúdo, membros, eventos, galeria, projetos sociais e monitoramento de alunos.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Requisitos](#requisitos)
4. [Instalação e Configuração](#instalação-e-configuração)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Banco de Dados](#banco-de-dados)
7. [Arquitetura](#arquitetura)
8. [Estrutura de Pastas](#estrutura-de-pastas)
9. [Rotas Públicas](#rotas-públicas)
10. [Rotas Administrativas](#rotas-administrativas)
11. [API Routes](#api-routes)
12. [Autenticação](#autenticação)
13. [Upload de Arquivos](#upload-de-arquivos)
14. [Schema do Banco de Dados](#schema-do-banco-de-dados)
15. [Camadas da Aplicação](#camadas-da-aplicação)
16. [Componentes Principais](#componentes-principais)
17. [Funcionalidades](#funcionalidades)
18. [Deploy](#deploy)
19. [Scripts Disponíveis](#scripts-disponíveis)

---

## Visão Geral

O **pmmirim-portal** é uma aplicação full-stack que serve como site institucional e sistema de gestão de conteúdo (CMS) para a Polícia Militar Mirim de Presidente Médici/RO. O portal oferece:

- Site público com notícias, eventos, cursos, galeria, projetos e informações institucionais
- Painel administrativo completo para gerenciamento de todo o conteúdo
- Sistema de monitoramento de alunos (boletins e frequência)
- Integração com Instagram
- Upload de imagens via UploadThing
- Editor de texto rico (TipTap)
- Autenticação segura com suporte a email/senha e Google OAuth

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.1.0 (App Router) |
| Frontend | React 19.2.3 |
| Linguagem | TypeScript 5 |
| Banco de Dados | PostgreSQL (Supabase) |
| ORM | Prisma 5.22.0 |
| Autenticação | NextAuth 5.0.0-beta (v5) |
| Upload | UploadThing 7.7.4 |
| Editor Rich Text | TipTap |
| Estilização | Tailwind CSS 4 |
| Componentes UI | Radix UI + shadcn/ui |
| Ícones | Lucide React |
| Email | Nodemailer |
| Formulários | React Hook Form + Zod |
| Carrossel | Embla Carousel |
| Notificações | Sonner |

---

## Requisitos

- **Node.js** 20 ou superior
- **npm** 10 ou superior
- Conta no **Supabase** (banco de dados PostgreSQL)
- Conta no **UploadThing** (upload de arquivos)
- Conta no **Google Cloud** (OAuth, opcional)
- Conta no **Vercel** (deploy, recomendado)

---

## Instalação e Configuração

```bash
# 1. Clone o repositório
git clone https://github.com/adiltonandredev/pmmirim-portal.git
cd pmmirim-portal

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# 4. Sincronize o schema com o banco de dados
npx prisma db push

# 5. (Opcional) Execute o seed inicial
npx prisma db seed

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados (Supabase)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-gerada-com-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# UploadThing (upload de imagens)
UPLOADTHING_TOKEN="seu-token-uploadthing"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# Email (Nodemailer - recuperação de senha)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
EMAIL_FROM="noreply@pmmirim.com.br"
```

---

## Banco de Dados

O projeto utiliza **Prisma** com **PostgreSQL** (via Supabase).

```bash
# Sincronizar schema com o banco (desenvolvimento)
npx prisma db push

# Gerar o Prisma Client após alterações no schema
npx prisma generate

# Abrir o Prisma Studio (interface visual do banco)
npx prisma studio

# Executar seed inicial
npx prisma db seed
```

> **Importante:** Em produção (Vercel), o build já executa `prisma generate` automaticamente via script `prebuild`.

---

## Arquitetura

A aplicação segue uma arquitetura em camadas bem definida:

```
┌─────────────────────────────────────────┐
│         Cliente (React Components)       │
│    (Server Components + Client Components) │
├─────────────────────────────────────────┤
│         Server Actions ("use server")    │
│     (Ponto de entrada para mutações)     │
├─────────────────────────────────────────┤
│         Services (Lógica de Negócio)     │
│    (Validação, transformação, regras)    │
├─────────────────────────────────────────┤
│         Repositories (Acesso a Dados)    │
│         (Queries Prisma diretas)         │
├─────────────────────────────────────────┤
│              Prisma ORM                  │
├─────────────────────────────────────────┤
│        PostgreSQL (Supabase)             │
└─────────────────────────────────────────┘
```

**Padrões utilizados:**
- **Server Components** por padrão — `"use client"` apenas quando necessário (estado, eventos)
- **Server Actions** para todas as mutações — sem endpoints REST custom para CRUD
- **Repository Pattern** — acesso ao banco isolado em repositórios
- **Service Layer** — regras de negócio desacopladas dos controllers
- **Form Actions** — React 19 `action={serverAction}` para submissão de formulários

---

## Estrutura de Pastas

```
pmmirim-portal/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.ts                # Dados iniciais
├── public/
│   ├── bg/                    # Imagens de fundo das páginas
│   └── uploads/               # Uploads locais (dev)
├── src/
│   ├── app/
│   │   ├── (public)/          # Rotas públicas do site
│   │   ├── admin/
│   │   │   ├── (painel)/      # Rotas protegidas do admin
│   │   │   └── login/         # Autenticação
│   │   ├── api/               # API Routes
│   │   ├── layout.tsx         # Layout raiz
│   │   └── globals.css        # Estilos globais
│   ├── components/
│   │   ├── admin/             # Componentes do painel admin
│   │   ├── layout/            # Navbar, Footer, etc.
│   │   ├── public/            # Componentes do site público
│   │   └── ui/                # Componentes UI (shadcn)
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilitários e helpers
│   ├── server/
│   │   ├── actions/           # Server Actions
│   │   ├── repositories/      # Acesso ao banco de dados
│   │   └── services/          # Lógica de negócio
│   └── types/                 # Tipos TypeScript globais
├── auth.ts                    # Configuração NextAuth
├── auth.config.ts             # Providers e callbacks
├── middleware.ts              # Proteção de rotas
├── next.config.ts             # Configuração Next.js
└── tsconfig.json              # Configuração TypeScript
```

---

## Rotas Públicas

Todas as rotas do grupo `(public)` são acessíveis sem autenticação.

| Rota | Descrição |
|------|-----------|
| `/` | Home — hero, banners, aluno em destaque, notícias, projetos, parceiros |
| `/noticias` | Listagem de notícias com busca |
| `/noticias/[slug]` | Detalhes da notícia com comentários |
| `/eventos` | Agenda de eventos (abre modal com detalhes ao clicar) |
| `/cursos` | Listagem de cursos |
| `/cursos/[slug]` | Detalhes do curso |
| `/galeria` | Álbuns de fotos |
| `/galeria/[slug]` | Fotos do álbum |
| `/projetos` | Projetos sociais (abre modal ao clicar) |
| `/projetos/[slug]` | Detalhes do projeto |
| `/parceiros` | Grade de parceiros |
| `/patrocinadores` | Grade de patrocinadores |
| `/instituicao/historia` | História da instituição |
| `/instituicao/estrutura` | Estrutura organizacional |
| `/instituicao/equipe` | Equipe / membros |
| `/instituicao/membros/[slug]` | Membros por categoria |
| `/instituicao/aniversariantes` | Aniversariantes |
| `/alunos-destaque` | Galeria de alunos em destaque |
| `/contato` | Formulário de contato |
| `/privacidade` | Política de privacidade |
| `/termos` | Termos de uso |

---

## Rotas Administrativas

Todas as rotas `/admin/*` exigem autenticação. O grupo `(painel)` contém o layout com sidebar.

### Autenticação
| Rota | Descrição |
|------|-----------|
| `/admin/login` | Login (email/senha) |
| `/admin/login/esqueci-senha` | Solicitar redefinição de senha |
| `/admin/login/redefinir-senha` | Redefinir senha via token |

### Dashboard e Sistema
| Rota | Descrição |
|------|-----------|
| `/admin` | Dashboard com estatísticas e atividade recente |
| `/admin/audit` | Log de ações administrativas |
| `/admin/settings` | Configurações do site |
| `/admin/users` | Gerenciamento de usuários admin |
| `/admin/users/new` | Criar usuário admin |
| `/admin/users/[id]/edit` | Editar usuário admin |

### Conteúdo
| Rota | Descrição |
|------|-----------|
| `/admin/posts` | Listagem de notícias |
| `/admin/posts/new` | Nova notícia |
| `/admin/posts/[id]/edit` | Editar notícia |
| `/admin/banners` | Gerenciar banners (home, parceiros, patrocinadores) |
| `/admin/banners/new` | Novo banner |
| `/admin/banners/[id]/edit` | Editar banner |
| `/admin/events` | Gerenciar eventos |
| `/admin/events/new` | Novo evento |
| `/admin/events/[id]/edit` | Editar evento |
| `/admin/courses` | Gerenciar cursos |
| `/admin/courses/new` | Novo curso |
| `/admin/courses/[id]/edit` | Editar curso |
| `/admin/gallery` | Gerenciar álbuns de galeria |
| `/admin/gallery/new` | Novo álbum |
| `/admin/gallery/[id]/edit` | Editar álbum e fotos |

### Institucional
| Rota | Descrição |
|------|-----------|
| `/admin/institution` | Visão geral institucional |
| `/admin/institution/history` | Editar história/missão/visão |
| `/admin/institution/team` | Equipe / membros |
| `/admin/institution/team/new` | Novo membro |
| `/admin/institution/team/[id]/edit` | Editar membro |
| `/admin/institution/team/categories` | Categorias de membros |
| `/admin/institution/structure` | Estrutura organizacional |
| `/admin/institution/structure/new` | Nova entrada |
| `/admin/institution/structure/[id]/edit` | Editar entrada |
| `/admin/institution/projects` | Projetos sociais |
| `/admin/institution/projects/new` | Novo projeto |
| `/admin/institution/projects/[id]/edit` | Editar projeto |

### Pessoas
| Rota | Descrição |
|------|-----------|
| `/admin/birthdays` | Aniversariantes |
| `/admin/birthdays/new` | Novo aniversariante |
| `/admin/birthdays/[id]/edit` | Editar aniversariante |
| `/admin/featured-student` | Alunos em destaque |
| `/admin/featured-student/new` | Novo aluno em destaque |
| `/admin/featured-student/[id]/edit` | Editar aluno em destaque |
| `/admin/students` | Alunos (monitoramento escolar) |
| `/admin/students/new` | Cadastrar aluno |

---

## API Routes

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/[...nextauth]` | GET, POST | Handlers NextAuth (sessão, signin, signout) |
| `/api/auth/forgot-password` | POST | Solicita email de redefinição de senha |
| `/api/auth/reset-password` | POST | Confirma redefinição com token |
| `/api/upload` | POST | Upload de arquivos via UploadThing |
| `/api/instagram/feed` | GET | Retorna feed do Instagram (cache 1h) |

---

## Autenticação

O projeto usa **NextAuth v5** com estratégia de sessão **JWT**.

### Providers

**1. Credentials (email + senha)**
- Senha armazenada com hash `bcryptjs`
- Rate limiting: 5 tentativas a cada 15 minutos por IP
- Bloqueio automático após exceder limite

**2. Google OAuth**
- Requer `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
- Usuário precisa existir no banco para fazer login

### Fluxo de Reset de Senha

```
1. POST /api/auth/forgot-password
   → Gera token único + expira em 1h
   → Envia email com link de reset

2. POST /api/auth/reset-password
   → Valida token e expiração
   → Atualiza senha com novo hash bcryptjs
   → Invalida token
```

### Roles de Usuário

| Role | Permissões |
|------|-----------|
| `ADMIN` | Acesso total — incluindo usuários e configurações |
| `EDITOR` | Criar e editar conteúdo |
| `VIEWER` | Somente visualização |

### Proteção de Rotas

O `middleware.ts` intercepta todas as requisições e redireciona para `/admin/login` quando o usuário não está autenticado ao acessar qualquer rota `/admin/*`.

---

## Upload de Arquivos

O upload é feito via **UploadThing**, compatível com Vercel (sem necessidade de armazenamento local em produção).

- **Configuração:** `src/lib/uploadthing.ts` e `src/app/api/upload/route.ts`
- **Domínios permitidos** no `next.config.ts`: `utfs.io`, `ufs.sh`, `uploadthing.com`
- **Limite de tamanho** (Server Actions): 50MB
- **Tipos aceitos:** JPG, PNG, WebP

Em desenvolvimento, uploads locais são salvos em `public/uploads/`.

---

## Schema do Banco de Dados

### Modelos principais

#### `User` — Usuários administrativos
```prisma
id, name, email (unique), password (hash), role (ADMIN|EDITOR|VIEWER),
image, createdAt, resetToken, resetTokenExpiry
```

#### `SiteSettings` — Configurações globais do site
```prisma
id, siteName, cnpj, legalName, description, contactPhone, contactEmail,
businessHours, address, logoUrl, instagramUrl, facebookUrl, youtubeUrl,
impactedYouth, yearsOfHistory, updatedAt
```

#### `Banner` — Banners promocionais
```prisma
id, title, description, imageUrl, link, order, active,
type (HOME|PARTNER|SPONSOR), createdAt, updatedAt
```

#### `Post` — Notícias e conteúdo editorial
```prisma
id, title, slug (unique), content (Text), summary (Text), coverImage,
published, type (NEWS|EVENT|ACTIVITY|PROJECT), featured,
objective (Text), targetAudience (Text), impact (Text),
createdAt, updatedAt
→ Comment[]
```

#### `Event` — Agenda de eventos
```prisma
id, title, description (Text), date, location, bannerUrl, createdAt, updatedAt
```

#### `Course` — Cursos oferecidos
```prisma
id, title, slug (unique), description (Text), content (Text),
coverImage, duration, targetAge, sponsorName, sponsorLogo,
active, featured, createdAt, updatedAt
```

#### `Gallery` + `GalleryImage` — Galeria de fotos
```prisma
Gallery: id, title, slug (unique), coverUrl, createdAt → GalleryImage[]
GalleryImage: id, url, galleryId
```

#### `TeamMember` — Membros da equipe
```prisma
id, name, role, category, image, bio, birthDate, instagram,
email, order, active, createdAt, updatedAt
```

#### `MemberCategory` — Categorias de membros
```prisma
id, name (unique), slug (unique), order, active, createdAt, updatedAt
```

#### `Birthday` — Aniversariantes
```prisma
id (UUID), name, role, date, photoUrl, active, createdAt, updatedAt
```

#### `FeaturedStudent` — Aluno em destaque
```prisma
id, studentName, photoUrl, achievement, description, class, month, year, active, createdAt
```

#### `Student` — Alunos (monitoramento)
```prisma
id, name, matricula (unique), password (hash), birthDate, cpf, phone,
address, photoUrl, schoolName, schoolGrade, shift, active, createdAt, updatedAt
→ SchoolReport[], Attendance[]
```

#### `SchoolReport` + `SubjectGrade` — Boletim escolar
```prisma
SchoolReport: id, term, year, average, status (VERDE|AMARELO|VERMELHO), studentId
SubjectGrade: id, subject, grade, reportId
```

#### `InstitutionHistory` — Conteúdo institucional
```prisma
id, title, content (Text), mission (Text), vision (Text), values (Text),
principles (Text), updatedAt
```

#### `OrganizationalStructure` — Estrutura organizacional
```prisma
id, title, description (Text), content (Text), chartImage, order, createdAt, updatedAt
```

#### `Partner` — Parceiros
```prisma
id, name, logoUrl, website, active
```

#### `ContactMessage` — Mensagens de contato
```prisma
id, name, email, subject, message (Text), read, createdAt
```

#### `AuditLog` — Log de ações admin
```prisma
id, action, resource, details, createdAt, userId → User
```

#### `InstagramSettings` — Integração Instagram
```prisma
id, accessToken, username, enabled, updatedAt
```

---

## Camadas da Aplicação

### Server Actions (`src/server/actions/`)

Ponto de entrada para todas as mutações. Cada arquivo exporta funções assíncronas com `"use server"`.

| Arquivo | Responsabilidade |
|---------|-----------------|
| `posts.ts` | CRUD de notícias |
| `banners.ts` | CRUD de banners |
| `courses.ts` | CRUD de cursos |
| `events.ts` | CRUD de eventos |
| `gallery.ts` | CRUD de álbuns e fotos, atualização de título |
| `birthdays.ts` | CRUD de aniversariantes |
| `team.ts` | CRUD de membros da equipe |
| `memberCategories.ts` | CRUD de categorias de membros |
| `structure.ts` | CRUD de estrutura organizacional |
| `institution.ts` | Atualização de dados institucionais |
| `projects.ts` | CRUD de projetos sociais |
| `partners.ts` | CRUD de parceiros |
| `featured-student.ts` | CRUD de alunos em destaque |
| `students.ts` | Cadastro e boletim de alunos |
| `users.ts` | CRUD de usuários admin |
| `board.ts` | CRUD de membros da diretoria |
| `settings.ts` | Atualização de configurações do site |
| `contact.ts` | Armazenar mensagens de contato |
| `comments.ts` | Adicionar comentários em posts |
| `instagram.ts` | Configurar integração Instagram |

### Services (`src/server/services/`)

Contêm a lógica de negócio: validação, transformação de dados e regras de domínio.

**Exemplos de regras implementadas nos services:**
- `gallery.service.ts` — bloqueia exclusão de álbum que ainda contém fotos
- `posts.service.ts` — gera slug único a partir do título
- `birthdays.service.ts` — normaliza data para evitar offset de fuso horário
- `users.service.ts` — aplica hash bcryptjs na senha antes de salvar

### Repositories (`src/server/repositories/`)

Acesso direto ao Prisma. Cada repositório possui funções atômicas de query.

```typescript
// Padrão típico de um repository
export async function findEntityById(id: string) {
  return prisma.entity.findUnique({ where: { id } })
}
export async function createEntityRecord(data: {...}) {
  return prisma.entity.create({ data })
}
export async function updateEntityRecord(id: string, data: object) {
  return prisma.entity.update({ where: { id }, data })
}
export async function deleteEntityRecord(id: string) {
  return prisma.entity.delete({ where: { id } })
}
```

---

## Componentes Principais

### Layout Público
- **`Navbar.tsx`** — Navegação responsiva com dropdown de submenus e menu mobile; esconde ao rolar para baixo
- **`Footer.tsx`** — Footer com feed do Instagram, navegação, contatos, horários e mapa
- **`PageHero.tsx`** — Hero padronizado reutilizável em todas as páginas públicas

### Home (`src/components/public/home/`)
- **`HeroCarousel.tsx`** — Carrossel principal com banners do tipo `HOME`
- **`InfoCards.tsx`** — Cards de missão, próximo evento (link para /eventos) e última notícia
- **`FeaturedStudentSection.tsx`** — Aluno do mês em destaque
- **`BirthdaysSection.tsx`** — Aniversariantes do mês
- **`InstagramFeed.tsx`** — Feed do Instagram via Graph API
- **`PartnersAutoCarousel.tsx`** — Carrossel automático de parceiros/patrocinadores

### Grids com Modal (Client Components)
- **`projetos-grid.tsx`** — Lista projetos; clique abre modal com objetivo, público, impacto e conteúdo
- **`eventos-grid.tsx`** — Lista eventos; clique abre modal com data, local e descrição completa
- **`team-grid.tsx`** — Exibe membros; clique abre modal com bio e detalhes

### Admin
- **`BirthdayForm.tsx`** — Formulário com guard `useRef` para evitar double-submit
- **`GalleryTitleForm.tsx`** — Edição inline do nome do álbum com ícone de lápis
- **`RichTextEditor.tsx`** — Wrapper do TipTap com suporte a imagens, links e YouTube
- **`PageLayout.tsx`** — Layout padrão de páginas admin com header, breadcrumb e conteúdo
- **`FeedbackModal.tsx`** — Modal de feedback (sucesso/erro) unificado
- **`DeleteButton.tsx`** — Botão de exclusão genérico com confirmação

---

## Funcionalidades

### Site Público
- Hero carousel com banners gerenciados no admin
- Aluno em destaque do mês
- Aniversariantes do mês
- Feed do Instagram integrado
- Carrossel automático de parceiros e patrocinadores
- Notícias com busca por texto e paginação
- Comentários em notícias
- Botões de compartilhamento nas notícias
- Cursos com página de detalhes
- Eventos com modal de detalhes (sem RSVP)
- Projetos sociais com modal (objetivo, público-alvo, impacto)
- Galeria de fotos por álbum com lightbox
- Estrutura organizacional
- Equipe por categorias
- Página de patrocinadores
- Página de parceiros
- Formulário de contato

### Painel Administrativo
- Dashboard com métricas e log de atividade recente
- Gestão completa de conteúdo (CRUD)
- Editor de texto rico com suporte a imagens e vídeos YouTube
- Upload de imagens via UploadThing
- Banners por tipo (Home, Parceiro, Patrocinador)
- Toggle de destaque (hero) para cursos e projetos
- Gestão de membros com categorias personalizadas
- Galeria: bloqueia exclusão de álbum com fotos; edição do título inline
- Log de auditoria de todas as ações admin
- Gerenciamento de usuários com roles
- Recuperação de senha por email
- Logout automático por inatividade
- Integração com Instagram (token de acesso)
- Configurações globais do site (nome, logo, contato, redes sociais)

### Monitoramento de Alunos
- Cadastro de alunos com dados escolares
- Lançamento de boletins por período letivo
- Notas por disciplina
- Status automático (VERDE/AMARELO/VERMELHO) baseado na média
- Controle de frequência nos treinos

---

## Deploy

O projeto é otimizado para deploy na **Vercel** com banco de dados **Supabase**.

### Vercel

1. Conecte o repositório GitHub na Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. O build executa automaticamente:
   ```bash
   prisma generate && next build
   ```

### Variáveis obrigatórias em produção

```
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
UPLOADTHING_TOKEN
```

### Domínios de imagem

O `next.config.ts` já está configurado para aceitar imagens dos domínios do UploadThing:
- `utfs.io`
- `ufs.sh`
- `uploadthing.com`

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de dev (http://localhost:3000)

# Produção
npm run build        # Gera Prisma client e build Next.js
npm run start        # Inicia servidor de produção

# Qualidade
npm run lint         # Executa ESLint

# Banco de dados
npx prisma studio    # Interface visual do banco
npx prisma db push   # Sincroniza schema com o banco
npx prisma generate  # Regenera o Prisma Client
npx prisma db seed   # Popula banco com dados iniciais

# Verificação de tipos
npx tsc --noEmit     # Checa erros TypeScript sem gerar arquivos
```

---

## Licença

Projeto desenvolvido por **Adilton Andre** para a Polícia Militar Mirim de Presidente Médici/RO.

- WhatsApp: [+55 69 9997-2514](https://wa.me/5569999772514)
- Instagram: [@adiltonandremcs](https://instagram.com/adiltonandremcs)
- LinkedIn: [adiltonandre](https://linkedin.com/in/adiltonandre)
- GitHub: [adiltonandre](https://github.com/adiltonandre)
