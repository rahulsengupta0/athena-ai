const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development, you can use Gmail or other SMTP services
  // For production, use a proper email service like SendGrid, AWS SES, etc.
  
  // Get email credentials from environment variables
  // Support multiple naming conventions: SMTP_*, EMAIL_*, or EMAIL_PASS
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    throw new Error('Email credentials not configured. Please set SMTP_USER/SMTP_PASS or EMAIL_USER/EMAIL_PASSWORD (or EMAIL_PASS) in .env file');
  }
  
  // Using Gmail as example (you'll need to set up App Password)
  // For other services, update the config accordingly
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

// Send team invitation email
const sendInviteEmail = async (email, inviteToken, inviterName, role) => {
  try {
    const transporter = createTransporter();
    
    // Frontend URL where users can accept invites
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const acceptUrl = `${frontendUrl}/team/accept?token=${inviteToken}`;
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Athena AI'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: `You've been invited to join ${inviterName}'s team on Athena AI`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #7c3aed;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #7c3aed;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background: #6d28d9;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
            .info-box {
              background: #f3f4f6;
              border-left: 4px solid #7c3aed;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Athena AI</div>
              <h1>Team Invitation</h1>
            </div>
            
            <p>Hello,</p>
            
            <p><strong>${inviterName}</strong> has invited you to join their team on Athena AI as a <strong>${role}</strong>.</p>
            
            <div class="info-box">
              <strong>Role:</strong> ${role === 'admin' ? 'Admin - Can manage team members and projects' : 'Member - Can view and collaborate on projects'}
            </div>
            
            <p>Click the button below to accept the invitation and join the team:</p>
            
            <div style="text-align: center;">
              <a href="${acceptUrl}" class="button">Accept Invitation</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${acceptUrl}</p>
            
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Note:</strong> This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
            </p>
            
            <div class="footer">
              <p>This email was sent by Athena AI Team Management System.</p>
              <p>If you have any questions, please contact the team owner.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Team Invitation
        
        Hello,
        
        ${inviterName} has invited you to join their team on Athena AI as a ${role}.
        
        Role: ${role === 'admin' ? 'Admin - Can manage team members and projects' : 'Member - Can view and collaborate on projects'}
        
        Accept the invitation by visiting this link:
        ${acceptUrl}
        
        This invitation will expire in 7 days.
        
        If you didn't expect this invitation, you can safely ignore this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invite email sent successfully to:', email);
    console.log('   Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending invite email to:', email);
    console.error('   Error details:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    throw error;
  }
};

// Send brand kit sharing email
const sendBrandKitShareEmail = async (email, kitName, ownerName) => {
  try {
    const transporter = createTransporter();
    
    // Frontend URL where users can view the brand kit
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // We'll need to find the kitFolder from the kitId, but for now we'll use a direct link
    // The frontend will need to handle routing to the brand kit
    const joinUrl = `${frontendUrl}/projects`; // User will see shared kits in their projects page
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Athena AI'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: `${ownerName} shared a Brand Kit with you: ${kitName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #7c3aed;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: #7c3aed;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
              font-size: 16px;
            }
            .button:hover {
              background: #6d28d9;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
            .info-box {
              background: #f3f4f6;
              border-left: 4px solid #7c3aed;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .kit-name {
              font-size: 20px;
              font-weight: 700;
              color: #7c3aed;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Athena AI</div>
              <h1>Brand Kit Shared</h1>
            </div>
            
            <p>Hello,</p>
            
            <p><strong>${ownerName}</strong> has shared a Brand Kit with you:</p>
            
            <div class="info-box">
              <div class="kit-name">${kitName}</div>
            </div>
            
            <p>You now have access to this Brand Kit and can view all its assets. Click the button below to view it:</p>
            
            <div style="text-align: center;">
              <a href="${joinUrl}" class="button">View Brand Kit</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${joinUrl}</p>
            
            <p style="color: #6b7280; font-size: 14px;">
              The Brand Kit will appear in your Projects page with a "Shared by ${ownerName}" tag.
            </p>
            
            <div class="footer">
              <p>This email was sent by Athena AI Brand Kit Sharing System.</p>
              <p>If you have any questions, please contact ${ownerName}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Brand Kit Shared
        
        Hello,
        
        ${ownerName} has shared a Brand Kit with you: ${kitName}
        
        You now have access to this Brand Kit and can view all its assets.
        
        View the Brand Kit by visiting:
        ${joinUrl}
        
        The Brand Kit will appear in your Projects page with a "Shared by ${ownerName}" tag.
        
        If you have any questions, please contact ${ownerName}.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Brand kit share email sent successfully to:', email);
    console.log('   Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending brand kit share email to:', email);
    console.error('   Error details:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    throw error;
  }
};

module.exports = {
  sendInviteEmail,
  sendBrandKitShareEmail,
  createTransporter,
};

