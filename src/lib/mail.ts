import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Gmail usa STARTTLS na 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
export async function sendResetEmail(to: string, link: string) {
  await transporter.sendMail({
    from: `"Instituto Beth Leite - Suporte" <${process.env.SMTP_USER}>`,
    to,
    subject: "Redefinição de senha",
    html: `
      <p>Você solicitou a redefinição de senha.</p>

      <p>
        <a href="${link}">
          Clique aqui para redefinir sua senha
        </a>
      </p>

      <p>Este link expira em <strong>1 hora</strong>.</p>

      <p style="font-size:12px;color:#666">
        Se você não solicitou, ignore este e-mail.
      </p>
    `,
  });
}

export async function sendAdminNotification(to: string[], userName: string, userEmail: string) {
  if (to.length === 0) return;

  await transporter.sendMail({
    from: `"Instituto Beth Leite" <${process.env.SMTP_USER}>`,
    to, // lista de admins
    subject: "Novo usuário aguardando aprovação",
    html: `
      <p>Um novo usuário solicitou acesso ao sistema.</p>

      <ul>
        <li><strong>Nome:</strong> ${userName}</li>
        <li><strong>E-mail:</strong> ${userEmail}</li>
      </ul>

      <p>
        <a href="${process.env.APP_URL}/admin/users">
          Acessar painel de usuários
        </a>
      </p>
    `,
  });
}

export async function sendUserApprovedEmail(to: string, userName: string) {
  await transporter.sendMail({
    from: `"Instituto Beth Leite" <${process.env.SMTP_USER}>`,
    to,
    subject: "Conta aprovada – acesso liberado",
    html: `
      <p>Olá, ${userName}!</p>

      <p>Sua conta foi <strong>aprovada</strong>.</p>

      <p>
        Você já pode acessar o painel administrativo do sistema.
      </p>

      <p>
        <a href="${process.env.APP_URL}/login">
          Acessar o sistema
        </a>
      </p>

      <p style="font-size:12px;color:#666">
        Caso tenha dúvidas, entre em contato com o suporte.
      </p>
    `,
  });
}

export async function sendAdoptionRequestNotification(
  to: string[],
  animalName: string,
  applicantName: string,
  applicantEmail: string
) {
  if (to.length === 0) return;

  await transporter.sendMail({
    from: `"Instituto Beth Leite" <${process.env.SMTP_USER}>`,
    to,
    subject: "Nova solicitação de adoção recebida",
    html: `
      <p>Uma nova solicitação de adoção foi enviada.</p>

      <ul>
        <li><strong>Animal:</strong> ${animalName}</li>
        <li><strong>Nome:</strong> ${applicantName}</li>
        <li><strong>E-mail:</strong> ${applicantEmail}</li>
      </ul>

      <p>
        <a href="${process.env.APP_URL}/admin/requests">
          Abrir painel de solicitações
        </a>
      </p>
    `,
  });
}

export async function sendRequestStatusEmail(
  to: string,
  applicantName: string,
  animalName: string,
  status: "CONTATADO" | "NAO_ELEGIVEL"
) {
  const subject =
    status === "CONTATADO"
      ? "Sua solicitação de adoção foi analisada"
      : "Atualização sobre sua solicitação de adoção";

  const message =
    status === "CONTATADO"
      ? `
        <p>Olá, ${applicantName}!</p>
        <p>Sua solicitação para adoção de <strong>${animalName}</strong> foi analisada.</p>
        <p>Nossa equipe entrará em contato com você em breve.</p>
      `
      : `
        <p>Olá, ${applicantName}!</p>
        <p>
          Agradecemos seu interesse em adotar <strong>${animalName}</strong>,
          porém neste momento sua solicitação não foi aprovada.
        </p>
        <p>Continue acompanhando, outros animais podem precisar de você 💚</p>
      `;

  await transporter.sendMail({
    from: `"Instituto Beth Leite" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: `
      ${message}
      <p style="margin-top:16px">
        <a href="${process.env.APP_URL}/animais">
          Ver outros animais
        </a>
      </p>
    `,
  });
}

export async function sendRequestApprovedEmail(
  to: string,
  applicantName: string,
  animalName: string
) {
  await transporter.sendMail({
    from: `"Instituto Beth Leite" <${process.env.SMTP_USER}>`,
    to,
    subject: "Adoção aprovada 🎉",
    html: `
      <p>Olá, ${applicantName}!</p>

      <p>
        Temos uma ótima notícia! Sua solicitação para adoção de
        <strong>${animalName}</strong> foi <strong>APROVADA</strong>.
      </p>

      <p>
        Em breve entraremos em contato para os próximos passos.
      </p>

      <p style="margin-top:16px">
        <strong>Obrigado por adotar 💚</strong>
      </p>
    `,
  });
}
