import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email: string, token: string) {
  
  // 1. Configuração alinhada com as Variáveis da Vercel
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,      // Antes era SMTP_HOST
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false, // true para 465, false para outras portas (587 usa STARTTLS)
    auth: {
      user: process.env.EMAIL_SERVER_USER,    // Antes era SMTP_USER
      pass: process.env.EMAIL_SERVER_PASSWORD, // Antes era SMTP_PASS
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/login/redefinir-senha?token=${token}`;

  // 2. Envio do E-mail
  await transporter.sendMail({
    // O Gmail exige que o 'from' seja igual ao usuário autenticado ou um alias válido
    from: `"Portal Polícia Militar Mirim" <${process.env.EMAIL_FROM}>`, 
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
             <h1>Polícia Militar Mirim</h1>
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
            <p>Este é um e-mail automático.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string, temporaryPassword: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/login`;

  await transporter.sendMail({
    from: `"Portal Polícia Militar Mirim" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Bem-vindo ao Painel Administrativo - Polícia Militar Mirim",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: bold; }
          .badge { display: inline-block; background: #fbbf24; color: #1e3a8a; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-top: 8px; letter-spacing: 1px; }
          .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
          .cred-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin: 24px 0; }
          .cred-label { font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
          .cred-value { font-size: 16px; font-weight: bold; color: #0f172a; font-family: monospace; background: #e2e8f0; padding: 8px 12px; border-radius: 4px; display: block; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { background-color: #1e3a8a; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 15px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #92400e; margin-top: 20px; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Polícia Militar Mirim</h1>
            <span class="badge">Acesso Administrativo</span>
          </div>
          <div class="content">
            <h2 style="color: #0f172a; margin-top: 0;">Olá, ${name}!</h2>
            <p>Você recebeu acesso ao <strong>Painel Administrativo</strong> do Portal da Polícia Militar Mirim de Presidente Médici.</p>
            <p>Use as credenciais abaixo para fazer seu primeiro login:</p>

            <div class="cred-box">
              <div class="cred-label">E-mail de acesso</div>
              <span class="cred-value">${email}</span>
              <div class="cred-label" style="margin-top: 16px;">Senha temporária</div>
              <span class="cred-value">${temporaryPassword}</span>
            </div>

            <div class="button-container">
              <a href="${loginUrl}" class="button">Acessar o Painel</a>
            </div>

            <div class="warning">
              <strong>Importante:</strong> Por segurança, altere sua senha assim que fizer o primeiro acesso.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Polícia Militar Mirim de Presidente Médici - RO.</p>
            <p>Este é um e-mail automático. Não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}