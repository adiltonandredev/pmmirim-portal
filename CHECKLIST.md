# ✅ CHECKLIST DE IMPLEMENTAÇÃO - PMMIRIM Portal

## 📋 Use este arquivo para acompanhar o progresso

---

## FASE 1: CONFIGURAÇÃO INICIAL ✅

- [x] Schema Prisma atualizado
- [x] Componentes criados
- [x] Páginas públicas criadas
- [x] Documentação criada
- [ ] Banco de dados migrado
- [ ] Seed executado (opcional)
- [ ] Servidor testado

### Comandos da Fase 1:

```powershell
# 1. Migrar banco
npx prisma db push
npx prisma generate

# 2. (Opcional) Popular dados de exemplo
npx tsx prisma/seed-features.ts

# 3. Iniciar servidor
npm run dev
```

### ✅ Verificação:
- [ ] Servidor inicia sem erros
- [ ] http://localhost:3000 carrega
- [ ] Menu "A Instituição" aparece
- [ ] Menu "Cursos" aparece
- [ ] Menu "Parceiros" aparece

---

## FASE 2: TESTAR PÁGINAS PÚBLICAS

### Páginas da Instituição
- [ ] http://localhost:3000/instituicao/historia
- [ ] http://localhost:3000/instituicao/estrutura
- [ ] http://localhost:3000/instituicao/diretoria

### Cursos
- [ ] http://localhost:3000/cursos (lista)
- [ ] http://localhost:3000/cursos/formacao-basica (detalhe)

### Parceiros
- [ ] http://localhost:3000/parceiros

### Home Page
- [ ] Carousel de parceiros aparece (se tiver parceiros)
- [ ] Aniversariantes do mês aparecem (se tiver no mês atual)
- [ ] Aluno destaque aparece (se tiver do mês atual)
- [ ] Instagram feed (se configurado)

---

## FASE 3: IMPLEMENTAR ADMIN (Pendente)

### 3.1 Gerenciamento da Instituição

#### História da Instituição
- [ ] Criar `/admin/institution/history/page.tsx`
- [ ] Form com campos: title, content, mission, vision, values, principles
- [ ] Usar `RichTextEditor` para campos HTML
- [ ] Server action: `updateInstitutionHistory`
- [ ] Testar edição e salvamento

#### Estrutura Organizacional
- [ ] Criar `/admin/institution/structure/page.tsx` (lista)
- [ ] Criar `/admin/institution/structure/new/page.tsx`
- [ ] Criar `/admin/institution/structure/[id]/edit/page.tsx`
- [ ] Upload de imagem para organograma
- [ ] Server actions: create, update, delete
- [ ] Ordenação (campo `order`)
- [ ] Testar CRUD completo

### 3.2 Gerenciamento de Diretoria

- [ ] Criar `/admin/board/page.tsx` (lista com tabela)
- [ ] Criar `/admin/board/new/page.tsx`
- [ ] Criar `/admin/board/[id]/edit/page.tsx`
- [ ] Upload de foto
- [ ] Campos: name, position, bio, email, phone, order
- [ ] Toggle active/inactive
- [ ] Server actions: create, update, delete
- [ ] Testar CRUD completo

### 3.3 Gerenciamento de Cursos

- [ ] Criar `/admin/courses/page.tsx` (lista)
- [ ] Criar `/admin/courses/new/page.tsx`
- [ ] Criar `/admin/courses/[id]/edit/page.tsx`
- [ ] Geração automática de slug
- [ ] Upload de imagem de capa
- [ ] RichTextEditor para content e schedule
- [ ] Checkbox "featured"
- [ ] Server actions: create, update, delete
- [ ] Testar CRUD completo

### 3.4 Gerenciamento de Aniversariantes

- [ ] Criar `/admin/birthdays/page.tsx` (lista com filtro por mês)
- [ ] Criar `/admin/birthdays/new/page.tsx`
- [ ] Criar `/admin/birthdays/[id]/edit/page.tsx`
- [ ] Upload de foto (opcional)
- [ ] Date picker para birthDate
- [ ] Input para class
- [ ] Server actions: create, update, delete
- [ ] Testar CRUD completo

### 3.5 Gerenciamento de Aluno Destaque

- [ ] Criar `/admin/featured-student/page.tsx` (lista por mês/ano)
- [ ] Criar `/admin/featured-student/new/page.tsx`
- [ ] Criar `/admin/featured-student/[id]/edit/page.tsx`
- [ ] Upload de foto
- [ ] Selects para month e year
- [ ] Validação: apenas 1 ativo por mês
- [ ] Server actions: create, update, delete
- [ ] Testar CRUD completo

### 3.6 Configurações do Instagram

- [ ] Atualizar `/admin/settings/page.tsx`
- [ ] Adicionar seção "Instagram"
- [ ] Campos: accessToken, username, enabled
- [ ] Input type="password" para token
- [ ] Switch para enabled
- [ ] Link para documentação da API
- [ ] Server action: updateInstagramSettings
- [ ] Testar salvamento

---

## FASE 4: SERVER ACTIONS

Criar em `src/app/actions/`:

