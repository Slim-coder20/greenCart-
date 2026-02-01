const PRIMARY_COLOR = "#00b894";

/**
 * HTML template for user confirmation email
 * @param {string} name - User's name
 * @returns {string} HTML string
 */
export const getUserEmailHtml = (name) => `
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
            <td style="background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #009975 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">FoodStore</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #1a1a1a;">Hello ${name}!</h1>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Thank you for contacting <strong>FoodStore</strong>. We have received your message.
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Our team will get back to you as soon as possible.
              </p>
              <div style="background-color: #f0fdf4; border-left: 4px solid ${PRIMARY_COLOR}; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #166534;">✓ Your message has been successfully received</p>
              </div>
              <p style="margin: 32px 0 0; font-size: 14px; color: #9ca3af;">
                Best regards,<br><strong>The FoodStore Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} FoodStore. All rights reserved.
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
