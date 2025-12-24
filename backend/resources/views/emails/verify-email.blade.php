<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0b;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #1f1f23; border-radius: 12px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Auto Workshop</h1>
                            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Professional Car Service & Repairs</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                            <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                                Thank you for registering with Auto Workshop! To complete your registration and start booking services, please verify your email address by clicking the button below.
                            </p>

                            <!-- Button -->
                            <table role="presentation" style="margin: 30px 0;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">
                                        <a href="{{ $verificationUrl }}" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none;">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 0 0 20px; color: #a855f7; font-size: 14px; word-break: break-all;">
                                {{ $verificationUrl }}
                            </p>

                            <p style="margin: 30px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                                This verification link will expire in 24 hours. If you didn't create an account with us, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #18181b; border-top: 1px solid #27272a;">
                            <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
                                &copy; {{ date('Y') }} Auto Workshop. All rights reserved.<br>
                                This is an automated message, please do not reply directly to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
