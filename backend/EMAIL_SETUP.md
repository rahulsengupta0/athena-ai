# Email Service Setup for Team Invitations

To enable email invitations, you need to configure email settings in your `.env` file.

## Installation

First, install nodemailer:
```bash
cd backend
npm install nodemailer
```

## Email Configuration

Add the following environment variables to your `backend/.env` file:

### Option 1: Gmail (Recommended for Development)

```env
# Gmail SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Settings
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Athena AI
FRONTEND_URL=http://localhost:5173
```

**Important for Gmail:**
1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
   - Use this app password (not your regular password) in `SMTP_PASS`

### Option 2: Other SMTP Services

For other email services (SendGrid, Mailgun, AWS SES, etc.), update the SMTP settings:

```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
EMAIL_FROM=your-email@yourdomain.com
EMAIL_FROM_NAME=Athena AI
FRONTEND_URL=http://localhost:5173
```

### Option 3: Development/Testing (No Email)

If you don't want to set up email for development, the system will still create invites in the database. You can manually share the invite token or accept invites through the API.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SMTP_HOST` | SMTP server hostname | Yes | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | Yes | `587` |
| `SMTP_USER` | SMTP username/email | Yes | - |
| `SMTP_PASS` | SMTP password/app password | Yes | - |
| `EMAIL_FROM` | Sender email address | Yes | `SMTP_USER` |
| `EMAIL_FROM_NAME` | Sender display name | No | `Athena AI` |
| `FRONTEND_URL` | Frontend URL for invite links | Yes | `http://localhost:5173` |

## Testing Email

After configuration, restart your backend server and try sending an invite. Check the server logs for email sending status.

## Troubleshooting

1. **Email not sending**: Check server logs for errors
2. **Gmail authentication failed**: Make sure you're using an App Password, not your regular password
3. **Connection timeout**: Check your firewall/network settings
4. **Invalid credentials**: Verify your SMTP_USER and SMTP_PASS are correct

## Production Recommendations

For production, consider using:
- **SendGrid** - Reliable email delivery service
- **AWS SES** - Scalable email service
- **Mailgun** - Developer-friendly email API
- **Postmark** - Transactional email service

These services provide better deliverability and analytics than SMTP.

