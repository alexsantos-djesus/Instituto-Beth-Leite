import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type PhotoSeed = { url: string; alt: string };
type AnimalSeed = {
  slug: string;
  nome: string;
  especie: "CACHORRO" | "GATO";
  sexo: "MACHO" | "FEMEA";
  porte: "PEQUENO" | "MEDIO" | "GRANDE";
  idadeMeses: number;
  vacinado: boolean;
  castrado: boolean;
  raca?: string | null;
  temperamento?: string | null;
  descricao: string;
  historiaResgate?: string | null;
  convivencia?: string | null;
  saudeDetalhes?: string | null;
  dataResgate?: Date | null;
  photos: PhotoSeed[];
};

async function run() {
  console.time("seed");

  await prisma.photo.deleteMany();
  await prisma.adoptionRequest.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.collectionPoint.deleteMany();
  await prisma.donationSettings.deleteMany();
  await prisma.event.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.user.deleteMany();

  const items: AnimalSeed[] = [
    {
      slug: "luna",
      nome: "Luna",
      especie: "GATO",
      sexo: "FEMEA",
      porte: "PEQUENO",
      idadeMeses: 10,
      vacinado: true,
      castrado: true,
      raca: "SRD",
      temperamento: "Dócil e curiosa",
      descricao: "Gatinha carinhosa, adora brincar com fitinhas e dormir ao sol.",
      historiaResgate:
        "A Luna foi encontrada em um quintal buscando abrigo da chuva. Estava magrinha, mas se recuperou rápido com alimentação e cuidados.",
      convivencia: [
        "Convive bem com outros gatos",
        "Gosta de colo e de janelas ensolaradas",
        "Prefere ambientes tranquilos",
      ].join("\n"),
      saudeDetalhes:
        "Vacinada e castrada. Sem medicações ativas. Alimentação úmida 1x/dia como agrado.",
      dataResgate: new Date("2025-03-12"),
      photos: [
        { url: "/animals/cat-1.jpg", alt: "Luna" },
        { url: "/animals/cat-2.jpg", alt: "Luna descansando" },
      ],
    },
    {
      slug: "thor",
      nome: "Thor",
      especie: "CACHORRO",
      sexo: "MACHO",
      porte: "GRANDE",
      idadeMeses: 24,
      vacinado: true,
      castrado: false,
      raca: "SRD",
      temperamento: "Energético e amigável",
      descricao:
        "Cheio de energia, ótimo para famílias ativas. Precisa de passeios diários.",
      historiaResgate:
        "Resgatado após perambular perto de uma pista movimentada. Muito sociável desde o primeiro contato.",
      convivencia: [
        "Adora brincadeiras de buscar a bolinha",
        "Convive bem com crianças maiores",
        "Pode conviver com outros cães após adaptação",
      ].join("\n"),
      saudeDetalhes:
        "Vermifugado e com vacinas atuais. Avaliação para castração já agendada.",
      dataResgate: new Date("2025-02-20"),
      photos: [
        { url: "/animals/dog-1.jpg", alt: "Thor" },
        { url: "/animals/dog-2.jpg", alt: "Thor correndo" },
      ],
    },
    {
      slug: "mel",
      nome: "Mel",
      especie: "CACHORRO",
      sexo: "FEMEA",
      porte: "MEDIO",
      idadeMeses: 18,
      vacinado: true,
      castrado: true,
      raca: "SRD",
      temperamento: "Calma e companheira",
      descricao:
        "Muito companheira, adora colo e cochilos. Ideal para apartamento.",
      historiaResgate:
        "Foi acolhida após o bairro se mobilizar para ajudá-la. Chegou tímida e hoje é puro carinho.",
      convivencia: [
        "Muito tranquila dentro de casa",
        "Se dá bem com outros cães calmos",
        "Aprende comandos com petiscos",
      ].join("\n"),
      saudeDetalhes:
        "Carteira de vacinação em dia. Banho a cada 15 dias e escovação semanal.",
      dataResgate: new Date("2025-04-09"),
      photos: [
        { url: "/animals/dog-3.jpg", alt: "Mel" },
        { url: "/animals/dog-4.jpg", alt: "Mel no sofá" },
      ],
    },
    {
      slug: "fred",
      nome: "Fred",
      especie: "GATO",
      sexo: "MACHO",
      porte: "PEQUENO",
      idadeMeses: 8,
      vacinado: false,
      castrado: false,
      raca: "SRD",
      temperamento: "Brincalhão",
      descricao: "Gatinho brincalhão, se dá bem com outros gatos.",
      historiaResgate:
        "Encontrado próximo a uma escola procurando comida. Muito esperto e curioso.",
      convivencia: [
        "Boa convivência com outros gatos jovens",
        "Gosta de varinhas e bolinhas",
        "Vai ao banheiro na caixinha sem erros",
      ].join("\n"),
      saudeDetalhes: "Agendamento de vacinação e castração em andamento.",
      dataResgate: new Date("2025-05-03"),
      photos: [
        { url: "/animals/cat-3.jpg", alt: "Fred" },
        { url: "/animals/cat-4.jpg", alt: "Fred brincando" },
      ],
    },
    {
      slug: "nina",
      nome: "Nina",
      especie: "CACHORRO",
      sexo: "FEMEA",
      porte: "PEQUENO",
      idadeMeses: 14,
      vacinado: true,
      castrado: true,
      raca: "SRD",
      temperamento: "Carinhosa",
      descricao: "Muito dócil, ótima com crianças.",
      historiaResgate:
        "Foi acolhida após perder a família. Busca um novo lar cheio de afeto.",
      convivencia: [
        "Excelente com crianças",
        "Curte passeios curtos",
        "Se adapta bem a apartamento",
      ].join("\n"),
      saudeDetalhes: "Sem medicações. Check-up recente normal.",
      dataResgate: new Date("2025-01-28"),
      photos: [{ url: "/animals/dog-2.jpg", alt: "Nina" }],
    },
    {
      slug: "bento",
      nome: "Bento",
      especie: "CACHORRO",
      sexo: "MACHO",
      porte: "MEDIO",
      idadeMeses: 30,
      vacinado: true,
      castrado: true,
      raca: "SRD",
      temperamento: "Protetor",
      descricao: "Esperto e atento, aprende comandos com facilidade.",
      historiaResgate:
        "Chegou com receio, mas evoluiu muito com reforço positivo.",
      convivencia: [
        "Indicado para tutores com alguma experiência",
        "Responde bem a rotina de exercícios",
        "Melhor como pet único no início",
      ].join("\n"),
      saudeDetalhes: "Vacinado, castrado e vermifugado. Sem restrições.",
      dataResgate: new Date("2024-12-15"),
      photos: [{ url: "/animals/dog-1.jpg", alt: "Bento" }],
    },
    {
      slug: "olivia",
      nome: "Olívia",
      especie: "GATO",
      sexo: "FEMEA",
      porte: "PEQUENO",
      idadeMeses: 36,
      vacinado: true,
      castrado: true,
      raca: "SRD",
      temperamento: "Independente",
      descricao: "Gosta de rotina e janelas ensolaradas.",
      historiaResgate:
        "Resgatada de um terreno baldio. Hoje adora observar a rua pela janela.",
      convivencia: [
        "Prefere ser filha única",
        "Gosta de arranhadores altos",
        "Não curte barulhos altos",
      ].join("\n"),
      saudeDetalhes:
        "Vacinas em dia. Escovação semanal ajuda a reduzir bolas de pelo.",
      dataResgate: new Date("2024-11-02"),
      photos: [{ url: "/animals/cat-2.jpg", alt: "Olívia observando" }],
    },
    {
      slug: "miguel",
      nome: "Miguel",
      especie: "CACHORRO",
      sexo: "MACHO",
      porte: "GRANDE",
      idadeMeses: 48,
      vacinado: false,
      castrado: false,
      raca: "SRD",
      temperamento: "Alegre",
      descricao: "Adora brincar de bola e passear no parque.",
      historiaResgate:
        "Resgatado por voluntários após denúncia. Muito carinhoso com quem confia.",
      convivencia: [
        "Precisa de espaço para gastar energia",
        "Melhor com rotina de exercícios",
        "Pode conviver com outros cães após adaptação",
      ].join("\n"),
      saudeDetalhes:
        "Vermifugação realizada. Agenda de vacinação iniciada.",
      dataResgate: new Date("2025-03-01"),
      photos: [{ url: "/animals/dog-4.jpg", alt: "Miguel sorridente" }],
    },
  ];

  for (const a of items) {
    await prisma.animal.create({
      data: {
        slug: a.slug,
        nome: a.nome,
        especie: a.especie,
        sexo: a.sexo,
        porte: a.porte,
        idadeMeses: a.idadeMeses,
        vacinado: a.vacinado,
        castrado: a.castrado,
        raca: a.raca ?? null,
        temperamento: a.temperamento ?? null,
        descricao: a.descricao,
        historiaResgate: a.historiaResgate ?? null,
        convivencia: a.convivencia ?? null,
        saudeDetalhes: a.saudeDetalhes ?? null,
        dataResgate: a.dataResgate ?? null,
        photos: {
          create: a.photos.map((p, i) => ({
            ...p,
            sortOrder: i,
            isCover: i === 0,
          })),
        },
      },
    });
  }

  const partners = [
    { name: "Clínica Vida Animal", logoUrl: "/parceiros/vida-animal.png", url: "" },
    { name: "Pet Shop Amigo",     logoUrl: "/parceiros/pet-amigo.png",   url: "" },
    { name: "Agro & Vet",         logoUrl: "/parceiros/agro-vet.png",    url: "" },
    { name: "Padaria do Bairro",  logoUrl: "/parceiros/padaria-bairro.png", url: "" },
    { name: "FM Cidade",          logoUrl: "/parceiros/fm-cidade.png",   url: "" },
  ];

  await prisma.partner.createMany({
    data: partners.map((p, idx) => ({ ...p, order: idx, active: true })),
  });

  const now = new Date();
  const addDays = (n: number) => new Date(now.getTime() + n * 86400000);

  const events = [
    {
      title: "Feira de Adoção — Praça Central",
      slug: "feira-de-adocao-praca-central",
      startsAt: addDays(14),
      endsAt: addDays(14),
      location: "Praça Central",
      city: "Centro",
      coverUrl: "/eventos/feira.jpg",
      excerpt: "Venha conhecer nossos peludos e levar amor pra casa!",
      content: "Evento com triagem, orientação e muita fofura.",
      published: true,
    },
    {
      title: "Mutirão de Castração",
      slug: "mutirao-de-castracao",
      startsAt: addDays(28),
      location: "Clínica Parceira",
      city: "Bairro Sul",
      coverUrl: "/eventos/mutirao.jpg",
      excerpt: "Vagas limitadas, valores sociais.",
      content: "Inscrições pelo WhatsApp do Instituto.",
      published: true,
    },
    {
      title: "Ação no Parque — Dia das Crianças",
      slug: "acao-no-parque-dia-das-criancas",
      startsAt: addDays(-20),
      location: "Parque Municipal",
      city: "Zona Norte",
      coverUrl: "/eventos/parque.jpg",
      excerpt: "Brincadeiras, educação e adoção responsável.",
      content: "Obrigada a todos os voluntários e parceiros!",
      published: true,
    },
  ];

  await prisma.event.createMany({ data: events });

  await prisma.donationSettings.create({
    data: {
      id: "singleton",
      pixKey: "contato@institutobethleite.org",
      pixKeyType: "EMAIL",
      bankName: "Banco Exemplo",
      bankAgency: "0001",
      bankAccount: "12345-6",
      bankHolder: "Instituto Beth Leite",
      recurringLink: "https://pagamentos.exemplo/recorrencia",
      itemsWanted:
        "- Ração (cão e gato)\n- Tapete higiênico\n- Areia higiênica\n- Remédios e antipulgas\n- Produtos de limpeza",
      collectionPoints: {
        create: [
          {
            name: "Pet Shop Amigo",
            address: "Rua das Flores, 100",
            hours: "Seg a Sáb, 9h às 18h",
            phone: "(00) 00000-0000",
            order: 0,
          },
          {
            name: "Padaria do Bairro",
            address: "Av. Central, 200",
            hours: "Diariamente, 7h às 20h",
            phone: "(00) 11111-1111",
            order: 1,
          },
        ],
      },
    },
  });

  const adminPass = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@ibl.local",
      name: "Admin",
      password: adminPass,
      role: "ADMIN",
    },
  });

  console.log(`✅ Seed concluído com:
  • ${items.length} animais
  • ${partners.length} parceiros
  • ${events.length} eventos
  • 1 DonationSettings + ${2} pontos de coleta
  • 1 usuário admin (admin@ibl.local / admin123)`);
  console.timeEnd("seed");
}

run().finally(() => prisma.$disconnect());
