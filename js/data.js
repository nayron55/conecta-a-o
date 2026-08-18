export const ACTIVITY_TYPES = ['Curso', 'Oficina', 'Evento', 'Voluntariado', 'Projeto'];
export const AUDIENCES = ['Crianças', 'Jovens', 'Adultos', 'Famílias', 'Comunidade'];
export const ICONS = { Curso: '📚', Oficina: '🛠️', Evento: '🎉', Voluntariado: '🤝', Projeto: '🌱' };

export const INITIAL_STATE = {
  organization: {
    name: 'Conecta Ação',
    headline: 'Conectando pessoas a ações que transformam a comunidade.',
    summary: 'Encontre cursos, oficinas, projetos e eventos em um só lugar.',
    about: 'Somos uma organização social que aproxima pessoas de oportunidades de aprendizagem, cidadania, cultura e apoio comunitário.',
    mission: 'Ampliar o acesso às ações sociais e educativas por meio de informação clara, acolhedora e acessível.',
    whatsapp: '5544999999999',
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    address: 'Av. Exemplo, 1200 — Maringá/PR'
  },
  admin: { email: 'organizacao@conectaacao.org', password: 'conecta2026' },
  activities: [
    { id: 'a1', type: 'Oficina', title: 'Oficina de Inclusão Digital', description: 'Aprenda a usar e-mail, aplicativos públicos e recursos do celular com mais segurança.', date: '2026-09-20', time: '14h às 16h', location: 'Centro Comunitário', audience: 'Adultos', spots: '20 vagas' },
    { id: 'a2', type: 'Oficina', title: 'Arte e Expressão', description: 'Um espaço criativo para crianças explorarem desenho, pintura e novas formas de expressão.', date: '2026-09-27', time: '9h às 11h', location: 'Sala Multiuso', audience: 'Crianças', spots: '15 vagas' },
    { id: 'a3', type: 'Curso', title: 'Currículo e Empregabilidade', description: 'Prepare seu currículo e desenvolva confiança para procurar novas oportunidades de trabalho.', date: '2026-10-05', time: '19h às 21h', location: 'Laboratório de Informática', audience: 'Jovens', spots: '25 vagas' },
    { id: 'a4', type: 'Voluntariado', title: 'Mutirão Solidário', description: 'Participe da organização de doações e da preparação de kits para famílias da região.', date: '2026-10-12', time: '8h às 12h', location: 'Sede da Organização', audience: 'Comunidade', spots: '30 vagas' },
    { id: 'a5', type: 'Evento', title: 'Cinema na Praça', description: 'Sessão gratuita de cinema ao ar livre com atividades para toda a família.', date: '2026-10-26', time: '18h às 21h', location: 'Praça Central', audience: 'Famílias', spots: 'Evento aberto' },
    { id: 'a6', type: 'Projeto', title: 'Horta Comunitária', description: 'Cultive alimentos, troque saberes e ajude a cuidar de um espaço verde coletivo.', date: '2026-11-09', time: '8h às 10h', location: 'Horta do Bairro', audience: 'Comunidade', spots: '18 vagas' }
  ],
  registrations: [],
  messages: []
};