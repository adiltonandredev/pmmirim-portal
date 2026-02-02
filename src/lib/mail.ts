import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email: string, token: string) {
  // Configuração do servidor (MANTIDO)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/login/redefinir-senha?token=${token}`;

  // Novo Layout Profissional (HTML)
  await transporter.sendMail({
    from: '"Portal Polícia Militar Mirim" <nao-responda@pmmirimmedici.org.br>',
    to: email,
    subject: "Redefinição de Senha - Acesso Administrativo",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #1e3a8a; padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
          .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { background-color: #1e3a8a; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
             <h1>Polícia Mirim</h1>
          </div>
          
          <div class="content">
            <h2 style="color: #0f172a; margin-top: 0;">Olá,</h2>
            <p>Recebemos uma solicitação para redefinir a senha do seu acesso ao <strong>Painel Administrativo</strong>.</p>
            <p>Se foi você quem solicitou, clique no botão abaixo para criar uma nova senha segura:</p>
            
            <div class="button-container">
              <a href="${resetLink}" class="button">Redefinir Minha Senha</a>
            </div>

            <p style="font-size: 14px; color: #64748b;">
              Este link é válido por <strong>1 hora</strong>. <br>
              Se você não solicitou esta alteração, por favor ignore este e-mail. Nenhuma ação é necessária.
            </p>
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Polícia Mirim de Presidente Médici - RO.<br>Todos os direitos reservados.</p>
            <p>Este é um e-mail automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}