### institution.ts
- [ ] `updateInstitutionHistory()`
- [ ] `createOrganizationalStructure()`
- [ ] `updateOrganizationalStructure()`
- [ ] `deleteOrganizationalStructure()`
- [ ] Validação com Zod
- [ ] Autenticação necessária

### board.ts
- [ ] `createBoardMember()`
- [ ] `updateBoardMember()`
- [ ] `deleteBoardMember()`
- [ ] `toggleBoardMemberActive()`
- [ ] Validação com Zod

### courses.ts
- [ ] `createCourse()`
- [ ] `updateCourse()`
- [ ] `deleteCourse()`
- [ ] Geração automática de slug
- [ ] Validação com Zod

### birthdays.ts
- [ ] `createBirthday()`
- [ ] `updateBirthday()`
- [ ] `deleteBirthday()`
- [ ] Validação de data

### featuredStudent.ts
- [ ] `createFeaturedStudent()`
- [ ] `updateFeaturedStudent()`
- [ ] `deleteFeaturedStudent()`
- [ ] Validação: 1 por mês/ano

### instagram.ts
- [ ] `updateInstagramSettings()`
- [ ] Validação de token (opcional)

---

## FASE 5: VALIDAÇÕES ZOD

Criar em `src/lib/validations.ts`:

- [ ] `institutionHistorySchema`
- [ ] `organizationalStructureSchema`
- [ ] `boardMemberSchema`
- [ ] `courseSchema`
- [ ] `birthdaySchema`
- [ ] `featuredStudentSchema`
- [ ] `instagramSettingsSchema`

---

## FASE 6: TESTES

### Testes Manuais
- [ ] Criar conteúdo em cada módulo
- [ ] Editar conteúdo existente
- [ ] Deletar conteúdo
- [ ] Upload de imagens
- [ ] Verificar páginas públicas
- [ ] Testar responsividade (mobile/tablet/desktop)

### Testes de Integração
- [ ] Aniversariantes aparecem apenas no mês correto
- [ ] Aluno destaque aparece apenas no mês/ano correto
- [ ] Feed Instagram carrega corretamente
- [ ] Carousel de parceiros funciona
- [ ] Slugs únicos para cursos

### Testes de Segurança
- [ ] Apenas usuários logados acessam admin
- [ ] Token Instagram não exposto no frontend
- [ ] Upload de imagens valida tipo/tamanho
- [ ] SQL injection prevenido (Prisma)
- [ ] XSS prevenido (sanitização HTML)

---

## FASE 7: CONTEÚDO REAL

### Popular com Dados Reais
- [ ] História da instituição completa
- [ ] Missão, visão, valores atualizados
- [ ] Estrutura organizacional com organograma
- [ ] Fotos e informações da diretoria
- [ ] Cursos detalhados
- [ ] Aniversariantes do mês
- [ ] Aluno destaque com foto
- [ ] Parceiros com logos
- [ ] Configurar Instagram (se desejado)

---

## FASE 8: OTIMIZAÇÕES

### Performance
- [ ] Otimizar imagens (Next Image)
- [ ] Lazy loading onde apropriado
- [ ] Cache de queries
- [ ] Minificar CSS/JS

### SEO
- [ ] Metadata em todas as páginas
- [ ] Open Graph tags
- [ ] Sitemap.xml atualizado
- [ ] robots.txt

### UX
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Breadcrumbs
- [ ] Confirmação antes de deletar

---

## FASE 9: DEPLOY

### Pré-Deploy
- [ ] Backup do banco de produção
- [ ] Testar em ambiente staging
- [ ] Revisar variáveis de ambiente
- [ ] Verificar logs

### Deploy
- [ ] Aplicar migrations em produção
- [ ] Build e deploy
- [ ] Verificar funcionamento
- [ ] Monitorar erros

### Pós-Deploy
- [ ] Popular conteúdo real
- [ ] Testar todas as funcionalidades
- [ ] Configurar Instagram
- [ ] Treinar usuários admin

---

## 📊 PROGRESSO GERAL

- [x] Backend (Schema) - 100%
- [x] Páginas Públicas - 100%
- [x] Componentes - 100%
- [ ] Admin - 0%
- [ ] Server Actions - 0%
- [ ] Testes - 0%
- [ ] Conteúdo Real - 0%
- [ ] Deploy - 0%

**Estimativa de conclusão:** 8-12 horas para admin completo

---

## 📚 RECURSOS

- `INICIO_RAPIDO.md` - Guia rápido para começar
- `RESUMO_IMPLEMENTACAO.md` - Visão geral do projeto
- `NOVAS_FUNCIONALIDADES.md` - Documentação técnica completa
- `MIGRACAO_BANCO.md` - Guia de migração do banco

---

## 🆘 SUPORTE

**Dúvidas?**
1. Consulte a documentação
2. Verifique código existente em `/admin/posts`
3. Use Prisma Studio para debugar banco

**Problemas?**
- Ver `MIGRACAO_BANCO.md` seção "Troubleshooting"
- Verificar console do navegador (F12)
- Verificar logs do servidor

---

**Última atualização:** 06/01/2026  
**Progresso:** Fundação completa, Admin pendente
