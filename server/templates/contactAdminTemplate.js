const PRIMARY_COLOR = "#00b894";

/**
 * HTML template for admin notification email
 * @param {string} name - Sender's name
 * @param {string} email - Sender's email
 * @param {string} messageContent - Message content (will be escaped for HTML)
 * @returns {string} HTML string
 */
export const getAdminEmailHtml = (name, email, messageContent) => {
  const escapedContent = messageContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">FoodStore</h1>
              <p style="margin: 12px 0 0; font-size: 13px; color: #ffffff; letter-spacing: 0.5px; opacity: 0.9;">NEW MESSAGE - ADMIN</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 24px; font-size: 20px; font-weight: 600; color: #1a1a1a;">New message received</h1>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9fafb; font-size: 12px; font-weight: 600; color: #6b7280; width: 120px;">Name</td>
                  <td style="padding: 12px 16px; font-size: 14px; color: #1a1a1a;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9fafb; font-size: 12px; font-weight: 600; color: #6b7280;">Email</td>
                  <td style="padding: 12px 16px;">
                    <a href="mailto:${email}" style="color: ${PRIMARY_COLOR}; text-decoration: none;">${email}</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #6b7280;">Message:</p>
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${escapedContent}</p>
              </div>
              <a href="mailto:${email}" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">Reply to ${name}</a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 16px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                FoodStore - Admin Dashboard • ${new Date().toLocaleString("en-US")}
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
};
