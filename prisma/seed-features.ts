import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed para popular dados de exemplo das novas funcionalidades
 * Execute: npx tsx prisma/seed-features.ts
 */
async function main() {
  console.log('🌱 Iniciando seed das novas funcionalidades...\n');

  // 1. História da Instituição
  console.log('📖 Criando história da instituição...');
  const history = await prisma.institutionHistory.upsert({
    where: { id: 'default-history' },
    update: {},
    create: {
      id: 'default-history',
      title: 'A Polícia Militar Mirim',
      content: `
        <h2>Nossa História</h2>
        <p>A Polícia Militar Mirim foi fundada em 2010 com o objetivo de formar cidadãos conscientes, disciplinados e preparados para contribuir positivamente com a sociedade.</p>
        
        <p>Ao longo dos anos, desenvolvemos programas educacionais que combinam formação cívica, atividades físicas, e desenvolvimento de valores essenciais para a construção de uma sociedade mais justa e harmoniosa.</p>
        
        <h3>Nosso Impacto</h3>
        <p>Desde nossa fundação, já atendemos mais de 500 jovens, realizamos centenas de eventos comunitários e nos tornamos referência em educação cidadã na região.</p>
        
        <p>Nossa metodologia única combina disciplina militar adaptada para jovens com atividades pedagógicas inovadoras, criando um ambiente propício para o desenvolvimento integral de nossos alunos.</p>
      `,
      mission: 'Formar cidadãos conscientes, disciplinados e preparados para contribuir positivamente com a sociedade, através da educação cívica e desenvolvimento de valores éticos.',
      vision: 'Ser referência nacional em educação cidadã e formação de jovens líderes, inspirando transformação social através da disciplina, ética e comprometimento.',
      values: 'Disciplina, Respeito, Ética, Responsabilidade, Cidadania, Comprometimento, Integridade e Espírito de Equipe.',
      principles: 'Hierarquia, Disciplina, Honestidade, Lealdade, Respeito às leis, Ordem Unida e Espírito de Corpo.',
    },
  });
  console.log(`✅ História criada: ${history.title}\n`);

  // 2. Estrutura Organizacional
  console.log('🏢 Criando estruturas organizacionais...');
  
  const structure1 = await prisma.organizationalStructure.upsert({
    where: { id: 'structure-hierarchy' },
    update: {},
    create: {
      id: 'structure-hierarchy',
      title: 'Hierarquia Administrativa',
      description: 'Organização da estrutura de comando e gestão da PMMIRIM',
      content: `
        <h3>Estrutura de Comando</h3>
        <p>Nossa instituição segue uma hierarquia clara e bem definida, garantindo eficiência na gestão e no desenvolvimento das atividades:</p>
        
        <ul>
          <li><strong>Diretoria Geral:</strong> Responsável pela gestão estratégica e representação institucional</li>
          <li><strong>Coordenação Pedagógica:</strong> Desenvolvimento de programas educacionais e acompanhamento pedagógico</li>
          <li><strong>Coordenação Operacional:</strong> Gestão das atividades práticas e eventos</li>
          <li><strong>Corpo Instrutorial:</strong> Instrutores qualificados em diversas áreas de conhecimento</li>
          <li><strong>Equipe de Apoio:</strong> Suporte administrativo e logístico</li>
        </ul>
      `,
      order: 0,
    },
  });

  const structure2 = await prisma.organizationalStructure.upsert({
    where: { id: 'structure-pedagogical' },
    update: {},
    create: {
      id: 'structure-pedagogical',
      title: 'Estrutura Pedagógica',
      description: 'Organização das atividades educacionais e formativas',
      content: `
        <h3>Departamentos Pedagógicos</h3>
        <p>Nossa estrutura pedagógica é dividida em departamentos especializados:</p>
        
        <ul>
          <li><strong>Formação Cívica:</strong> Cidadania, direitos e deveres, educação moral</li>
          <li><strong>Educação Física:</strong> Desenvolvimento físico, esportes e atividades recreativas</li>
          <li><strong>Ordem Unida:</strong> Disciplina, coordenação motora e trabalho em equipe</li>
          <li><strong>Primeiros Socorros:</strong> Noções básicas de atendimento emergencial</li>
          <li><strong>Meio Ambiente:</strong> Educação ambiental e sustentabilidade</li>
        </ul>
      `,
      order: 1,
    },
  });
  
  console.log(`✅ ${structure1.title}`);
  console.log(`✅ ${structure2.title}\n`);

  // 3. Membros da Diretoria
  console.log('👥 Criando membros da diretoria...');
  
  const members = await Promise.all([
    prisma.boardMember.create({
      data: {
        name: 'Coronel João Silva',
        position: 'Diretor Geral',
        bio: 'Militar da reserva com 30 anos de experiência na Polícia Militar. Especialista em formação de jovens e educação cidadã.',
        email: 'diretor@pmmirim.org.br',
        phone: '(11) 98765-4321',
        order: 0,
        active: true,
      },
    }),
    prisma.boardMember.create({
      data: {
        name: 'Maria Santos',
        position: 'Coordenadora Pedagógica',
        bio: 'Pedagoga com mestrado em Educação. 15 anos de experiência em coordenação pedagógica e desenvolvimento de projetos educacionais.',
        email: 'pedagogica@pmmirim.org.br',
        phone: '(11) 98765-4322',
        order: 1,
        active: true,
      },
    }),
    prisma.boardMember.create({
      data: {
        name: 'Sargento Pedro Oliveira',
        position: 'Coordenador Operacional',
        bio: 'Sargento da ativa com especialização em instrução e formação. Responsável pela coordenação das atividades práticas e eventos.',
        email: 'operacional@pmmirim.org.br',
        order: 2,
        active: true,
      },
    }),
  ]);
  
  members.forEach(m => console.log(`✅ ${m.name} - ${m.position}`));
  console.log('');

  // 4. Cursos
  console.log('📚 Criando cursos...');
  
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'Formação Básica',
        slug: 'formacao-basica',
        description: 'Curso introdutório de cidadania e disciplina para jovens de 10 a 14 anos. Primeira etapa na formação do jovem cadete.',
        content: `
          <h3>Sobre o Curso</h3>
          <p>O curso de Formação Básica é o primeiro passo na jornada do jovem na PMMIRIM. Durante 6 meses, os alunos são introduzidos aos conceitos fundamentais de cidadania, disciplina e valores.</p>
          
          <h4>Conteúdo Programático:</h4>
          <ul>
            <li>Cidadania e Direitos Humanos</li>
            <li>Disciplina e Ordem Unida</li>
            <li>Educação Física e Recreação</li>
            <li>Primeiros Socorros Básicos</li>
            <li>Educação Ambiental</li>
            <li>Ética e Valores</li>
          </ul>
          
          <h4>Metodologia:</h4>
          <p>Aulas teóricas e práticas, atividades em grupo, exercícios físicos adaptados e eventos comunitários.</p>
        `,
        duration: '6 meses',
        targetAge: '10 a 14 anos',
        maxStudents: 30,
        schedule: '<p><strong>Sábados:</strong> 8h às 12h<br><strong>Local:</strong> Sede da PMMIRIM</p>',
        featured: true,
        active: true,
        order: 0,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Formação Avançada',
        slug: 'formacao-avancada',
        description: 'Curso de aprofundamento para alunos que completaram a Formação Básica. Foco em liderança e cidadania ativa.',
        content: `
          <h3>Sobre o Curso</h3>
          <p>Destinado aos alunos que concluíram a Formação Básica, este curso aprofunda os conhecimentos e desenvolve habilidades de liderança.</p>
          
          <h4>Conteúdo Programático:</h4>
          <ul>
            <li>Liderança e Trabalho em Equipe</li>
            <li>Cidadania Ativa e Participação Social</li>
            <li>Educação Física Avançada</li>
            <li>Primeiros Socorros Avançados</li>
            <li>Gestão de Projetos Comunitários</li>
            <li>Comunicação e Oratória</li>
          </ul>
        `,
        duration: '1 ano',
        targetAge: '12 a 16 anos',
        maxStudents: 25,
        schedule: '<p><strong>Sábados:</strong> 8h às 13h<br><strong>Quartas:</strong> 18h às 20h (opcional)</p>',
        featured: false,
        active: true,
        order: 1,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Educação Ambiental',
        slug: 'educacao-ambiental',
        description: 'Curso focado em sustentabilidade, preservação ambiental e consciência ecológica.',
        content: `
          <h3>Sobre o Curso</h3>
          <p>Curso complementar que desenvolve consciência ambiental e práticas sustentáveis nos jovens.</p>
          
          <h4>Atividades:</h4>
          <ul>
            <li>Visitas a parques e reservas ambientais</li>
            <li>Plantio de árvores</li>
            <li>Reciclagem e reaproveitamento</li>
            <li>Educação sobre biodiversidade</li>
            <li>Projetos de sustentabilidade</li>
          </ul>
        `,
        duration: '3 meses',
        targetAge: '10 a 16 anos',
        maxStudents: 20,
        schedule: '<p><strong>Domingos:</strong> 9h às 12h (mensal)</p>',
        featured: false,
        active: true,
        order: 2,
      },
    }),
  ]);
  
  courses.forEach(c => console.log(`✅ ${c.title}`));
  console.log('');

  // 5. Aniversariantes do Mês Atual
  console.log('🎂 Criando aniversariantes do mês...');
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const birthdays = await Promise.all([
    prisma.birthday.create({
      data: {
        studentName: 'Ana Carolina Silva',
        birthDate: new Date(2010, currentMonth, 5),
        class: 'Formação Básica - Turma A',
        active: true,
      },
    }),
    prisma.birthday.create({
      data: {
        studentName: 'Gabriel Santos',
        birthDate: new Date(2011, currentMonth, 12),
        class: 'Formação Básica - Turma B',
        active: true,
      },
    }),
    prisma.birthday.create({
      data: {
        studentName: 'Julia Oliveira',
        birthDate: new Date(2009, currentMonth, 18),
        class: 'Formação Avançada',
        active: true,
      },
    }),
    prisma.birthday.create({
      data: {
        studentName: 'Lucas Ferreira',
        birthDate: new Date(2012, currentMonth, 25),
        class: 'Formação Básica - Turma A',
        active: true,
      },
    }),
  ]);
  
  birthdays.forEach(b => console.log(`✅ ${b.studentName} - ${new Date(b.birthDate).toLocaleDateString('pt-BR')}`));
  console.log('');

  // 6. Aluno Destaque do Mês Atual
  console.log('⭐ Criando aluno destaque do mês...');
  const currentMonthNum = currentMonth + 1;
  
  const featuredStudent = await prisma.featuredStudent.create({
    data: {
      studentName: 'Pedro Henrique Costa',
      achievement: 'Melhor desempenho em atividades físicas e destaque em liderança',
      description: 'Pedro se destacou este mês por sua dedicação exemplar nas atividades físicas, sempre incentivando e ajudando os colegas. Demonstrou excelentes qualidades de liderança durante o exercício de ordem unida e foi escolhido pelos instrutores como monitor da turma.',
      class: 'Formação Avançada',
      month: currentMonthNum,
      year: currentYear,
      active: true,
    },
  });
  console.log(`✅ ${featuredStudent.studentName}\n`);

  // 7. Configurações do Instagram
  console.log('📱 Criando configurações do Instagram...');
  const instagram = await prisma.instagramSettings.upsert({
    where: { id: 'default-instagram' },
    update: {},
    create: {
      id: 'default-instagram',
      username: 'pmmirim',
      enabled: false, // Desabilitado por padrão até configurar token
    },
  });
  console.log(`✅ Instagram: @${instagram.username} (desabilitado até configurar token)\n`);

  console.log('✨ Seed concluído com sucesso!');
  console.log('\n📝 Próximos passos:');
  console.log('1. Acesse http://localhost:3000 para ver as páginas públicas');
  console.log('2. Acesse http://localhost:3000/admin para gerenciar o conteúdo');
  console.log('3. Para habilitar o Instagram, configure o token em /admin/settings');
  console.log('4. Para adicionar fotos, use o painel admin (em desenvolvimento)');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
