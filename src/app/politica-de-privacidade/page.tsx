import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade do Instituto Beth Leite para o site e aplicativo Android.",
};

const updatedAt = "6 de maio de 2026";

export default function PoliticaDePrivacidadePage() {
  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-card ring-1 ring-neutral-200 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
          Instituto Beth Leite
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">
          Política de Privacidade
        </h1>
        <p className="mt-3 text-sm text-neutral-600">Última atualização: {updatedAt}</p>

        <div className="mt-8 space-y-8 text-neutral-700">
          <Section title="1. Sobre esta política">
            <p>
              Esta Política de Privacidade explica como o Instituto Beth Leite coleta, usa,
              armazena e protege informações fornecidas por usuários no site e no aplicativo
              Android do Instituto Beth Leite.
            </p>
          </Section>

          <Section title="2. Informações que podemos coletar">
            <p>
              Podemos coletar dados informados voluntariamente pelo usuário em formulários de
              adoção, contato, cadastro, login, doações, solicitações ou outras interações com o
              Instituto. Esses dados podem incluir nome, e-mail, telefone, endereço, mensagem,
              preferências de adoção e informações necessárias para análise de solicitações.
            </p>
          </Section>

          <Section title="3. Como usamos as informações">
            <p>
              Utilizamos as informações para responder contatos, analisar solicitações de adoção,
              administrar eventos, divulgar animais disponíveis, melhorar nossos serviços, manter a
              segurança da plataforma e cumprir obrigações legais ou regulatórias aplicáveis.
            </p>
          </Section>

          <Section title="4. Compartilhamento de dados">
            <p>
              Não vendemos dados pessoais. As informações podem ser compartilhadas apenas quando
              necessário para operar a plataforma, atender solicitações do usuário, cumprir
              obrigações legais ou contar com serviços técnicos de hospedagem, banco de dados,
              envio de e-mails e armazenamento de imagens.
            </p>
          </Section>

          <Section title="5. Serviços de terceiros">
            <p>
              O site e o aplicativo podem utilizar provedores de infraestrutura, hospedagem, banco
              de dados, e-mail e armazenamento de imagens, como Vercel, Neon, Cloudinary e serviços
              equivalentes. Esses provedores podem processar dados técnicos necessários para a
              operação segura da plataforma.
            </p>
          </Section>

          <Section title="6. Cookies e dados técnicos">
            <p>
              Podemos usar cookies, armazenamento local e tecnologias semelhantes para manter
              sessões, melhorar a experiência do usuário, proteger áreas administrativas e analisar
              o funcionamento da plataforma. Também podem ser coletados dados técnicos, como tipo de
              dispositivo, navegador, endereço IP e registros de acesso.
            </p>
          </Section>

          <Section title="7. Segurança">
            <p>
              Adotamos medidas técnicas e organizacionais razoáveis para proteger as informações
              contra acesso não autorizado, perda, alteração ou divulgação indevida. Apesar disso,
              nenhum sistema é totalmente imune a riscos.
            </p>
          </Section>

          <Section title="8. Direitos do usuário">
            <p>
              O usuário pode solicitar acesso, correção, atualização ou exclusão de seus dados
              pessoais, quando aplicável. Também pode pedir informações sobre o tratamento de seus
              dados entrando em contato conosco.
            </p>
          </Section>

          <Section title="9. Crianças e adolescentes">
            <p>
              O aplicativo não é direcionado a crianças menores de 13 anos. Caso identifiquemos
              coleta indevida de dados de menores sem autorização apropriada, tomaremos medidas para
              remover essas informações.
            </p>
          </Section>

          <Section title="10. Alterações nesta política">
            <p>
              Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre
              disponível nesta página.
            </p>
          </Section>

          <Section title="11. Contato">
            <p>
              Para dúvidas, solicitações ou assuntos relacionados à privacidade, entre em contato
              pelo e-mail:
            </p>
            <p className="mt-2 font-semibold text-neutral-900">
              contato@institutobethleite.com.br
            </p>
          </Section>
        </div>
      </article>
    </Container>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
      <div className="mt-3 leading-7">{children}</div>
    </section>
  );
}
