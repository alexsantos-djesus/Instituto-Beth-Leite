import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Exclusão de Conta",
  description:
    "Solicitação de exclusão de conta e dados do aplicativo Instituto Beth Leite.",
};

export default function ExclusaoDeContaPage() {
  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-card ring-1 ring-neutral-200 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
          Instituto Beth Leite
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">
          Exclusão de conta e dados
        </h1>
        <p className="mt-3 text-neutral-700">
          Usuários do aplicativo Instituto Beth Leite podem solicitar a exclusão da conta e dos
          dados pessoais associados a ela.
        </p>

        <div className="mt-8 space-y-8 text-neutral-700">
          <Section title="Como solicitar a exclusão">
            <p>
              Envie um e-mail para{" "}
              <a
                className="font-semibold text-brand-secondary underline"
                href="mailto:contato@institutobethleite.com.br?subject=Solicitação%20de%20exclusão%20de%20conta"
              >
                contato@institutobethleite.com.br
              </a>{" "}
              com o assunto <strong>Solicitação de exclusão de conta</strong>.
            </p>
            <p className="mt-3">
              No corpo do e-mail, informe o nome e o e-mail usado para criar a conta no aplicativo.
              Essas informações são necessárias para localizar a conta correta.
            </p>
          </Section>

          <Section title="O que será excluído">
            <p>
              Após a confirmação da solicitação, poderemos excluir ou anonimizar dados associados à
              conta, como nome, e-mail, senha criptografada, instituição, foto de perfil e dados de
              cadastro vinculados ao acesso do usuário.
            </p>
          </Section>

          <Section title="Dados que podem ser mantidos">
            <p>
              Algumas informações podem ser mantidas quando necessário para cumprir obrigações
              legais, preservar registros administrativos, prevenir fraude, resolver disputas,
              proteger direitos do Instituto ou manter histórico de solicitações já atendidas.
            </p>
          </Section>

          <Section title="Prazo de atendimento">
            <p>
              As solicitações serão analisadas e respondidas em prazo razoável. Caso seja necessária
              alguma confirmação adicional de identidade, entraremos em contato pelo e-mail usado na
              solicitação.
            </p>
          </Section>

          <Section title="Exclusão de outros dados">
            <p>
              O usuário também pode solicitar a exclusão de dados pessoais enviados em formulários
              de contato, adoção ou outras interações com o Instituto, quando aplicável.
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
