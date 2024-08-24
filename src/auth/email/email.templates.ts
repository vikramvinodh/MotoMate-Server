export const emailResetPasswordTemplate = (resetUrl: string) => {
    return `
     <html> 
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                    h1 { color: #333; }
                    p { color: #555; }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: #fff !important;
                        background-color: #007BFF;
                        text-decoration: none;
                        border-radius: 4px;
                        margin-top: 10px;
                    }
                    .footer { font-size: 12px; color: #999; text-align: center; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Password Reset Request</h1>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Please click the button below to set a new password:</p>
                    <a href="${resetUrl}" class="button">Reset Password</a>
                    <p>If you did not request this change, you can ignore this email.</p>
                    <p>Thank you!</p>
                    <p class="footer">This is an automated message. Please do not reply to this email.</p>
                </div>
            </body>
        </html>`
} 