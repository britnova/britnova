export type ContactEmailTemplateData = {
  name: string;
  email: string;
  service: string;
  message: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderContactEmailTemplate({
  name,
  email,
  service,
  message,
}: ContactEmailTemplateData): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeService = escapeHtml(service);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');
  const emailHref = `mailto:${encodeURIComponent(email)}`;

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Project Inquiry</title>
      </head>
      <body style="margin:0; padding:0; background-color:#050505; color:#F5F5F5; font-family:Inter, Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; background-color:#050505; margin:0; padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; max-width:640px; background-color:#0D0D0D; border:1px solid #1A1A1A; border-radius:20px; overflow:hidden;">
                <tr>
                  <td style="padding:28px 32px 22px; border-bottom:1px solid #1A1A1A; background-color:#0D0D0D;">
                    <p style="margin:0 0 12px; color:#6C5CE7; font-family:'JetBrains Mono', Consolas, monospace; font-size:11px; font-weight:700; letter-spacing:0.16em; line-height:1.4; text-transform:uppercase;">
                      New Lead
                    </p>
                    <h1 style="margin:0; color:#F5F5F5; font-family:Outfit, Inter, Arial, sans-serif; font-size:34px; font-weight:900; line-height:0.95; letter-spacing:0; text-transform:uppercase;">
                      Project Inquiry
                    </h1>
                    <p style="margin:14px 0 0; color:#8F8F8F; font-size:14px; font-weight:400; line-height:1.7;">
                      A new contact form submission came in from the Britnova Technologies website.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:28px 32px 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:0 0 14px;">
                          <p style="margin:0 0 6px; color:#8F8F8F; font-family:'JetBrains Mono', Consolas, monospace; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Name</p>
                          <p style="margin:0; color:#F5F5F5; font-size:16px; font-weight:700; line-height:1.5;">${safeName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0; border-top:1px solid #1A1A1A;">
                          <p style="margin:0 0 6px; color:#8F8F8F; font-family:'JetBrains Mono', Consolas, monospace; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Email</p>
                          <p style="margin:0; color:#F5F5F5; font-size:16px; font-weight:700; line-height:1.5;">
                            <a href="${emailHref}" style="color:#F5F5F5; text-decoration:none;">${safeEmail}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0; border-top:1px solid #1A1A1A;">
                          <p style="margin:0 0 6px; color:#8F8F8F; font-family:'JetBrains Mono', Consolas, monospace; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Project Scope</p>
                          <p style="margin:0; color:#6C5CE7; font-size:16px; font-weight:800; line-height:1.5;">${safeService}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 32px 32px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505; border:1px solid #1A1A1A; border-radius:16px;">
                      <tr>
                        <td style="padding:22px 24px;">
                          <p style="margin:0 0 12px; color:#8F8F8F; font-family:'JetBrains Mono', Consolas, monospace; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Message</p>
                          <p style="margin:0; color:#F5F5F5; font-size:15px; font-weight:400; line-height:1.75;">${safeMessage}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 32px 24px; border-top:1px solid #1A1A1A; background-color:#0D0D0D;">
                    <p style="margin:0; color:#8F8F8F; font-size:12px; line-height:1.6;">
                      Reply directly to this email to contact ${safeName}.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
